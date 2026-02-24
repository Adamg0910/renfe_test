/**
 * Passenger Page Object model
 */
import { title } from "node:process";
import { BasePage } from "./BasePage";
import { TEST_DATA } from "../utils/testData";


export class PassengerDetailsPage extends BasePage {
    // Locators
    get pageTitle() {
        return this.page.locator('//div[@class="titulo"]');
    }
    get firstNameInput() {
        return this.page.locator('//input[@id="nombre0"]'); 
    }
    get lastNameInput() {
        return this.page.locator('//input[@id="apellido10"]');
    }
    get thirdNameInput() {
        return this.page.locator('//input[@id="apellido20"]');
    }
    get documentTypeInput() {
        return this.page.locator('//select[@id="tipoDocumento0"]');
    }
    get documentNumberInput() {
        return this.page.locator('//input[@id="documento0"]');
    }
    get emailInput() {
        return this.page.locator('//input[@id="email0"]'); 
    }
    get phonePrefixInput() {
        return this.page.locator('//select[@id="prefijo0"]');
    }
    get phoneNumberInput() {
        return this.page.locator('//input[@id="telefono0"]');
    }
    get submitPersonalizarButton() {
        return this.page.locator('//button[@id="submitpersonaliza"]');
    }
    get summarizeContainer() {
        return this.page.locator('//div[@class="container sidebar-2"]');
    }
    /**
     * Check the detailed page is loaded by verifying the presence of the page title
     * @returns {Promise<boolean>}
     */
    async isPassengerDetailsPageLoaded() {
        try {
            console.log("------------Passenger Details Page Loaded----------");
            await this.pageTitle.waitFor({ timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }
    async getSummaryDetails() {
        const summaryText = await this.summarizeContainer.textContent();
        console.log(summaryText);
        return summaryText;

    }

    async fillPassengerDetails() {
        await this.firstNameInput.fill(TEST_DATA.FIRST_NAME);
        await this.lastNameInput.fill(TEST_DATA.FAMILY_NAME);
        await this.documentTypeInput.selectOption(TEST_DATA.DOCUMENT_TYPE);
        await this.documentNumberInput.fill(TEST_DATA.DOCUMENT_NUMBER);
        await this.emailInput.fill(TEST_DATA.EMAIL_ADDRESS);
        await this.phonePrefixInput.selectOption(TEST_DATA.PHONE_PREFIX);
        await this.phoneNumberInput.fill(TEST_DATA.PHONE_NUMBER);
    }

    /** Check title of the passenger details page 
     *@return {Promise<string>}
     */
    async getPageTitle() {
        return await this.getText(this.pageTitle);
    }
        async clickPersonalizarButton() {
            await this.submitPersonalizarButton.click();
        }
    }