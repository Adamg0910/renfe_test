import { time } from "node:console";
import { BasePage } from "./BasePage";

export class CustomiseTripPage extends BasePage {
    // Locators
    get pageTitle() {
        return this.page.locator('//div[contains(text(),"Personaliza tu viaje")]');
    }
    get paymentMethods() {
        return this.page.locator('//button[@id="submitpersonaliza"]');
    }

    async isCustomiseTripPageLoaded() {
        console.log("------------Customise Trip Page Loaded----------");
        const isVisible = await this.pageTitle.isVisible({timeout: 10000});
        await this.page.waitForLoadState('networkidle');
        return true;
    }

    async clickPaymentMethodsButton() {
        await this.paymentMethods.click();
    
    }
    async customiseYourTripOptions(){
        //Add extras    
    }
    async summarizeJourneyDetails(){
        
    }

}