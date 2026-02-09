# RENFE Train Ticket Automation


QA Automation project for testing RENFE train ticket booking functionality using Playwright and JavaScript.

## Project Overview


This project implements automated end-to-end tests for purchasing a one-way train ticket from Madrid-Atocha to Barcelona-Sants on the RENFE website.

### Test Scope
 

**Business Scenario:** Purchase a One-Way Train Ticket from Madrid to Barcelona

- Navigate to RENFE homepage
- Select one-way journey type
- Enter origin station (Madrid-Atocha) and destination station (Barcelona-Sants)
- Perform search with availability
- Select a ticket with price between 50-60 euros
- Choose basic fare option
- Advance to passenger details page

 

## Tech Stack

- **Framework:** Playwright
- **Language:** JavaScript (ES6+)
- **Node.js:** v16 or higher
- **Test Runner:** Playwright Test


## Project Structure

```

renfe-automation/

├── tests/

│   ├── pages/

│   │   ├── BasePage.js              # Base class for all page objects

│   │   ├── HomePage.js              # RENFE homepage page object

│   │   ├── ResultsPage.js           # Search results page object

│   │   ├── FareSelectionPage.js     # Fare selection page object

│   │   └── PassengerDetailsPage.js  # Passenger details page object

│   ├── utils/

│   │   └── testData.js              # Test data and utility functions

│   └── renfe.spec.js                # Main test specification

├── playwright.config.js             # Playwright configuration

├── package.json                     # Project dependencies

├── .gitignore                       # Git ignore file

└── README.md                        # Project documentation
```

## Installation


1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd renfe-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running Tests


### Run all tests
```bash
npm test
```
 
### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (browser visible)
```bash
npm run test:headed

```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

## Design Patterns

 
### Page Object Model (POM)


This project implements the Page Object Model pattern for maintainability and scalability:

- **BasePage.js:** Base class with common methods used across all page objects

- **Specific Page Objects:** Each page (HomePage, ResultsPage, etc.) encapsulates locators and page-specific methods

- **Separation of Concerns:** Test logic is separated from page interaction logic

 
### Test Data Management


- Test data is centralized in `testData.js`
- Constants like station names, price ranges, and fare types are defined once and reused
- Utility functions for date generation and element waits are provided

## Coding Standards


### Best Practices Implemented

 

✓ **Code Structure:** Clear separation between pages, tests, and utilities  
✓ **Readability:** Descriptive method names and comprehensive comments  
✓ **Maintainability:** Page Object Model for easy updates and scalability  
✓ **Wait Strategies:** Proper use of explicit waits and network idle conditions  
✓ **Error Handling:** Try-catch blocks for robust element detection  
✓ **Test Isolation:** Each test is independent and follows AAA pattern (Arrange, Act, Assert)  
✓ **Documentation:** Comments explain business scenario, test steps, and expected results  
## Configuration

### Browser Support

By default, tests run on:

- Chromium
- Firefox
- WebKit

Edit `playwright.config.js` to modify browser configuration.

### Timeouts

- Default timeout: 30 seconds
- Can be overridden per test or method

### Screenshots & Videos

- Screenshots captured on test failure
- Videos retained on test failure
- Trace files generated on first retry (CI environment)

 
## Git Workflow

### Initial Setup

```bash

# Create and switch to feature branch
git checkout -b feature/initial-setup


# Commit project structure
git add .
git commit -m "Initial project setup with POM structure"
 
# Push to repository
git push origin feature/initial-setup 

# Create Pull Request on GitLab/GitHub
```

### Committing Changes

```bash
# For new tests
git commit -m "feat: add train ticket booking test case"

# For bug fixes
git commit -m "fix: update selectors for results page"

# For documentation
git commit -m "docs: update README with test execution steps"
```

## Troubleshooting

### Common Issues

**Issue:** Selectors not matching
- **Solution:** Run tests in debug mode to inspect selectors: `npm run test:debug`

**Issue:** Tests timing out
- **Solution:** Increase timeout in playwright.config.js or specific test

**Issue:** Dropdown suggestions not appearing
- **Solution:** Verify proper wait time for dropdown; check network conditions

## Future Enhancements

- Add multiple test cases (round-trip booking, different passenger types)
- Implement visual regression testing
- Add API-level tests for ticket search
- Create test data fixtures
- Add performance benchmarking
- Implement continuous integration (CI/CD pipeline)

## Contact & Support

For questions or issues, please refer to the test documentation or contact the QA team.
---


**Last Updated:** February 5, 2026  
**Version:** 1.0.0