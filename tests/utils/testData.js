/**
*@param {number} daysFromNow
*@return {string} 
*/
export function getFutureDate(daysFromNow = 7){
    const date = new Date();
    date.setDate(date.getDate()+daysFromNow);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() +1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    
    return `${year}-${month}-${day}`
}
/*Test data */
export const TEST_DATA = {
    BASE_URL : 'https://www.renfe.com',
    ORIGINAL_STATION : 'Madrid-Atocha Cercanías',
    DESTINATION_STATION : 'Barcelona-Sants',
    MIN_PRICE : 50,
    MAX_PRICE : 60,
    FARE_TYPE : 'basic',
};

/** Wait for element with retry logic
* @param {Page} page - Playwright Page object
* @param {string} selector - CSS selector
* @param {number} maxRetries   - Maximum number of retries
* @returns {Promise<boolean>} - True if element is found
*/

/*Waits for element with retry logic to imporve  */
export async function waitForElementWithRetry(page, selector, maxRetries = 3) {
    for (let i = 1; i <= maxRetries; i++) {
        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            return true; 
        } catch (error) {
            if ( i  === maxRetries - 1) 
                return false;
            await page.waitForTimeout(1000);
        }
    }
    return false;
}


