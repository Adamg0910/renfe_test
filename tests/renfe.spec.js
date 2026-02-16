import {test, expect} from '@playwright/test';
import { BASE_URL } from './utils/testData.js';
import {HomePage} from './pages/HomePage.js';
import {ResultPage} from './pages/ResultPage.js';
import {FareSelectionPage} from './pages/FareSelectionPage.js';
import {PassengerDetailsPage} from './pages/PassengerDetailsPage.js';
import { getFutureDate, TEST_DATA } from './utils/testData.js';

test.describe('Renfe ticket booking', () => {
    let homePage;
    let resultPage;
    let fareSelectionPage;
    let passengerDetailsPage;

    test.beforeEach(async({page})=>{
        //initialize all page objects
        homePage = new HomePage(page);
        resultPage = new ResultPage(page);
        fareSelectionPage = new FareSelectionPage(page);
        passengerDetailsPage = new PassengerDetailsPage(page);

        //navigate to renfe
        await homePage.goto('https://www.renfe.com/es/es');
        await homePage.page.waitForLoadState('networkidle');
        await homePage.acceptCookies();
        await homePage.waitForPageToLoad();
     
    });
    test('Purchase one-way ticket from Madrid-Atocha to Barcelona-Sants with basic fare', async()=> {
        //Step 1: Select one-way journey and enter stations
        await homePage.selectOneWayJourney();

        //Fill origin station
        await homePage.fillOriginStation(TEST_DATA.ORIGINAL_STATION);
        await homePage.selectFromDropdown('Madrid-Atocha Cercanías');

        //Fill destination station
        await homePage.fillDestinationStation(TEST_DATA.DESTINATION_STATION);
        await homePage.selectFromDropdown('Barcelona-Sants');

        //Note: Departure date is auto-selected by the website

        //Click search button
        await homePage.clickSearchButton();

        //Step 2: Verify results and select ticket
        //Results should show journey time and price for each ticket
        await resultPage.checkResultsLoaded();
        await resultPage.waitForResultsToLoad();
        let tickets = await resultPage.findAvailableTickets();
        if (tickets === 0) {
            await resultPage.getMiddleDayDate.click();
            // Wait for results to reload
            tickets = await resultPage.findAvailableTickets();
        }
        expect(tickets).toBeGreaterThan(0);

        //Step 3: Select ticket within price range (€50-60)
        const selectedTicket = await resultPage.findTicketWithinPriceRange(TEST_DATA.MIN_PRICE, TEST_DATA.MAX_PRICE);
        expect(selectedTicket).not.toBeNull();
        await resultPage.selectTicket(selectedTicket);

        //Extract and log ticket information
        const ticketDetails = await resultPage.extractTicketDetails(selectedTicket);
        console.log(`Selected ticket - Price: €${ticketDetails.price}, Duration: ${ticketDetails.duration}`);

        //Step 4: Select basic fare
        //Verify basic fare is displayed
        const isBasicFareVisible = await resultPage.isBasicFareVisible();
        expect(isBasicFareVisible).toBeTruthy();
        await resultPage.clickBasicFare();
        
        //Step 5: Click continue to go to passenger details page
        await resultPage.clickContinueButton();

        //Step 6: Handle fare upgrade popup if it appears
        await resultPage.isPromoUpFieldVisible();

        //Step 7: Verify user is on passenger details page
        const isPassengerPageLoaded = await passengerDetailsPage.isPassengerDetailsLoaded();
        expect(isPassengerPageLoaded).toBeTruthy();
    });
})