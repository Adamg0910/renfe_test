/**
 * Reuslt Page Object
 */
import  {BasePage} from './BasePage';

export class ResultPage extends BasePage {
    // Locators
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
        return this.page.locator('//span[text()="Básico"]'); //check the page for the exact selector
    }
    get noDispoIda(){
        return this.page.locator('//p[@id="noDispoIda"]'); //check the page for the exact selector
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

        await this.page.waitForSelector(this.ticketReults, { timeout: 10000 });
        const ticketsCount = await this.findAvailableTickets();
        //const noDispoVisible = await this.noDispoIda.isVisible().catch(() => false);

        // If neither noDispoIda is visible nor tickets are found, throw error
        if (noDispoVisible || ticketsCount === 0) {
            throw new Error("No ticket results found and no 'noDispoIda' message visible");
        }

        if (ticketsCount > 0) {
            await this.getMiddleDayDate.click(); // Ensure all network activity is complete
        }
    }

    /**
     * @returns {Promise<Array>} - Array of ticket result elements
     */
    async getAvailableTicket() {
        return await this.ticketReults.all()
    }
    
    /**
     * Return count of available tickets (matches test expectation)
     * @returns {Promise<number>}
     */
    async findAvailableTickets() {
        return await this.ticketReults.count();
    }
    /**
     * extract ticket infos
     * @param {Locator} ticketElement - Locator for the ticket result element
     * @return {Promise<Object>}
     */
    async extractTicketDetails(ticketElement) {
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
            // Try to get price again after clicking
            const retryCount = await priceLocator.count();
            if (retryCount > 0) {
                priceText = await priceLocator.first().textContent();
            }
        }

        // If still no price, throw error
        if (!priceText || priceText.trim() === "") {
            throw new Error("No price found for this ticket");
        }

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
    async selectTIcket(ticketElement){
        await ticketElement.click();
        await this.page.waitForLoadState('networkidle'); // Wait for navigation to complete after clicking
    }
    
}