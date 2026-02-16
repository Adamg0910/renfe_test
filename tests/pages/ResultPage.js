/**
 * Reuslt Page Object
 */
import  {BasePage} from './BasePage.js';

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

    //Check if the promo modal édialog is visible
    async isPromoUpFieldVisible() {
        if (await this.buttonAceptarConfirmacionFareUpgrade.isVisible()) {
            await this.buttonAceptarConfirmacionFareUpgrade.click();
        }
    }

    /** Wait for results to load by checking the presence of ticket results
    * @returns {Promise<void>}
    */

    //Check there is any option
   async checkResultsLoaded() {
        if (await this.noDispoIda.isVisible()) {
            await this.getMiddleDayDate.click(); // Ensure all network activity is complete
        }
    }
    async waitForResultsToLoad() {
        console.log('Waiting for ticket results...');
        let lastTicketResults = [];

        for (let attempt = 1; attempt <= 3; attempt++) {
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

    /**
     * Check if any travel options exist on the page
     * @returns {Promise<boolean>}
     */
    async hasAnyTravelOptions() {
        const count = await this.travelOptions.count();
        return count > 0;
    }
    
    /**
     * Return count of available tickets with optional attribute details
     * @param {boolean} includeAttributes - If true, returns object with count and attributes
     * @returns {Promise<number|Object>} - Returns count or object with {count, tickets: [{hasPrice, hasDuration}]}
     */
    async findAvailableTickets(includeAttributes = false) {
        const count = await this.travelOptions.count();
        
        if (!includeAttributes) {
            return count;
        }
        
        // Collect attribute information for each ticket
        const tickets = await this.getAvailableTicket();
        const ticketAttributes = [];
        
        for (const ticket of tickets) {
            const priceCount = await ticket.locator(this.priceText).count();
            const durationCount = await ticket.locator(this.durationText).count();
            
            ticketAttributes.push({
                hasPrice: priceCount > 0,
                hasDuration: durationCount > 0
            });
        }
        
        return {
            count,
            ticketsWithPrice: ticketAttributes.filter(t => t.hasPrice).length,
            ticketsWithDuration: ticketAttributes.filter(t => t.hasDuration).length,
            tickets: ticketAttributes
        };
    }
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
        /*
        // If still no price, throw error
        if (!priceText || priceText.trim() === "") {
            await this.getMiddleDayDate.click();
            await this.loadStateImg.waitFor({ state: 'hidden', timeout: 10000 }); 
        }*/

        // Extract numeric price from text
        const price = parseFloat(priceText.replace(/[^0-9,]/g, '').replace(',', '.'));

        return {
            price,
            duration: durationText ? durationText.trim() : '',
            element: ticketElement
        };
    }
    /**Find ticket within price range 50-60
     * @return {Promise<Locator>}
     */
    async findTicketWithinPriceRange(minPrice = 50, maxPrice = 60) {
        const tickets = await this.getAvailableTicket();
        for (const t of tickets) {
            const details = await this.extractTicketDetails(t);
            if (details.price >= minPrice && details.price <= maxPrice) {
                return t;
            }
        }
        throw new Error(`No ticket found within price range ${minPrice}-${maxPrice}`);
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
    }
    
    
}