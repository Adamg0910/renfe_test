"""
FareSelectionPage - RENFE fare selection page.
Note: This page object is included for completeness but may not be
actively used in the current test flow.
"""
from selenium.webdriver.common.by import By
import logging
from .base_page import BasePage

logger = logging.getLogger(__name__)


class FareSelectionPage(BasePage):
    """Page object for RENFE fare selection page."""
    
    # Locators
    BASIC_FARE_OPTION = (By.XPATH, '//h1[contains(text(), "Fare Selection")]')
    FARE_DESCRIPTION = (By.CSS_SELECTOR, '.fare-description')
    CONTINUE_BUTTON = (By.CSS_SELECTOR, '.continue-button')
    
    def select_basic_fare(self):
        """Select basic fare option."""
        logger.info("Selecting basic fare")
        self.click(self.BASIC_FARE_OPTION)
        self.wait_for_page_load()
    
    def is_basic_fare_visible(self):
        """Check if basic fare is visible."""
        try:
            return self.is_element_visible(self.FARE_DESCRIPTION, timeout=5)
        except:
            return False
    
    def click_continue(self):
        """Click continue button."""
        logger.info("Clicking continue button")
        self.click(self.CONTINUE_BUTTON)
        self.wait_for_page_load()
