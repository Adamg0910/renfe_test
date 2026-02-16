/**
 * Passenger Page Object model
 */
import { title } from "node:process";
import { BasePage } from "./BasePage";

export class PassengerDetailsPage extends BasePage {
    // Locators
    get pageTitle() {
        return this.page.locator('//div[@class="titulo"]');//check on the page for the exact text
    }
    get firstNameInput() {
        return this.page.locator('//input[@id="nombre0"]');//check locator  
    }
    get lastNameInput() {
        return this.page.locator('//input[@id="apellido10"]');//check locator 
    }
    /**
     * Check the detailed page is loaded by verifying the presence of the page title
     * @returns {Promise<boolean>}
     */
    async isPassengerDetailsPageLoaded() {
        try {
            console.log("------------Testcase done----------");
            await this.pageTitle.waitFor({ timeout: 10000 });
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