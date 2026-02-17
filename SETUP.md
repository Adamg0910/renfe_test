# RENFE Automation Project - Setup & Execution Guide

## Project Summary
This is a JavaScript-based Playwright QA automation project for testing the RENFE train ticket booking flow. The project follows best practices including the Page Object Model pattern, proper wait strategies, and comprehensive test documentation.

## Project Structure

 
```

renfe_test/

├── tests/

│   ├── pages/                    # Page Object Models

│   │   ├── BasePage.js          # Base class with common methods

│   │   ├── HomePage.js          # RENFE homepage interactions

│   │   ├── ResultsPage.js       # Search results page interactions

│   │   ├── FareSelectionPage.js # Fare selection page interactions

│   │   └── PassengerDetailsPage.js # Passenger details page

│   ├── utils/

│   │   └── testData.js          # Test data and utility functions

│   └── renfe.spec.js            # Main test specification

├── playwright.config.js         # Playwright configuration

├── package.json                 # Project dependencies

├── .gitignore                   # Git ignore patterns

├── README.md                    # Project documentation

└── SETUP.md                     # This file
```

 

## Installation Steps

 

### Prerequisites

- Node.js v16 or higher

- npm v8 or higher

- Git (for version control)

- VS Code 1.95.0 or higher (recommended for GitHub Copilot compatibility)

 

### Step 1: Install Dependencies
```bash
npm install
```

This will install
- `@playwright/test` - Playwright testing framework

### Step 2: Install Playwright Browsers
```bash
npx playwright install
```
This downloads browser binaries for Chromium, Firefox, and WebKit.

### Step 3: Set Up VS Code (Recommended)
This project includes VS Code workspace configuration for optimal development experience.

**Install Recommended Extensions**:
1. Open the project in VS Code
2. When prompted, click "Install" to install recommended extensions:
   - GitHub Copilot (AI code assistance)
   - Playwright Test for VS Code (test running and debugging)

**Or install manually**:
- Press Ctrl+Shift+X (Cmd+Shift+X on Mac)
- Search for "GitHub Copilot" and "Playwright Test"
- Install both extensions

**Verify Copilot Setup**:
- Check the Copilot icon in the bottom-right status bar
- It should show as enabled (not disabled or error state)
- If you see compatibility warnings, ensure VS Code is version 1.95.0 or higher


## Running Tests

