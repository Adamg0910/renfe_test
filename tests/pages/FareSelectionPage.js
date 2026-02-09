/**
 * Fare selection page object model
 */
import { BasePage } from "./BasePage";
 
export class FareSelectionPage extends BasePage {
    // Locators
    get basicFareOption() {
        return this.page.locator('h1:has-text("Fare Selection")');//check on the page for the exact text
    }   
    get fareDescription() {
        return this.page.locator('.fare-description');//check the page for the exact selector
    }
    get continueButton() {
        return this.page.locator('.continue-button');//chjeck the page for the exact selector
    }
    async selectBasicFare() {
        await this.page.click(this.basicFareOption);
        await this.page.waitForLoadState('networkidle'); // Wait for any potential loading after selecting fare
    }
    /**
     * Verify vacis fare is displayed
     * @return {Promise<boolean>}
     */
    async isBasicFareVisible() {
        try {
            await this.page.waitForSelector(this.fareDescription, { timeout: 5000 });
            return true
        } catch (error) {
            return false;
        }
    }
    //Click continue to go to passenger details page
    async clickContinue() {
        await this.page.click(this.continueButton);
        await this.page.waitForLoadState( 'networkidle' );
    }
}