# RENFE Automation Project - Setup & Execution Guide (Python + Selenium)

## Project Summary
This is a **Python-based Selenium** automation project for testing the RENFE train ticket booking flow. The project follows best practices including the Page Object Model pattern, proper wait strategies, and comprehensive test documentation.

## ⚠️ Important Notice
**This is a Python project, NOT a JavaScript/Node.js project!**

- ❌ DO NOT run `npm install`
- ✅ USE `pip install -r requirements.txt`

## Project Structure

```
renfe_test/
├── tests/
│   ├── pages/                    # Page Object Models
│   │   ├── base_page.py         # Base class with common methods
│   │   ├── home_page.py         # RENFE homepage interactions
│   │   ├── result_page.py       # Search results page interactions
│   │   ├── fare_selection_page.py # Fare selection
│   │   └── passenger_details_page.py # Passenger details page
│   ├── utils/
│   │   └── test_data.py         # Test data and utility functions
│   ├── conftest.py              # Pytest fixtures
│   └── test_renfe.py            # Main test specification
├── pytest.ini                   # Pytest configuration
├── requirements.txt             # Python dependencies
├── .gitignore                   # Git ignore patterns
├── README.md                    # Project documentation
└── SETUP.md                     # This file
```

## Installation Steps

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)
- Chrome browser installed
- Git (for version control)

### Step 1: Verify Python Installation
```bash
python --version
# or
python3 --version
```

Expected output: Python 3.7.x or higher

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- `selenium==4.27.1` - WebDriver for browser automation
- `pytest==8.3.4` - Testing framework
- `webdriver-manager==4.0.2` - Automatic ChromeDriver management
- `pytest-html==4.1.1` - HTML test reports

### Step 3: Verify Installation
```bash
pip list | grep -E "(selenium|pytest)"
```

Expected output should show installed packages with versions.

## Running Tests

### Run All Tests (Headless Mode)
```bash
pytest tests/test_renfe.py -v
```

### Run with Detailed Output
```bash
pytest tests/test_renfe.py -v -s
```

### Run Specific Test Markers
```bash
# Run smoke tests only
pytest -m smoke tests/

# Run booking tests only
pytest -m booking tests/
```

### Generate HTML Report
```bash
pytest tests/test_renfe.py --html=reports/report.html --self-contained-html
```

Then open `reports/report.html` in a browser to view the results.

### Run in Headed Mode (Visible Browser)
To see the browser during test execution:

1. Open `tests/conftest.py`
2. Find the `driver` fixture
3. Comment out this line: `chrome_options.add_argument('--headless')`
4. Run the tests again

## Test Case Details

### Test Name
**Purchase a one-way ticket from Madrid-Atocha to Barcelona-Sants with basic fare**

### Business Scenario
A person wants to purchase a one-way train ticket from Madrid-Atocha station to Barcelona-Sants station with basic fare on RENFE website.

### Test Steps (as per exercise requirements)

1. ✓ Navigate to RENFE homepage
2. ✓ Accept cookies
3. ✓ Select "One-way" journey type
4. ✓ Enter origin station: Madrid-Atocha Cercanías
5. ✓ Enter destination station: Barcelona-Sants
6. ✓ Search for tickets
7. ✓ Verify results display journey time and price
8. ✓ Find ticket with price between €50-60
9. ✓ Select the ticket
10. ✓ Select "Basic" fare option
11. ✓ Click continue button
12. ✓ Handle fare upgrade popup
13. ✓ Verify user is on Passenger Details page

### Expected Results
- Search returns available trains with prices and journey times
- Selected ticket is within €50-60 price range
- Basic fare option is available and selectable
- User advances to Passenger Details page

## Code Structure & Design Patterns

### Page Object Model (POM)

Each page has a corresponding page object class:

**BasePage** (`tests/pages/base_page.py`)
- Common methods used by all pages
- `goto()`, `click()`, `fill()`, `wait_for_element()`, etc.

**HomePage** (`tests/pages/home_page.py`)
- Homepage interactions
- Station selection, journey type selection

**ResultPage** (`tests/pages/result_page.py`)
- Search results handling
- Ticket extraction, price filtering, selection

**FareSelectionPage** (`tests/pages/fare_selection_page.py`)
- Fare type selection (included for completeness)

**PassengerDetailsPage** (`tests/pages/passenger_details_page.py`)
- Validates passenger details page load

### Benefits of POM
✓ Easy maintenance - changes to selectors only in one place
✓ Scalability - new page objects can inherit from BasePage
✓ Readability - test code focuses on business logic
✓ Reusability - page methods can be used across multiple tests

### Test Data Management
- Centralized in `tests/utils/test_data.py`
- Includes constants: ORIGIN_STATION, DESTINATION_STATION, MIN_PRICE, MAX_PRICE
- Includes utility functions: get_future_date()

## Wait Strategies

The project uses **explicit waits** for reliability:

```python
# Wait for element to be visible
element = self.wait_for_element(locator, timeout=10)

# Wait for element to be clickable
element = self.wait_for_element_clickable(locator, timeout=10)

# Wait for page to fully load
self.wait_for_page_load(timeout=10)
```

**NO hard-coded sleep** statements except minimal waits for page stability.

## Pytest Configuration

### pytest.ini Settings
- **testpaths**: tests (where tests are located)
- **python_files**: test_*.py (test file pattern)
- **markers**: smoke, regression, booking
- **addopts**: -v --tb=short --html=reports/report.html

### Fixtures (conftest.py)
- **driver**: Headless Chrome WebDriver (for CI/CD)
- **driver_headed**: Visible Chrome WebDriver (for debugging)

## Troubleshooting

### Issue: `ModuleNotFoundError`
**Solution**: Run `pip install -r requirements.txt`

### Issue: ChromeDriver version mismatch
**Solution**: The project uses `webdriver-manager` which automatically downloads the correct ChromeDriver

### Issue: Cannot reach RENFE website
**Solution**: 
- Check internet connection
- Verify website is accessible in browser
- Check firewall/proxy settings

### Issue: Timeout errors
**Solution**:
- Increase timeout values in page objects
- Check if RENFE website structure has changed
- Run in headed mode to debug

### Issue: "npm install" error
**Solution**: This is a **Python** project, not Node.js. Use `pip install -r requirements.txt` instead.

## Git Integration

The project is ready for Git version control:

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your commit message"

# Push
git push origin main
```

## Best Practices Implemented

✓ **Clean Code**
  - Consistent naming conventions
  - Comprehensive docstrings
  - Logical code organization

✓ **Maintainability**
  - Page Object Model pattern
  - Centralized test data
  - No hardcoded values

✓ **Reliability**
  - Explicit waits instead of sleep
  - Proper error handling
  - Retry logic for dynamic content

✓ **Scalability**
  - Easy to add new test cases
  - Page objects inherit common functionality
  - Test data easily extensible

✓ **Performance**
  - Headless mode for fast execution
  - Proper resource cleanup
  - Efficient element location strategies

## Next Steps

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Run tests**: `pytest tests/test_renfe.py -v`
3. **View results**: Check console output or HTML report
4. **Customize**: Modify test data in `tests/utils/test_data.py` as needed

## Support & Documentation

- Python Documentation: https://docs.python.org/3/
- Selenium Documentation: https://selenium-python.readthedocs.io/
- Pytest Documentation: https://docs.pytest.org/
- Test file: `tests/test_renfe.py` (complete test with documentation)
- Page objects: `tests/pages/` (with detailed docstrings)

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Framework:** Python + Selenium + Pytest
