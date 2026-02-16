"""
Test data and utility functions for RENFE automation tests.
"""
from datetime import datetime, timedelta


def get_future_date(days_from_now=7):
    """
    Get a future date string.
    
    Args:
        days_from_now: Number of days in the future (default: 7)
        
    Returns:
        Date string in format YYYY-MM-DD
    """
    future_date = datetime.now() + timedelta(days=days_from_now)
    return future_date.strftime('%Y-%m-%d')


# Test data constants
TEST_DATA = {
    'BASE_URL': 'https://www.renfe.com',
    'ORIGIN_STATION': 'Madrid-Atocha Cercanías',
    'DESTINATION_STATION': 'Barcelona-Sants',
    'MIN_PRICE': 50,
    'MAX_PRICE': 60,
    'FARE_TYPE': 'basic',
}

# Export individual constants for convenience
BASE_URL = TEST_DATA['BASE_URL']
ORIGIN_STATION = TEST_DATA['ORIGIN_STATION']
DESTINATION_STATION = TEST_DATA['DESTINATION_STATION']
MIN_PRICE = TEST_DATA['MIN_PRICE']
MAX_PRICE = TEST_DATA['MAX_PRICE']
FARE_TYPE = TEST_DATA['FARE_TYPE']
