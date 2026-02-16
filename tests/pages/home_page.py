"""
HomePage - RENFE homepage and search functionality.
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
import time
import logging
from .base_page import BasePage

logger = logging.getLogger(__name__)


class HomePage(BasePage):
    """Page object for RENFE homepage."""
    
    # Locators
    DATE_OF_DEPARTURE_INPUT = (By.XPATH, '//input[@id="first-input"]')
    ONE_WAY_RADIO = (By.XPATH, '//label[contains(text(),"Viaje solo ida")]')
    ONE_WAY_TAB = (By.XPATH, '//label[@class="lightpick__label"]')
    ORIGIN_STATION = (By.XPATH, '//input[@id="origin"]')
    DESTINATION_STATION = (By.XPATH, '//input[@id="destination"]')
    DEPARTURE_DATE = (By.XPATH, '//input[@class="rf-daterange-picker-alternative__input"]')
    SEARCH_BUTTON = (By.XPATH, '//button[@type="submit"]')
    ACCEPT_COOKIES_BUTTON = (By.XPATH, '//button[@id="onetrust-accept-btn-handler"]')
    DROPDOWN_OPTION = (By.CSS_SELECTOR, 'li[role="option"]')
    
    def accept_cookies(self):
        """Accept cookie consent banner if present."""
        try:
            if self.is_element_visible(self.ACCEPT_COOKIES_BUTTON, timeout=10):
                logger.info("Cookie banner found, accepting cookies")
                time.sleep(0.5)  # Small delay for stability
                self.click(self.ACCEPT_COOKIES_BUTTON)
                time.sleep(0.5)
                logger.info("Cookies accepted")
        except Exception as e:
            logger.info(f"Cookie banner not present or already accepted: {e}")
    
    def wait_for_page_to_load(self):
        """Wait for the page to be fully loaded."""
        self.wait_for_page_load()
        # Wait for key elements to be visible
        self.wait_for_element(self.DATE_OF_DEPARTURE_INPUT, timeout=10)
        self.wait_for_element(self.ORIGIN_STATION, timeout=10)
        self.wait_for_element(self.DESTINATION_STATION, timeout=10)
        self.wait_for_element(self.SEARCH_BUTTON, timeout=10)
        logger.info("Home page fully loaded")
    
    def select_one_way_journey(self):
        """Select one-way journey type."""
        logger.info("Selecting one-way journey")
        self.click(self.DATE_OF_DEPARTURE_INPUT)
        time.sleep(0.5)
        self.wait_for_element(self.ONE_WAY_TAB, timeout=7)
        self.wait_for_element(self.ONE_WAY_RADIO, timeout=7)
        self.click(self.ONE_WAY_RADIO)
        time.sleep(0.3)
        logger.info("One-way journey selected")
    
    def fill_origin_station(self, station):
        """
        Fill origin station.
        
        Args:
            station: Station name to enter
        """
        logger.info(f"Filling origin station: {station}")
        self.fill(self.ORIGIN_STATION, station)
        time.sleep(0.5)
        # Wait for dropdown options to appear
        self.wait_for_element(self.DROPDOWN_OPTION, timeout=5)
    
    def fill_destination_station(self, station):
        """
        Fill destination station.
        
        Args:
            station: Station name to enter
        """
        logger.info(f"Filling destination station: {station}")
        self.fill(self.DESTINATION_STATION, station)
        time.sleep(0.5)
    
    def select_from_dropdown(self, option_text):
        """
        Select option from dropdown by text.
        
        Args:
            option_text: Text of the option to select
        """
        logger.info(f"Selecting from dropdown: {option_text}")
        # Find the dropdown option containing the text
        dropdown_xpath = f'//li[@role="option" and contains(text(), "{option_text}")]'
        option_locator = (By.XPATH, dropdown_xpath)
        self.wait_for_element(option_locator, timeout=5)
        self.click(option_locator)
        time.sleep(0.5)
        logger.info(f"Selected: {option_text}")
    
    def click_search_button(self):
        """Click the search button."""
        logger.info("Clicking search button")
        self.click(self.SEARCH_BUTTON)
        time.sleep(1)
        self.wait_for_page_load()
        logger.info("Search submitted")
    
    def perform_search(self, origin, destination):
        """
        Perform a complete search.
        
        Args:
            origin: Origin station name
            destination: Destination station name
        """
        self.select_one_way_journey()
        self.fill_origin_station(origin)
        self.select_from_dropdown('Madrid-Atocha Cercanías')
        self.fill_destination_station(destination)
        self.select_from_dropdown('Barcelona-Sants')
        self.click_search_button()
