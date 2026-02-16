# RENFE Automation Test Project - Python + Selenium

## ⚠️ Important: This is a Python Project
This repository contains a **Python + Selenium** automation project. If you're looking for the JavaScript/Playwright version, please switch to a different branch.

## 🚨 Getting "requirements.txt not found" error?
**You need to pull the latest changes!** This repository was recently updated. Run:
```bash
git pull origin copilot/create-automation-project
```
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed help.

## Overview
This is a front-end automation testing project for the RENFE train ticket booking system. The project uses **Selenium WebDriver** with **Python** and follows the **Page Object Model (POM)** design pattern for maintainability and scalability.

## Project Information
- **Framework**: Selenium WebDriver 4.27.1
- **Test Runner**: Pytest 8.3.4
- **Language**: Python 3.x
- **Design Pattern**: Page Object Model (POM)
- **WebDriver Management**: Automatic (webdriver-manager)

## Business Scenario
**Purchase a One-Way Train Ticket from Madrid to Barcelona**

The automated test validates the complete flow of purchasing a one-way train ticket from Madrid-Atocha station to Barcelona-Sants station on the RENFE website.

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)
- Chrome browser installed

> **🔧 Having issues?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions to common problems like "requirements.txt not found" or "npm install errors".

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- `selenium` - WebDriver for browser automation
- `pytest` - Testing framework
- `webdriver-manager` - Automatic ChromeDriver management
- `pytest-html` - HTML test reports

### Step 2: Verify Installation
```bash
python --version
pip list | grep -E "(selenium|pytest)"
```

## Running Tests

### Run All Tests
```bash
pytest tests/test_renfe.py -v
```

### Run with Detailed Logging
```bash
pytest tests/test_renfe.py -v -s
```

### Run Specific Test Markers
```bash
# Run smoke tests
pytest -m smoke tests/

# Run booking tests
pytest -m booking tests/
```

### Generate HTML Report
```bash
pytest tests/test_renfe.py --html=reports/report.html --self-contained-html
```

### Run in Headed Mode (Visible Browser)
To see the browser during test execution, modify `tests/conftest.py` and comment out the `--headless` option in the Chrome options.

## Project Structure

```
renfe_test/
├── requirements.txt          # Python dependencies
├── pytest.ini                # Pytest configuration
├── README.md                 # This file
├── SETUP.md                  # Detailed setup guide
├── TEST_CASE.md              # Detailed test case documentation
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures (WebDriver setup)
│   ├── test_renfe.py        # Main test specification
│   ├── pages/               # Page Object Model classes
│   │   ├── __init__.py
│   │   ├── base_page.py              # Base page with common methods
│   │   ├── home_page.py              # Homepage interactions
│   │   ├── result_page.py            # Search results & ticket selection
│   │   ├── passenger_details_page.py # Passenger details verification
│   │   └── fare_selection_page.py    # Fare selection
│   └── utils/
│       ├── __init__.py
│       └── test_data.py              # Test data and constants
```

## Test Case Details

### Test Name
**Purchase a one-way ticket from Madrid-Atocha to Barcelona-Sants with basic fare**

### Test Steps

