"""
ResultPage - RENFE search results page.
"""
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import re
import logging
from .base_page import BasePage

logger = logging.getLogger(__name__)


class ResultPage(BasePage):
    """Page object for RENFE search results page."""
    
    # Locators
    BUTTON_ACEPTAR_FARE_UPGRADE = (By.XPATH, "//p[@id='aceptarConfirmacionFareUpgrade']")
    PROMO_UP_FIELD = (By.XPATH, '//div[@class="modal-dialog modal-promoUp"]')
    TRAVEL_OPTIONS = (By.CSS_SELECTOR, 'div.row.selectedTren')
    LOAD_STATE_IMG = (By.XPATH, "//img[@class='focusTab seguirTab' and @alt='Cargando el contenido']")
    MIDDLE_DAY_DATE = (By.XPATH, '//button[@class="move_to_tomorrow"]')
    PRICE_TEXT = (By.XPATH, '//span[@class="precio-final"]')
    DURATION_TEXT = (By.XPATH, '//span[@class="col entre-horas"]')
    BASIC_FARE_CLASS = (By.XPATH, '//span[text()="Básico"]')
    NO_DISPO_IDA = (By.XPATH, '//p[@id="noDispoIda"]')
    SELECT_BUTTON = (By.XPATH, '//button[@id="btnSeleccionar"]')
    
    def is_promo_up_field_visible(self):
        """Check if fare upgrade promo popup is visible and handle it."""
        try:
            if self.is_element_visible(self.BUTTON_ACEPTAR_FARE_UPGRADE, timeout=3):
                logger.info("Fare upgrade popup detected, clicking accept")
                self.click(self.BUTTON_ACEPTAR_FARE_UPGRADE)
                time.sleep(0.5)
                return True
        except Exception as e:
            logger.debug(f"No fare upgrade popup: {e}")
        return False
    
    def check_results_loaded(self):
        """Check if results are loaded or need to select different date."""
        try:
            if self.is_element_visible(self.NO_DISPO_IDA, timeout=3):
                logger.info("No tickets available, trying next date")
                self.click(self.MIDDLE_DAY_DATE)
                time.sleep(1)
        except Exception as e:
            logger.debug(f"Results check: {e}")
    
    def wait_for_results_to_load(self):
        """Wait for ticket results to load with retry logic."""
        logger.info("Waiting for ticket results...")
        last_ticket_results = []
        
        for attempt in range(1, 4):
            try:
                # Wait for travel options to appear
                self.wait_for_element(self.TRAVEL_OPTIONS, timeout=10)
                ticket_results = self.get_available_tickets()
                tickets_count = len(ticket_results)
                logger.info(f"Attempt {attempt}: Found {tickets_count} tickets")
                
                # Check if "no tickets" message is visible
                no_dispo_visible = self.is_element_visible(self.NO_DISPO_IDA, timeout=2)
                
                if not no_dispo_visible and tickets_count > 0:
                    return ticket_results
                
                # Try next date if no tickets
                if attempt < 3:
                    logger.info("Trying next date...")
                    self.click(self.MIDDLE_DAY_DATE)
                    time.sleep(1)
                    
                last_ticket_results = ticket_results
            except Exception as e:
                logger.warning(f"Attempt {attempt} failed: {e}")
                if attempt < 3:
                    time.sleep(1)
        
        # Ensure we have at least 1 ticket result after retries
        if len(last_ticket_results) < 1:
            raise Exception('No travel options available after all retries')
        
        return last_ticket_results
    
    def get_available_tickets(self):
        """Get all available ticket elements."""
        return self.find_elements(self.TRAVEL_OPTIONS)
    
    def find_available_tickets_count(self):
        """Return count of available tickets."""
        tickets = self.get_available_tickets()
        return len(tickets)
    
    def extract_ticket_details(self, ticket_element):
        """
        Extract price and duration from a ticket element.
        
        Args:
            ticket_element: WebElement representing a ticket
            
        Returns:
            Dict with 'price' and 'duration' keys
        """
        try:
            # Try to find price within this ticket element
            try:
                price_elem = ticket_element.find_element(*self.PRICE_TEXT)
                price_text = price_elem.text
            except NoSuchElementException:
                logger.warning("Price not found in ticket, trying to load more data")
                # Try clicking next date button
                try:
                    self.click(self.MIDDLE_DAY_DATE)
                    time.sleep(1)
                    price_elem = ticket_element.find_element(*self.PRICE_TEXT)
                    price_text = price_elem.text
                except:
                    price_text = "0"
            
            # Extract duration
            try:
                duration_elem = ticket_element.find_element(*self.DURATION_TEXT)
                duration_text = duration_elem.text.strip()
            except NoSuchElementException:
                duration_text = ""
            
            # Extract numeric price from text (format: "50,00 €" or similar)
            price_numeric = 0.0
            if price_text:
                # Remove all non-numeric characters except comma and dot
                price_clean = re.sub(r'[^0-9,.]', '', price_text)
                # Replace comma with dot for float conversion
                price_clean = price_clean.replace(',', '.')
                try:
                    price_numeric = float(price_clean)
                except ValueError:
                    logger.warning(f"Could not parse price: {price_text}")
                    price_numeric = 0.0
            
            logger.debug(f"Ticket details - Price: €{price_numeric}, Duration: {duration_text}")
            
            return {
                'price': price_numeric,
                'duration': duration_text,
                'element': ticket_element
            }
        except Exception as e:
            logger.error(f"Error extracting ticket details: {e}")
            return {
                'price': 0.0,
                'duration': '',
                'element': ticket_element
            }
    
    def find_ticket_within_price_range(self, min_price=50, max_price=60):
        """
        Find a ticket within the specified price range.
        
        Args:
            min_price: Minimum price (default: 50)
            max_price: Maximum price (default: 60)
            
        Returns:
            WebElement of the ticket within price range
        """
        logger.info(f"Finding ticket within price range: €{min_price}-{max_price}")
        tickets = self.get_available_tickets()
        
        for ticket in tickets:
            details = self.extract_ticket_details(ticket)
            price = details['price']
            logger.debug(f"Checking ticket with price: €{price}")
            
            if min_price <= price <= max_price:
                logger.info(f"Found ticket within range: €{price}")
                return ticket
        
        raise Exception(f'No ticket found within price range €{min_price}-{max_price}')
    
    def select_ticket(self, ticket_element):
        """
        Click to select a ticket.
        
        Args:
            ticket_element: WebElement representing the ticket
        """
        logger.info("Selecting ticket")
        ticket_element.click()
        time.sleep(1)
        self.wait_for_page_load()
    
    def is_basic_fare_visible(self):
        """Check if basic fare option is visible."""
        try:
            return self.is_element_visible(self.BASIC_FARE_CLASS, timeout=5)
        except:
            return False
    
    def click_basic_fare(self):
        """Click on basic fare option."""
        logger.info("Clicking basic fare")
        self.click(self.BASIC_FARE_CLASS)
        time.sleep(0.5)
        self.wait_for_page_load()
    
    def click_continue_button(self):
        """Click the continue/select button."""
        logger.info("Clicking continue button")
        self.click(self.SELECT_BUTTON)
        time.sleep(1)
        self.wait_for_page_load()
