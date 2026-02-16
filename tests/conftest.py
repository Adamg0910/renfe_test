"""
Pytest configuration and fixtures for RENFE automation tests.
"""
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@pytest.fixture(scope="function")
def driver():
    """
    Pytest fixture to provide a Selenium WebDriver instance.
    
    Yields:
        WebDriver instance configured with Chrome
    """
    # Configure Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run in headless mode
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Initialize WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Set implicit wait
    driver.implicitly_wait(10)
    
    # Maximize window
    driver.maximize_window()
    
    logging.info("WebDriver initialized successfully")
    
    yield driver
    
    # Teardown - close browser
    driver.quit()
    logging.info("WebDriver closed")


@pytest.fixture(scope="function")
def driver_headed():
    """
    Pytest fixture to provide a Selenium WebDriver instance in headed mode.
    Useful for debugging.
    
    Yields:
        WebDriver instance configured with Chrome in headed mode
    """
    # Configure Chrome options (no headless)
    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Initialize WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Set implicit wait
    driver.implicitly_wait(10)
    
    # Maximize window
    driver.maximize_window()
    
    logging.info("WebDriver (headed mode) initialized successfully")
    
    yield driver
    
    # Teardown - close browser
    driver.quit()
    logging.info("WebDriver closed")