### Run all tests
```bash
npm test
```
### Run tests in UI mode (interactive dashboard)
```bash
npm run test:ui
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests in debug mode (step through code)
```bash
npm run test:debug
```

### View HTML test report
```bash
npm run test:report
```

## Test Case Details

### Test Name
**Purchase a one-way ticket from Madrid-Atocha to Barcelona-Sants with basic fare**

### Business Scenario
A person wants to purchase a one-way train ticket from Madrid-Atocha station to Barcelona-Sants station with basic fare on RENFE website.

### Test Steps (as per exercise requirements)


1. ✓ Navigate to RENFE homepage
2. ✓ Select "One-way" journey type
3. ✓ Enter origin station: Madrid-Atocha
4. ✓ Enter destination station: Barcelona-Sants
5. ✓ Set departure date (future date with availability)
6. ✓ Click search button
7. ✓ Verify search results display journey time and price
8. ✓ Find ticket with price between 50-60 euros
9. ✓ Select the ticket
10. ✓ Verify fare selection popup appears
11. ✓ Select "Basic" fare option
12. ✓ Click continue button
13. ✓ Verify user is redirected to Passenger Details page

### Expected Results
- Search returns available trains with prices and journey times
- Selected ticket is within 50-60 euros price range
- Basic fare option is available and selectable
- User advances to Passenger Details page

## Code Structure & Design Patterns

### Page Object Model (POM)

Each page of the application has a corresponding page object class:
- **BasePage.js**: Base class with common methods (click, fill, getText, waitForElement)
- **HomePage.js**: Handles homepage interactions (search form, station selection)
- **ResultsPage.js**: Handles search results (ticket extraction, price filtering)
- **FareSelectionPage.js**: Handles fare selection popup
- **PassengerDetailsPage.js**: Validates passenger details page load

### Benefits
✓ Easy maintenance - changes to selectors only need to be made in one place
✓ Scalability - new page objects can inherit from BasePage
✓ Readability - test code focuses on business logic, not technical details
✓ Reusability - page methods can be used across multiple tests
 
### Test Data Management
- Centralized in `testData.js`
- Includes constants: ORIGIN_STATION, DESTINATION_STATION, MIN_PRICE, MAX_PRICE
- Includes utility functions: getFutureDate(), waitForElementWithRetry()

## Wait Strategies

The project uses explicit waits for reliability:
- **waitForLoadState('networkidle')**: Waits for network to be idle
- **waitForSelector()**: Waits for specific elements with timeout
- **Implicit wait in selectors**: Uses data-test attributes for stable locators

## Browser Support

Tests run on three browsers by default:
- Chromium
- Firefox
- WebKit
 

Configure in `playwright.config.js` if needed.

## Troubleshooting

### Issue: VS Code and GitHub Copilot Compatibility
**Problem**: VS Code version 1.109.0 or certain versions have known issues with GitHub Copilot

**Solutions**:
1. **Update VS Code**: Ensure you're running VS Code version 1.95.0 or higher
   - Download from: https://code.visualstudio.com/
   - Or use your OS package manager to update
2. **Update GitHub Copilot Extension**:
   - Open VS Code Extensions panel (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "GitHub Copilot"
   - Click "Update" if available
3. **Reload VS Code**: After updating, reload the window (Ctrl+Shift+P / Cmd+Shift+P → "Reload Window")
4. **Check Extension Status**: Ensure Copilot shows as "Enabled" in the status bar
5. **Use Workspace Settings**: This project includes `.vscode/settings.json` with recommended Copilot configurations

### Issue: "getaddrinfo ENOTFOUND registry.npmjs.org"
**Solution**: Check internet connectivity or configure npm proxy
### Issue: "Playwright browser not found"
**Solution**: Run `npx playwright install`
### Issue: "Selectors not matching"
**Solution**: Run in debug mode: `npm run test:debug`
### Issue: "Timeout waiting for element"
**Solution**: Check RENFE website for structural changes; may need to update selectors

## Git Integration

The project is ready for Git version control:

```bash
# Initialize git repository (if not already done)
git init
 
# Add all files
git add .
# Create initial commit
git commit -m "Initial commit: RENFE automation project with POM structure"
# Add remote repository
git remote add origin <your-gitlab-url>
# Push to remote
git push -u origin main
```

### Recommended Git Workflow
- Creae feature branches for new tests: `feature/ticket-booking-test`
- Use descriptive commit messages
- Create pull requests before merging to main


## Best Practices Implemented

✓ **Clean Code**
  - Consistent naming conventions
  - Comprehensive JSDoc comments
  - Logical code organization


✓ **Maintainability**
  - Page Object Model pattern
  - Centralized test data
  - No hardcoded values


✓ **Reliability**
  - Explicit waits instead of sleep
  - Retry logic for element detection
  - Proper error handling


✓ **Scalability**
  - Easy to add new test cases
  - New page objects inherit common functionality
  - Test data easily extensible


✓ **Performance**
  - Parallel test execution (configurable)
  - Network idle waits
  - Proper resource cleanup

## Next Steps

1. **Install dependencies**: `npm install`
2. **Install browsers**: `npx playwright install`
3. **Run tests**: `npm test`
4. **View results**: `npm run test:report`
5. **Set up Git**: `git init` and configure remote repository
6. **Push to GitLab**: As per requirements (24 hours before interview)

## Configuration Details


### playwright.config.js Settings
- **testDir**: ./tests (where tests are located)
- **fullyParallel**: true (run tests in parallel)
- **reporter**: 'html' (HTML test report)
- **baseURL**: https://www.renfe.com/es/es
- **trace**: 'on-first-retry' (capture traces on failure)
- **screenshot**: 'only-on-failure' (save screenshots on failure)
- **video**: 'retain-on-failure' (save videos on failure)

### npm Scripts
- `test`: Run tests in headless mode
- `test:ui`: Interactive test runner
- `test:debug`: Debug mode with step-through
- `test:headed`: Visible browser execution
- `test:report`: View HTML report

## Support & Documentation

- Playwright Documentation: https://playwright.dev/docs/intro
- Test file: `tests/renfe.spec.js` (complete test with inline documentation)
- Page objects: `tests/pages/` (with detailed comments)
---


**Version:** 1.0.0  
**Last Updated:** February 5, 2026  
**Ready for Interview:** Yes (after git setup)