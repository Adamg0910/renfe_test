"""
RENFE Ticket Booking Test - Main test specification.

This test automates the process of purchasing a one-way train ticket
from Madrid-Atocha to Barcelona-Sants on the RENFE website with basic fare.
"""
import pytest
import logging
from pages.home_page import HomePage
from pages.result_page import ResultPage
from pages.fare_selection_page import FareSelectionPage
from pages.passenger_details_page import PassengerDetailsPage
from utils.test_data import TEST_DATA, ORIGIN_STATION, DESTINATION_STATION, MIN_PRICE, MAX_PRICE

logger = logging.getLogger(__name__)


class TestRenfeBooking:
    """Test class for RENFE ticket booking automation."""
    
    @pytest.fixture(autouse=True)
    def setup(self, driver):
        """
        Setup method that runs before each test.
        
        Args:
            driver: Selenium WebDriver fixture from conftest.py
        """
        self.driver = driver
        self.home_page = HomePage(driver)
        self.result_page = ResultPage(driver)
        self.fare_selection_page = FareSelectionPage(driver)
        self.passenger_details_page = PassengerDetailsPage(driver)
        
        # Navigate to RENFE homepage
        logger.info("=" * 80)
        logger.info("Starting test: Purchase one-way ticket with basic fare")
        logger.info("=" * 80)
        
        self.home_page.goto(f"{TEST_DATA['BASE_URL']}/es/es")
        self.home_page.wait_for_page_load()
        self.home_page.accept_cookies()
        self.home_page.wait_for_page_to_load()
    
    @pytest.mark.booking
    @pytest.mark.smoke
    def test_purchase_one_way_ticket_basic_fare(self):
        """
        Test: Purchase one-way ticket from Madrid-Atocha to Barcelona-Sants with basic fare.
        
        Test Steps:
        1. Navigate to RENFE homepage
        2. Select one-way journey
        3. Enter origin station (Madrid-Atocha)
        4. Enter destination station (Barcelona-Sants)
        5. Click search
        6. Verify search results display
        7. Find ticket within €50-60 price range
        8. Select ticket
        9. Select basic fare
        10. Click continue
        11. Handle fare upgrade popup if present
        12. Verify passenger details page loaded
        
        Expected Result:
        User successfully reaches passenger details page with selected ticket.
        """
        
        # Step 1: Select one-way journey and enter stations
        logger.info("Step 1: Selecting one-way journey")
        self.home_page.select_one_way_journey()
        
        # Fill origin station
        logger.info(f"Step 2: Filling origin station: {ORIGIN_STATION}")
        self.home_page.fill_origin_station(ORIGIN_STATION)
        self.home_page.select_from_dropdown('Madrid-Atocha Cercanías')
        
        # Fill destination station
        logger.info(f"Step 3: Filling destination station: {DESTINATION_STATION}")
        self.home_page.fill_destination_station(DESTINATION_STATION)
        self.home_page.select_from_dropdown('Barcelona-Sants')
        
        # Note: Departure date is auto-selected by the website
        
        # Click search button
        logger.info("Step 4: Clicking search button")
        self.home_page.click_search_button()
        
        # Step 2: Verify results and select ticket
        logger.info("Step 5: Verifying search results")
        self.result_page.check_results_loaded()
        self.result_page.wait_for_results_to_load()
        
        tickets_count = self.result_page.find_available_tickets_count()
        logger.info(f"Found {tickets_count} available tickets")
        assert tickets_count > 0, "No tickets found in search results"
        
        # Step 3: Select ticket within price range (€50-60)
        logger.info(f"Step 6: Finding ticket within price range €{MIN_PRICE}-{MAX_PRICE}")
        selected_ticket = self.result_page.find_ticket_within_price_range(MIN_PRICE, MAX_PRICE)
        assert selected_ticket is not None, f"No ticket found within price range €{MIN_PRICE}-{MAX_PRICE}"
        
        # Extract and log ticket information
        ticket_details = self.result_page.extract_ticket_details(selected_ticket)
        logger.info(f"Selected ticket - Price: €{ticket_details['price']}, Duration: {ticket_details['duration']}")
        
        # Select the ticket
        logger.info("Step 7: Selecting ticket")
        self.result_page.select_ticket(selected_ticket)
        
        # Step 4: Select basic fare
        logger.info("Step 8: Verifying basic fare is displayed")
        is_basic_fare_visible = self.result_page.is_basic_fare_visible()
        assert is_basic_fare_visible, "Basic fare option is not visible"
        
        logger.info("Step 9: Clicking basic fare")
        self.result_page.click_basic_fare()
        
        # Step 5: Click continue to go to passenger details page
        logger.info("Step 10: Clicking continue button")
        self.result_page.click_continue_button()
        
        # Step 6: Handle fare upgrade popup if it appears
        logger.info("Step 11: Checking for fare upgrade popup")
        self.result_page.is_promo_up_field_visible()
        
        # Step 7: Verify user is on passenger details page
        logger.info("Step 12: Verifying passenger details page loaded")
        is_passenger_page_loaded = self.passenger_details_page.is_passenger_details_loaded()
        assert is_passenger_page_loaded, "Failed to reach passenger details page"
        
        logger.info("=" * 80)
        logger.info("TEST PASSED: Successfully reached passenger details page!")
        logger.info("=" * 80)
