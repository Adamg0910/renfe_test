/**
 * Reuslt Page Object
 */
import  {BasePage} from './BasePage';
import { TEST_DATA } from '../utils/testData';

export class ResultPage extends BasePage {
    // Locators
get buttonAceptarConfirmacionFareUpgrade(){
    return this.page.locator("//p[@id='aceptarConfirmacionFareUpgrade']"); //confirm fare upgrade button in promo modal, adjust selector as needed based on actual page structure
    }

    get promoUpField(){
        return this.page.locator('//div[@class="modal-dialog modal-promoUp"]').first();
    }
    get travelOptions(){
        return this.page.locator('div.row.selectedTren'); //travel options container, adjust selector as needed based on actual page structure  
    }
    get loadStateImg(){
        return this.page.locator("//img[@class='focusTab seguirTab' and @alt='Cargando el contenido']").first(); //loading spinner image, adjust selector as needed based on actual page structure
    }
    get ticketReults() {
        return this.page.locator('//div[@class="box-total-target .ida-list-data2"]'); //ticekt results container
    }
    get getMiddleDayDate() {
        return this.page.locator('//button[@class="move_to_tomorrow"]').first(); //date picker middle day button
    }
    get priceText() {
        return this.page.locator('//span[@class="precio-final"]'); //price text within ticket result, adjust selector as needed based on actual page structure
    }
    get durationText() {
        return this.page.locator('//span[@class="col entre-horas"]'); //get all the duration text
    }
    get getClass() {
        return this.page.locator('//span[text()="Básico"]'); //class text within ticket result, adjust selector as needed based on actual page structure
    }
    get noDispoIda(){
        return this.page.locator('//p[@id="noDispoIda"]'); //no results message, adjust selector as needed based on actual page structure 
    }
    get selectButton(){
        return this.page.locator('//button[@id="btnSeleccionar"]').first(); //select button within ticket result, adjust selector as needed based on actual page structure
    }

    //Check if the promo modal dialog is visible
    async isPromoUpFieldVisible() {
        if (await this.buttonAceptarConfirmacionFareUpgrade.isVisible()) {
            await this.debugBeforeClick(this.buttonAceptarConfirmacionFareUpgrade, 'buttonAceptarConfirmacionFareUpgrade');
            console.log("-----------Promo Field------------");
            await this.buttonAceptarConfirmacionFareUpgrade.focus();
            await this.buttonAceptarConfirmacionFareUpgrade.click();
            await this.page.waitForLoadState('networkidle');
        }
    }

    /** Wait for results to load by checking the presence of ticket results
    * @returns {Promise<void>}
    */

    //Check there is any option
   async checkResultsLoaded() {
        if (await this.noDispoIda.isVisible()) {
            await this.getMiddleDayDate.click();

        }
    }
    async waitForResultsToLoad() {
        console.log('Waiting for ticket results...');
        let lastTicketResults = [];

        for (let attempt = 1; attempt <= 5; attempt++) {
            await this.travelOptions.first().waitFor({ timeout: 10000 });
            const ticketResults = await this.getAvailableTicket();
            const ticketsCount = ticketResults.length;
            console.log(`Attempt ${attempt}: Found ${ticketsCount} tickets`);
            const noDispoVisible = await this.noDispoIda.isVisible().catch(() => false);

            if (!noDispoVisible && ticketsCount > 0) {
                return ticketResults;
            }

            await this.getMiddleDayDate.click();
            lastTicketResults = ticketResults;
        }

        // Ensure we have at least 1 ticket result after retries
        if (lastTicketResults.length < 1) {
            throw new Error('No travel options available');
        }

        return lastTicketResults;
    }

    /**
     * @returns {Promise<Array>} - Array of ticket result elements
     */
    async getAvailableTicket() {
        return await this.travelOptions.all()
    }

    // /**
    //  * Check if any travel options exist on the page
    //  * @returns {Promise<boolean>}
    //  */
    // async hasAnyTravelOptions() {
    //     const count = await this.travelOptions.count();
    //     return count > 0;
    // }
    
