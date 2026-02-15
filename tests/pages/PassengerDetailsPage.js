/**
 * Passenger Page Object model
 */
import { title } from "node:process";
import { BasePage } from "./BasePage";

export class PassengerDetailsPage extends BasePage {
    // Locators
    get pageTitle() {
        return this.page.locator('h1:has-text("Passenger Details")');//check on the page for the exact text
    }
    get firstNameInput() {
        return this.page.locator('#firstName');//check locator  
    }
    get lastNameInput() {
        return this.page.locator('#lastName');//check locator
    }
    /**
     * Check the detailed page is loaded by verifying the presence of the page title
     * @returns {Promise<boolean>}
     */
    async isPassengerDetailsPageLoaded() {
        try {
            await this.pageTitle.waitFor({ timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
    /** Check title of the passenger details page 
     *@return {Promise<string>}
     */
    async getPageTitle() {
        return await this.getText(this.pageTitle);
    }
}