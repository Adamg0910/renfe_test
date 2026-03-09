import {test, expect} from '@playwright/test';
import { TEST_DATA, STATIONS } from './utils/testData';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { FareSelectionPage } from './pages/FareSelectionPage';
import { CustomiseTripPage } from './pages/CustomiseTrip';

test.describe('Renfe ticket booking', () => {
    let homePage;
    let resultPage;
    let fareSelectionPage;
    let customiseTripPage;

    test.beforeEach(async({page})=>{
        //initalize all page objects
        homePage = new HomePage(page);
        resultPage = new ResultPage(page); 
        fareSelectionPage = new FareSelectionPage(page);

        //navigate to renfe
        await homePage.goto('https://www.renfe.com/es/es');
        await homePage.page.waitForLoadState('networkidle0');
        await homePage.acceptCookies();
        await homePage.waitForPageToLoad();
    });
        test('Test ID 002 : Handle no tickets available scenario for future date',async() => {

           await test.step('Search for journey on date with no available tickets',async()=>{
            await test.step('Select one way journey type',async () => {
                await homePage.selectOneWayJourney();
            });
            await test.step('Fill origin station: Madrid-Atocha Cercanías',async () => {
                await homePage.fillOriginStation(STATIONS.STATION_1);
                await homePage.selectFromDropdown('Madrid-Atocha Cercanías');

            });
            await test.step('Fill destination station: Barcelona-Sants',async () => {
                await homePage.fillDestinationStation(STATIONS.STATION_2);
                await homePage.selectFromDropdown('Barcelona-Sants');

            });
            await test.step('Click search button',async () => {
                await homePage.clickSearchButton();
            });
           });
           await test.step('Verify no availability message appears',async() =>{
            //Wait for results to load
            await Promise.all([
                resultPage.page.waitForLoadState('networkidle0'),
                resultPage.page.waitForTimeout(3000)
            ]);

            await test.step('Verify noDispoIda element is visible',async()=>{
                //Check if no availablity message is visible
                const noAvailabilityIsVIsible = await resultPage
                    .noDispoIda
                        .isVisible().catch(() => false);
                expect(noAvailabilityIsVIsible).toBeTruthy();
                console.log('✓ No availability message verified');
            });
            //Verify no tickets are displayed
            await test.step('Verify no tickets are found',async() =>{
                const ticketCount = await resultPage.getAvailableTicket();
                expect(ticketCount.length).toBe(0);
                console.log('✓ No tickets found as expected');
            });

           });
           await test.step('Verify system remains stable',async()=>{
            await test.step('Page is still responsive',async() => {
                const isPresent = await resultPage.noDispoIda.isVisible();
                expect(isPresent).toBeTruthy();
                console.log('✓ System is stable and responsive');
            });

           }); 
        });
})