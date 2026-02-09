/**
 * BasePage class encapsulates common page interactions for the Renfe website.
*/

export class BasePage{
    constructor(page) {
        this.page = page;
        }
                /** 
                 * @param {string} url 'https://www.renfe.com/es/es'
                 */
                async goto(url) {
                    await this.page.goto(url);
                }

                /** 
                 * @param {string} selector - CSS selector 
                 * @param {number} timeout 
                 */
                async waitForElement(selector, timeout = 5000) {
                    await this.page.waitForSelector(selector, { timeout });
                }

                /** Click on an element
                 * @param {string} selector
                 */
                async click(selector) {
                    await this.page.click(selector);
                }

                /** Fill text input
                 * @param {string} selector
                 * @param {string} text
                 */
                async fill(selector, text) {
                    await this.page.fill(selector, text);
                }

                /** Get text content of an element
                 * @param {string} selector
                 */
                async getText(selector) {
                    return await this.page.textContent(selector);
                }

                // Wait for navigation after an action
                async waitForNavigation(timeout = 10000) {
                    await this.page.waitForLoadState('networkidle', { timeout });
                }
                
}
