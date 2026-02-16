"""
PassengerDetailsPage - RENFE passenger details page.
"""
from selenium.webdriver.common.by import By
import logging
from .base_page import BasePage

logger = logging.getLogger(__name__)


class PassengerDetailsPage(BasePage):
    """Page object for RENFE passenger details page."""
    
    # Locators - using flexible selectors for Spanish website
    PAGE_TITLE = (By.XPATH, '//h1')
    PASSENGER_FORM = (By.XPATH, '//form | //*[contains(@class, "passenger")] | //*[contains(@class, "viajero")]')
    FIRST_NAME_INPUT = (By.XPATH, '//input[contains(@name, "nombre") or contains(@id, "nombre") or contains(@placeholder, "Nombre")]')
    LAST_NAME_INPUT = (By.XPATH, '//input[contains(@name, "apellido") or contains(@id, "apellido") or contains(@placeholder, "Apellido")]')
    
    def is_passenger_details_loaded(self):
        """
        Check if passenger details page is loaded.
        
        Returns:
            True if passenger details page is loaded, False otherwise
        """
        try:
            # Wait for page to stabilize
            self.wait_for_page_load(timeout=10)
            
            # Check URL contains passenger/viajero keyword
            url = self.get_current_url()
            url_indicates_passenger_page = ('passenger' in url.lower() or 
                                           'viajero' in url.lower() or 
                                           'datos' in url.lower() or
                                           'compra' in url.lower())
            
            # Try to find passenger form or related elements
            form_visible = self.is_element_visible(self.PASSENGER_FORM, timeout=5)
            
            logger.info(f"Passenger page check - URL indicates: {url_indicates_passenger_page}, Form visible: {form_visible}")
            return url_indicates_passenger_page or form_visible
        except Exception as e:
            logger.error(f'Error checking passenger details page: {e}')
            return False
    
    def get_page_title(self):
        """
        Get page title.
        
        Returns:
            Page title text or empty string
        """
        try:
            return self.get_text(self.PAGE_TITLE)
        except:
            return ''
