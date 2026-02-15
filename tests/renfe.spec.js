import {test, expect} from '@playwright/test';
import { BASE_URL } from './utils/testData';
import {HomePage} from './pages/HomePage';
import {ResultPage} from './pages/ResultPage';
import {FareSelectionPage} from './pages/FareSelectionPage';
import {PassengerDetailsPage} from './pages/PassengerDetailsPage';
import { getFutureDate, TEST_DATA } from './utils/testData';

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
    test('Purchase one-way ticket from Madrid_Atocha to Barcelona-Sants with basic fare', async()=> {
        //Step 1: Search for one way trip and select
        await homePage.selectOneWayJourney();

        //Fill origigin station
        await homePage.fillOriginStation(TEST_DATA.ORIGINAL_STATION);
        await homePage.selectFromDropdown('Madrid-Atocha Cercanías');

        //Fill destination station
        await homePage.fillDestinationStation(TEST_DATA.DESTINATION_STATION);
        await homePage.selectFromDropdown('Barcelona-Sants');

        //Set departure date (7 days from now)
        // const departureDate = getFutureDate(7);
        // await homePage.setDepartureDate(departureDate);

        //Click search button
        await homePage.clickSearchButton();

        //Step 2: Verify results and select first option
        //REsults should show journey time and price for each ticket
        await resultPage.checkResultsLoaded();
        await resultPage.waitForResultsToLoad();
        //expect(isResultsLoaded).toBeTruthy();
        let tickets = await resultPage.findAvailableTickets();
        if (tickets === 0) {
            await resultPage.getMiddleDayDate.click();
            // Optionally, wait for results to reload
            tickets = await resultPage.findAvailableTickets();
        }
        expect(tickets).toBeGreaterThan(0);

        //Step 3: Select first ticket within price range
        const selectedTicket = await resultPage.findTicketWithinPriceRange(TEST_DATA.MIN_PRICE, TEST_DATA.MAX_PRICE);
        expect(selectedTicket).not.toBeNull();
        await resultPage.selectTicket(selectedTicket);

        //Extracr and ticket infos
        const ticketDetails = await resultPage.extractTicketDetails(selectedTicket);
        console.log(`Selected ticket- PRice ${ticketDetails.price}, Duration: ${ticketDetails.duration}`);

        //Step 4:select basic fare
        //Verify basic fare is displayed
        const isBasicFareVisible = await resultPage.isBasicFareVisible();
        expect(isBasicFareVisible).toBeTruthy();
        //await resultPage.isBasicFareVisible();
        await resultPage.clickBasicFare();
        //Step6 : Click continue to go to passenger details page
        await resultPage.clickContinueButton();

        //handle fare uprgrade
        await resultPage.isPromoUpFieldVisible();


        //Setep 7: Verify user is on passenger details page
        const isPassengetPageLoaded = await passengerDetailsPage.isPassengerDetailsLoaded();
        expect(isPassengetPageLoaded).toBeTruthy();
    });
})