    /**
     * extract ticket infos
     * @param {Locator} ticketElement - Locator for the ticket result element
     * @return {Promise<Object>}
     */
    async extractTicketDetails(ticketElement) {
        const ticketCount = await ticketElement.count();
        if (ticketCount < 1) {
            throw new Error('No available ticket element provided');
        }
        // Check if price element exists for this ticket
        const priceLocator = ticketElement.locator(this.priceText);
        const priceCount = await priceLocator.count();
        let priceText = null;
        if (priceCount > 0) {
            priceText = await priceLocator.first().textContent();
        }
        let durationText = await ticketElement.locator(this.durationText).textContent();

        // If price is not found, click getMiddleDayDate and try again
        if (!priceText || priceText.trim() === "") {
            await this.getMiddleDayDate.click();
            await this.loadStateImg.waitFor({ state: 'hidden', timeout: 10000 }); // Wait for loading spinner to disappear
            
            // Try to get price again after clicking
            const retryCount = await priceLocator.count();
            if (retryCount > 0) {
                priceText = await priceLocator.first().textContent();
            }
        }


        // Extract numeric price from text
        const normalizedPriceText = (priceText || '').replace(/[^0-9,]/g, '').replace(',', '.');
        const price = normalizedPriceText ? parseFloat(normalizedPriceText) : Number.NaN;

        return {
            price,
            duration: durationText ? durationText.trim() : '',
            element: ticketElement
        };
    }
    /**Find ticket within price range
     * @param {number} minPrice - Minimum price (from TEST_DATA.MIN_PRICE)
     * @param {number} maxPrice - Maximum price (from TEST_DATA.MAX_PRICE)
     * @return {Promise<Locator>}
     */
    async findTicketWithinPriceRange(minPrice = TEST_DATA.MIN_PRICE, maxPrice = TEST_DATA.MAX_PRICE) {
        let lastTicketsCount = 0;

        for (let attempt = 1; attempt <= 5; attempt++) {
            const tickets = await this.getAvailableTicket();
            const ticketsCount = tickets.length;
            lastTicketsCount = ticketsCount;

            console.log(`Attempt ${attempt}: Found ${ticketsCount} tickets. Searching for ticket in price range ${minPrice}-${maxPrice}€`);
            const noDispoVisible = await this.noDispoIda.isVisible().catch(() => false);

            if (ticketsCount === 0 || noDispoVisible) {
                if (attempt < 5) {
                    console.log('No available tickets, clicking to load next day...');
                    await this.getMiddleDayDate.click();
                    await this.loadStateImg.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
                    continue;
                }
                break;
            }
            
            for (const t of tickets) {
                const details = await this.extractTicketDetails(t);
                console.log(`Found ticket with price: ${details.price}€`);
                if (Number.isFinite(details.price) && details.price >= minPrice && details.price <= maxPrice) {
                    console.log(`✓ Ticket found within price range: ${details.price}€`);
                    return t;
                }
            }//rows.locator('').allTextContents()
            
            // If no ticket found in range and not the last attempt, click to get next day's tickets
            if(attempt < 5){
                console.log('No ticket found in range, clicking to load next day...');
                await this.getMiddleDayDate.click();
                await this.loadStateImg.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
            }
         }

        
        throw new Error(`No ticket found within price range ${minPrice}-${maxPrice}€ after 5 attempts (last attempt had ${lastTicketsCount} tickets)`);
    }
    /**
     * Select ticket
     * @param {Locator} ticketElement - Locator for the ticket result element
     */
    async selectTicket(ticketElement){
        await ticketElement.click();
        await this.page.waitForLoadState('networkidle'); // Wait for navigation to complete after clicking
    }

    async debugBeforeClick(locator, name = 'locator') {
        const count = await locator.count();
        const isVisible = count > 0 ? await locator.first().isVisible() : false;
        console.log(`[debug] ${name} count=${count}, visible=${isVisible}`);
        return { count, isVisible };
    }

    async clickBasicFare() {
        await this.debugBeforeClick(this.getClass, 'getClass');
        await this.getClass.click();
        await this.page.waitForLoadState('networkidle');
    }

    async isBasicFareVisible() {
        try {
            await this.getClass.waitFor({ timeout: 5000 });
            return true
        } catch (error) {
            return false;
        }
    }
    async clickContinueButton() {
        await this.selectButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.buttonAceptarConfirmacionFareUpgrade.waitFor({timeout: 10000});
    }
    
    
}