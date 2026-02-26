import {test, expect} from '@playwright/test';
import { BASE_URL } from './utils/testData';
import {HomePage} from './pages/HomePage';
import {ResultPage} from './pages/ResultPage';
import {FareSelectionPage} from './pages/FareSelectionPage';
import {PassengerDetailsPage} from './pages/PassengerDetailsPage';
import { getFutureDate, TEST_DATA } from './utils/testData';
import { CustomiseTripPage } from './pages/CustomiseTrip';

test.describe('Renfe ticket booking', () => {
    let homePage;
    let resultPage;
    let fareSelectionPage;
    let passengerDetailsPage;
    let customiseTripPage;

    test.beforeEach(async({page})=>{
        //initialize all page objects
        homePage = new HomePage(page);
        resultPage = new ResultPage(page);
        fareSelectionPage = new FareSelectionPage(page);
        passengerDetailsPage = new PassengerDetailsPage(page);
        customiseTripPage = new CustomiseTripPage(page);

        //navigate to renfe
        await homePage.goto('https://www.renfe.com/es/es');
        await homePage.page.waitForLoadState('networkidle');
        await homePage.acceptCookies();
        await homePage.waitForPageToLoad();
     
    });
    test('Purchase one-way ticket from Madrid_Atocha to Barcelona-Sants with basic fare', async()=> {
        
        await test.step('Search for journey from Madrid to Barcelona', async () => {
            await homePage.selectOneWayJourney();
            await homePage.fillOriginStation(TEST_DATA.ORIGINAL_STATION);
            await homePage.selectFromDropdown('Madrid-Atocha Cercanías');
            await homePage.fillDestinationStation(TEST_DATA.DESTINATION_STATION);
            await homePage.selectFromDropdown('Barcelona-Sants');
            await homePage.clickSearchButton();
        });

        let ticketDetails;
        await test.step('Verify search results and select ticket', async () => {
            await resultPage.checkResultsLoaded();
            await resultPage.waitForResultsToLoad();
            let tickets = await resultPage.findAvailableTickets();
            if (tickets === 0) {
                await resultPage.getMiddleDayDate.click();
                tickets = await resultPage.findAvailableTickets();
            }
            expect(tickets).toBeGreaterThan(0);
            
            const selectedTicket = await resultPage.findTicketWithinPriceRange(TEST_DATA.MIN_PRICE, TEST_DATA.MAX_PRICE);
            expect(selectedTicket).not.toBeNull();
            await resultPage.selectTicket(selectedTicket);
            
            ticketDetails = await resultPage.extractTicketDetails(selectedTicket);
            console.log(`Selected ticket- Price ${ticketDetails.price}, Duration: ${ticketDetails.duration}`);
        });

        await test.step('Select basic fare and continue', async () => {
            const isBasicFareVisible = await resultPage.isBasicFareVisible();
            expect(isBasicFareVisible).toBeTruthy();
            await resultPage.clickBasicFare();
            await resultPage.clickContinueButton();
            await resultPage.isPromoUpFieldVisible();
        });

        await test.step('Fill passenger details', async () => {
            const isPassengerDetailsPageLoaded = await passengerDetailsPage.isPassengerDetailsPageLoaded();
            expect(isPassengerDetailsPageLoaded).toBeTruthy();
            
            await passengerDetailsPage.getPageTitle();
            await passengerDetailsPage.getSummaryDetails();
            await passengerDetailsPage.fillPassengerDetails();
            await passengerDetailsPage.clickPersonalizarButton();
        });
        
        await test.step('Customize trip and proceed to payment', async () => {
            const isCustomerTripPageLoaded = await customiseTripPage.isCustomiseTripPageLoaded();
            expect(isCustomerTripPageLoaded).toBeTruthy();
            await customiseTripPage.clickPaymentMethodsButton();
            await customiseTripPage.page.pause();
        });
        //
        
    });
})