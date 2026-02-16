"""
BasePage class - Base class for all page objects.
Provides common functionality for interacting with web pages.
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import logging

logger = logging.getLogger(__name__)


class BasePage:
    """Base class for all page objects with common methods."""
    
    def __init__(self, driver):
        """
        Initialize BasePage.
        
        Args:
            driver: Selenium WebDriver instance
        """
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
        self.short_wait = WebDriverWait(driver, 5)
    
    def goto(self, url):
        """
        Navigate to a URL.
        
        Args:
            url: URL to navigate to
        """
        logger.info(f"Navigating to: {url}")
        self.driver.get(url)
    
    def wait_for_element(self, locator, timeout=10):
        """
        Wait for an element to be present and visible.
        
        Args:
            locator: Tuple of (By.*, selector)
            timeout: Maximum wait time in seconds
            
        Returns:
            WebElement if found
        """
        try:
            wait = WebDriverWait(self.driver, timeout)
            element = wait.until(EC.visibility_of_element_located(locator))
            logger.debug(f"Element found: {locator}")
            return element
        except TimeoutException:
            logger.error(f"Timeout waiting for element: {locator}")
            raise
    
    def wait_for_element_clickable(self, locator, timeout=10):
        """
        Wait for an element to be clickable.
        
        Args:
            locator: Tuple of (By.*, selector)
            timeout: Maximum wait time in seconds
            
        Returns:
            WebElement if found and clickable
        """
        try:
            wait = WebDriverWait(self.driver, timeout)
            element = wait.until(EC.element_to_be_clickable(locator))
            logger.debug(f"Element clickable: {locator}")
            return element
        except TimeoutException:
            logger.error(f"Timeout waiting for clickable element: {locator}")
            raise
    
    def click(self, locator):
        """
        Click on an element.
        
        Args:
            locator: Tuple of (By.*, selector)
        """
        element = self.wait_for_element_clickable(locator)
        element.click()
        logger.debug(f"Clicked element: {locator}")
    
    def fill(self, locator, text):
        """
        Fill text into an input field.
        
        Args:
            locator: Tuple of (By.*, selector)
            text: Text to enter
        """
        element = self.wait_for_element(locator)
        element.clear()
        element.send_keys(text)
        logger.debug(f"Filled text into element: {locator}")
    
    def get_text(self, locator):
        """
        Get text content of an element.
        
        Args:
            locator: Tuple of (By.*, selector)
            
        Returns:
            Text content of the element
        """
        element = self.wait_for_element(locator)
        text = element.text
        logger.debug(f"Got text from element: {locator} -> {text}")
        return text
    
    def is_element_visible(self, locator, timeout=5):
        """
        Check if an element is visible.
        
        Args:
            locator: Tuple of (By.*, selector)
            timeout: Maximum wait time in seconds
            
        Returns:
            True if visible, False otherwise
        """
        try:
            wait = WebDriverWait(self.driver, timeout)
            wait.until(EC.visibility_of_element_located(locator))
            return True
        except TimeoutException:
            return False
    
    def wait_for_page_load(self, timeout=10):
        """
        Wait for page to be fully loaded.
        
        Args:
            timeout: Maximum wait time in seconds
        """
        wait = WebDriverWait(self.driver, timeout)
        wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
        logger.debug("Page fully loaded")
    
    def find_elements(self, locator):
        """
        Find multiple elements.
        
        Args:
            locator: Tuple of (By.*, selector)
            
        Returns:
            List of WebElements
        """
        return self.driver.find_elements(*locator)
    
    def get_current_url(self):
        """
        Get current page URL.
        
        Returns:
            Current URL string
        """
        return self.driver.current_url
