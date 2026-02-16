/**
 * Passenger Page Object model
 */
import { BasePage } from "./BasePage.js";

export class PassengerDetailsPage extends BasePage {
    // Locators - using more flexible selectors for Spanish website
    get pageTitle() {
        return this.page.locator('h1');//Main heading on passenger details page
    }
    get passengerForm() {
        return this.page.locator('form, [class*="passenger"], [class*="viajero"]');//Form or passenger container
    }
    get firstNameInput() {
        return this.page.locator('input[name*="nombre"], input[id*="nombre"], input[placeholder*="Nombre"]');//First name input variations
    }
    get lastNameInput() {
        return this.page.locator('input[name*="apellido"], input[id*="apellido"], input[placeholder*="Apellido"]');//Last name input variations
    }
    /**
     * Check if passenger details page is loaded by verifying key elements
     * @returns {Promise<boolean>}
     */
    async isPassengerDetailsLoaded() {
        try {
            // Wait for page to stabilize
            await this.page.waitForLoadState('networkidle', { timeout: 10000 });
            
            // Check URL contains passenger/viajero keyword or form is visible
            const url = this.page.url();
            const urlIndicatesPassengerPage = url.includes('passenger') || 
                                             url.includes('viajero') || 
                                             url.includes('datos') ||
                                             url.includes('compra');
            
            // Try to find passenger form or related elements
            const formVisible = await this.passengerForm.first().isVisible({ timeout: 5000 }).catch(() => false);
            
            return urlIndicatesPassengerPage || formVisible;
        } catch (error) {
            console.log('Error checking passenger details page:', error.message);
            return false;
        }
    }
    
    /** 
     * Get page title
     * @return {Promise<string>}
     */
    async getPageTitle() {
        try {
            return await this.pageTitle.first().textContent({ timeout: 5000 });
        } catch {
            return '';
        }
    }
    
    /**
     * Get current page URL
     * @return {string}
     */
    getPageUrl() {
        return this.page.url();
    }
}