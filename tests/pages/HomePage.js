/** HomePage class extends BasePage 
 * Represents the RENFE homepage and search functionality
*/
import { BasePage } from "./BasePage.js";
import { getFutureDate } from "../utils/testData.js";

export class HomePage extends BasePage {
    // Locators
    
    get dateOfDepartureInput() {
        return this.page.locator('//input[@id="first-input"]');
    }
    get oneWayRadio() {
        return this.page.locator('//label[contains(text(),"Viaje solo ida")]').first();// span[@class="lightpick__border"]  div[@class="lightpick__trip-header"]
    }
    get oneWayTab() {
        return this.page.locator('//label[@class="lightpick__label"]').first();
    }
    get originStation() {
        return this.page.locator('//input[@id="origin"]');
    }
    get destinationStation() {
        return this.page.locator('//input[@id="destination"]');
    }
    get departureDate() {//departure date input need ot resolve
        return this.page.locator('//input[@class="rf-daterange-picker-alternative__input"]');//input[@class='rf-daterange-picker-alternative__ipt']
    }
    get searchButton() {   
        return this.page.locator('//button[@type="submit"]');
    }
    get focusOnAlertDialog(){
        return this.page.locator('//div[@class="ot-sdk-container"]');
    }
    get acceptCookiesButton() {
        return this.page.locator('//button[@id="onetrust-accept-btn-handler"]').first();// button:has-text("Accept"), button:has-text("Aceptar"), button:has-text("accept all"), [data-testid="accept-cookies"]
    }
    
    /**
     * Accept all cookies
     */
    async acceptCookies() {
        try {
            const cookieButton = this.acceptCookiesButton;
            if (await cookieButton.isVisible({ timeout: 10000 })) {
                // Focus the alert dialog first
                try {
                    const alertDialog = this.focusOnAlertDialog;
                    if (await alertDialog.isVisible({ timeout: 2000 })) {
                        await alertDialog.evaluate((el) => {
                            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
                            el.focus();
                        });
                        await this.page.waitForTimeout(100);
                    }
                } catch (e) {
                    // ignore if dialog not found
                }

                // Click cookie button with Enter fallback
                try {
                    await cookieButton.click();
                } catch (clickErr) {
                    try {
                        await cookieButton.press('Enter');
                    } catch (pressErr) {
                        await this.page.keyboard.press('Enter');
                    }
                }
                await this.page.waitForLoadState('networkidle');
            }
        } catch (error) {
            // Cookie banner might not be present, continue with test
        }
    }

    /**
     * Wait for the entire page to be fully loaded
     */
    async waitForPageToLoad() {
        // Wait for network to be idle
        await this.page.waitForLoadState('networkidle');
        
        // Wait for key page elements to be visible
        await this.dateOfDepartureInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.originStation.waitFor({ state: 'visible', timeout: 10000 });
        await this.destinationStation.waitFor({ state: 'visible', timeout: 10000 });
        await this.searchButton.waitFor({ state: 'visible', timeout: 10000 });
    }
    
    //Select one way Journey
    async selectOneWayJourney() {
        await this.dateOfDepartureInput.click();
        await this.oneWayTab.waitFor({ state: 'visible', timeout: 7000 });
        await this.oneWayRadio.waitFor({ state: 'visible', timeout: 7000 });
        await this.oneWayRadio.click();
        //await this.dateOfDeparture.click();
    }
    
    /**
     * Set departure date
    *@param {string|number} dateOrDays - Date in format 'YYYY-MM-DD' or number of days from now
    *//**
    async setDepartureDate(dateOrDays) {
        const date = typeof dateOrDays === 'number' ? getFutureDate(dateOrDays) : dateOrDays;
        await this.departureDate.fill(date);
        await this.page.waitForLoadState('networkidle'); // 
    }*/
   
    /** Fill origin station - Mardird - Atocha
     * @param {string} station
     */
    async fillOriginStation(station) {
        await this.originStation.fill(station);
        // wait for dropdown options to appear
        await this.page.waitForSelector('li[role="option"]', { timeout: 5000 });
    }

    /** Select droppdown
     * @param {string} optionText
     */
    async selectFromDropdown(optionText) {
        const option = this.page.locator('li[role="option"]', { hasText: optionText }).first();
        await option.click();
        await this.page.waitForLoadState('networkidle'); // Wait for dropdown to close 
    }

    /**
     * Fill destination station - Barcelona - Sants
     * @param {string} station
     */
    async fillDestinationStation(station) {
        await this.destinationStation.fill(station);
        //await this.page.waitForSelector('li[role="option"]', { timeout: 5000 });//wait for dropdown
    }



    /**
     * Click search button
     */
    async clickSearchButton() {
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle' );
    }

    /**
     * The complete search
     * @param {string} origin
     * @param {string} destination
     * @param {string} date
     */
    async performeSearch(origin, destination, date) {
        await this.selectOneWayJourney();
        await this.fillOriginStation(origin);
        await this.selectFromDropdown('Madrid-Atocha Cercanías');
        await this.fillDestinationStation(destination);
        await this.selectFromDropdown('Barcelona-Sants');
    //    await this.setDepartureDate(date);
        await this.clickSearchButton();
    }
}