1. ✓ Navigate to RENFE homepage (https://www.renfe.com/es/es)
2. ✓ Accept cookies (if banner appears)
3. ✓ Select "One-way" journey type
4. ✓ Enter origin station: Madrid-Atocha Cercanías
5. ✓ Enter destination station: Barcelona-Sants
6. ✓ Click search button
7. ✓ Verify search results display journey time and price
8. ✓ Find ticket with price between €50-60
9. ✓ Select the ticket
10. ✓ Verify "Basic" fare option is visible
11. ✓ Select basic fare
12. ✓ Click continue button
13. ✓ Handle fare upgrade popup (if appears)
14. ✓ Verify user is redirected to Passenger Details page

### Expected Results
- Search returns available trains with prices and journey times
- Selected ticket is within €50-60 price range
- Basic fare option is available and selectable
- User successfully advances to Passenger Details page

### Test Data
| Field | Value |
|-------|-------|
| Origin Station | Madrid-Atocha Cercanías |
| Destination Station | Barcelona-Sants |
| Journey Type | One-way |
| Minimum Price | €50 |
| Maximum Price | €60 |
| Fare Type | Basic (Básico) |

## Code Quality & Design

### Page Object Model (POM)
Each page of the application has a corresponding page object class:
- **BasePage**: Common methods (click, fill, wait_for_element)
- **HomePage**: Homepage interactions (search form, station selection)
- **ResultPage**: Ticket extraction, price filtering, selection
- **FareSelectionPage**: Fare type handling
- **PassengerDetailsPage**: Final page validation

### Wait Strategies
The project uses **explicit waits** for reliability:
- `WebDriverWait` with `expected_conditions`
- `wait_for_element()` - Wait for element visibility
- `wait_for_element_clickable()` - Wait for element to be clickable
- `wait_for_page_load()` - Wait for page to fully load
- **NO hard-coded sleep/delays** except minimal waits for page stability

### Fixtures (conftest.py)
- `driver` - Headless Chrome WebDriver with automatic cleanup
- `driver_headed` - Visible Chrome WebDriver for debugging

## Troubleshooting

> **📖 For comprehensive troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

This guide covers:
- ❌ "requirements.txt not found" errors
- ❌ "npm install" errors  
- ❌ Git/repository sync issues
- ❌ Python/pip installation problems
- ❌ ChromeDriver issues
- ❌ And many more common problems

### Quick Common Issues

**Issue**: `ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'`
**Solution**: Pull the latest repository changes:
```bash
git pull origin copilot/create-automation-project
```
Then verify: `ls requirements.txt` (Linux/Mac) or `dir requirements.txt` (Windows)

**Issue**: `ModuleNotFoundError: No module named 'selenium'`
**Solution**: Run `pip install -r requirements.txt`

**Issue**: ChromeDriver version mismatch
**Solution**: The project uses `webdriver-manager` which automatically downloads the correct ChromeDriver version

**Issue**: `ERR_NAME_NOT_RESOLVED` or cannot reach RENFE website
**Solution**: 
- Check your internet connection
- Verify the website is accessible in your browser
- If behind a proxy, configure proxy settings

**Issue**: Timeout errors
**Solution**: 
- Increase timeout values in page objects if needed
- Check if RENFE website structure has changed
- Run in headed mode to see what's happening

**Issue**: "This is a JavaScript project" confusion
**Solution**: This is a **Python** project. There is NO `package.json` or `npm install` needed. Use `pip install -r requirements.txt` instead.

## Important Notes

### Network Requirements
⚠️ This test requires internet access to https://www.renfe.com/es/es

In restricted environments where external websites are blocked, the tests will fail with network errors. This is expected and not a code issue.

### Website Changes
If the RENFE website structure changes, selectors in page objects may need updating.

## Pytest Configuration

### Markers
- `@pytest.mark.smoke` - Quick smoke tests
- `@pytest.mark.regression` - Full regression tests
- `@pytest.mark.booking` - Ticket booking specific tests

### Logging
Tests include comprehensive logging at INFO level. Check console output for detailed test execution information.

## CI/CD Ready

This project is ready for CI/CD integration:
- All dependencies managed via requirements.txt
- Headless mode for CI environments
- HTML report generation
- Exit codes for pass/fail status

## License
ISC

## Version
1.0.0 - Python/Selenium Implementation

---

**Need Help?**
- Check `SETUP.md` for detailed setup instructions
- Check `TEST_CASE.md` for complete test case documentation
- Review `tests/test_renfe.py` for test implementation details

**❌ DO NOT run `npm install`** - This is NOT a Node.js project!  
**✅ USE `pip install -r requirements.txt`** - This is a Python project!
