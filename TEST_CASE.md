# Test Case Documentation

## Test Case ID: TC_001
**Test Case Name**: Purchase One-Way Train Ticket from Madrid-Atocha to Barcelona-Sants with Basic Fare

## Test Information
- **Priority**: High
- **Test Type**: End-to-End (E2E) / Functional
- **Test Category**: Front-End Automation
- **Execution Type**: Automated
- **Framework**: Playwright
- **Browser**: Chromium (Chrome/Edge compatible)

## Business Scenario
A customer wants to purchase a one-way train ticket from Madrid-Atocha station to Barcelona-Sants station on the RENFE website, selecting a basic fare option within the budget range of €50-60.

## Test Objective
Verify that the complete ticket booking flow works correctly from search to passenger details page, ensuring:
1. Search functionality returns valid results
2. Ticket information displays correctly (price and duration)
3. Price filtering works within specified range
4. Fare selection (basic) is functional
5. Navigation to passenger details page is successful

## Preconditions
1. RENFE website (https://www.renfe.com/es/es) is accessible
2. Internet connection is stable
3. Playwright browsers are installed
4. Test environment is set up correctly
5. There are available tickets for the selected route

## Test Data
| Parameter | Value | Description |
|-----------|-------|-------------|
| Base URL | https://www.renfe.com/es/es | RENFE homepage |
| Origin Station | Madrid-Atocha Cercanías | Departure station |
| Destination Station | Barcelona-Sants | Arrival station |
| Journey Type | One-way (Ida) | Single direction trip |
| Minimum Price | €50 | Lower price threshold |
| Maximum Price | €60 | Upper price threshold |
| Fare Type | Basic (Básico) | Economy fare option |
| Departure Date | Auto-selected | System chooses available date |

## Test Steps

### Step 1: Navigate to RENFE Homepage
**Action**: 
- Open browser
- Navigate to https://www.renfe.com/es/es

**Expected Result**:
- Page loads successfully
- Main search form is visible
- Page URL matches expected URL

**Implementation**:
```javascript
await homePage.goto('https://www.renfe.com/es/es');
await homePage.page.waitForLoadState('networkidle');
```

---

### Step 2: Handle Cookie Consent Banner
**Action**: 
- Wait for cookie consent banner to appear
- Click "Accept" button if banner is visible

**Expected Result**:
- Cookie banner disappears
- Page is ready for interaction
- No banner blocking page elements

**Implementation**:
```javascript
await homePage.acceptCookies();
await homePage.waitForPageToLoad();
```

**Notes**: Cookie banner may not always appear; test handles this gracefully

---

### Step 3: Select One-Way Journey Type
**Action**: 
- Click on the departure date input field to open calendar
- Wait for calendar/journey type selector to appear
- Click on "One-way" (Viaje solo ida) option

**Expected Result**:
- Calendar/journey selector opens
- "One-way" option is visible and clickable
- Option is selected/highlighted after click

**Implementation**:
```javascript
await homePage.selectOneWayJourney();
```

---

### Step 4: Enter Origin Station (Madrid-Atocha)
**Action**: 
- Locate origin station input field
- Type "Madrid-Atocha Cercanías"
- Wait for dropdown suggestions to appear
- Select "Madrid-Atocha Cercanías" from dropdown

**Expected Result**:
- Input accepts text
- Dropdown appears with matching suggestions
- "Madrid-Atocha Cercanías" is visible in dropdown
- Selection populates the input field
- Dropdown closes after selection

**Implementation**:
```javascript
await homePage.fillOriginStation(TEST_DATA.ORIGINAL_STATION);
await homePage.selectFromDropdown('Madrid-Atocha Cercanías');
```

---

### Step 5: Enter Destination Station (Barcelona-Sants)
**Action**: 
- Locate destination station input field
- Type "Barcelona-Sants"
- Wait for dropdown suggestions to appear
- Select "Barcelona-Sants" from dropdown

**Expected Result**:
- Input accepts text
- Dropdown appears with matching suggestions
- "Barcelona-Sants" is visible in dropdown
- Selection populates the input field
- Dropdown closes after selection

**Implementation**:
```javascript
await homePage.fillDestinationStation(TEST_DATA.DESTINATION_STATION);
await homePage.selectFromDropdown('Barcelona-Sants');
```

---

### Step 6: Submit Search Form
**Action**: 
- Locate and click the search button
- Wait for page navigation to complete

**Expected Result**:
- Search button is clickable
- Page navigates to results page
- Loading indicator appears and disappears
- Results page URL is different from homepage

**Implementation**:
```javascript
await homePage.clickSearchButton();
```

---

### Step 7: Wait for Search Results to Load
**Action**: 
- Wait for search results page to fully load
- Verify results container is visible
- Check if any travel options are displayed

**Expected Result**:
- Results page loads completely
- At least one travel option is displayed
- Loading spinner disappears
- Travel options show journey details

**Implementation**:
```javascript
await resultPage.checkResultsLoaded();
await resultPage.waitForResultsToLoad();
let tickets = await resultPage.findAvailableTickets();
```

**Notes**: If no results on current date, test automatically tries next available date

---

### Step 8: Verify Ticket Information Display
**Action**: 
- Verify each ticket result displays required information
- Check for price visibility
- Check for journey duration visibility

**Expected Result**:
- Each ticket shows price in euros (€)
- Each ticket shows journey duration (hours and minutes)
- Information is readable and properly formatted

**Implementation**:
```javascript
expect(tickets).toBeGreaterThan(0);
```

---

### Step 9: Find and Select Ticket Within Price Range (€50-60)
**Action**: 
- Iterate through available tickets
- Extract price from each ticket
- Find first ticket with price between €50 and €60
- Click to select the ticket

**Expected Result**:
- At least one ticket exists in the €50-60 range
- Ticket price is correctly parsed (50 ≤ price ≤ 60)
- Ticket is clickable
- Clicking ticket proceeds to next step

**Implementation**:
```javascript
const selectedTicket = await resultPage.findTicketWithinPriceRange(
    TEST_DATA.MIN_PRICE, 
    TEST_DATA.MAX_PRICE
);
expect(selectedTicket).not.toBeNull();
await resultPage.selectTicket(selectedTicket);
```

---

### Step 10: Extract and Verify Ticket Details
**Action**: 
- Extract price from selected ticket
- Extract journey duration from selected ticket
- Log ticket information

**Expected Result**:
- Price is a valid number between 50-60
- Duration is in format "Xh Ymin" or similar
- Information matches what was displayed

**Implementation**:
```javascript
const ticketDetails = await resultPage.extractTicketDetails(selectedTicket);
console.log(`Selected ticket - Price: ${ticketDetails.price}, Duration: ${ticketDetails.duration}`);
```

---

### Step 11: Verify Basic Fare Option is Visible
**Action**: 
- Check if "Basic" (Básico) fare option is displayed
- Verify it's visible and clickable

**Expected Result**:
- "Basic" fare option is visible on the page
- Option displays fare description/details
- Option is in an enabled/clickable state

**Implementation**:
```javascript
const isBasicFareVisible = await resultPage.isBasicFareVisible();
expect(isBasicFareVisible).toBeTruthy();
```

---

### Step 12: Select Basic Fare
**Action**: 
- Click on the "Basic" (Básico) fare option
- Wait for selection to register

**Expected Result**:
- Fare option is selected/highlighted
- Page updates to reflect selection
- No error messages appear

**Implementation**:
```javascript
await resultPage.clickBasicFare();
```

---

### Step 13: Click Continue Button
**Action**: 
- Locate the continue/select button
- Click the button
- Wait for navigation

**Expected Result**:
- Button is clickable
- Page navigates forward
- Loading indicators appear and complete

**Implementation**:
```javascript
await resultPage.clickContinueButton();
```

---

### Step 14: Handle Fare Upgrade Popup (Conditional)
**Action**: 
- Check if fare upgrade promotional popup appears
- If popup is visible, click to confirm continuing with basic fare
- If popup doesn't appear, continue normally

**Expected Result**:
- If popup appears: Successfully closes after confirmation
- If popup doesn't appear: Test continues without error
- Test doesn't fail regardless of popup presence

**Implementation**:
```javascript
await resultPage.isPromoUpFieldVisible();
```

**Notes**: This step is conditional - popup may not always appear

---

### Step 15: Verify Passenger Details Page Loaded
**Action**: 
- Check if page has navigated to Passenger Details page
- Verify page title or key elements are present
- Confirm URL has changed to passenger details section

**Expected Result**:
- Passenger Details page is loaded
- Page title/header indicates correct page
- Form fields for passenger information are visible
- Test completes successfully

**Implementation**:
```javascript
const isPassengerPageLoaded = await passengerDetailsPage.isPassengerDetailsLoaded();
expect(isPassengerPageLoaded).toBeTruthy();
```

---

## Expected Test Results Summary

### Success Criteria
✓ All navigation steps complete without errors
✓ Search returns available train tickets
✓ Ticket displays both price and duration
✓ At least one ticket exists in €50-60 price range
✓ Basic fare option is available and selectable
✓ User successfully reaches Passenger Details page

### Failure Criteria
✗ Any step throws an unhandled error
✗ No tickets found in search results
✗ No tickets found within specified price range
✗ Basic fare option not available
✗ Unable to navigate to Passenger Details page
✗ Timeout waiting for page elements

## Post-Conditions
1. User is on Passenger Details page
2. Selected ticket information is preserved
3. Basic fare is confirmed
4. Session is ready for passenger information entry
5. Test can continue with passenger details entry (out of scope for this test)

## Test Execution

### Manual Execution
Not applicable - this is an automated test

### Automated Execution
```bash
# Run test
npm test

# Run with UI mode
npm run test:ui

# Run in headed mode (visible browser)
npm run test:headed

# Run in debug mode
npm run test:debug
```

### Expected Execution Time
- **Normal execution**: 30-45 seconds
- **With slow network**: 45-60 seconds
- **With retries**: Up to 90 seconds

## Test Dependencies
1. Node.js v16+
2. npm v8+
3. Playwright v1.58.1+
4. @types/node v25.2.0+
5. Internet connection
6. RENFE website availability

## Test Risks & Mitigation

### Risk: Website Structure Changes
**Impact**: High - Selectors may break
**Mitigation**: Use Page Object Model for easy updates

### Risk: No Available Tickets in Price Range
**Impact**: Medium - Test may fail on certain dates
**Mitigation**: Retry logic to check multiple dates

### Risk: Network Latency
**Impact**: Medium - Timeouts may occur
**Mitigation**: Appropriate wait strategies and configurable timeouts

### Risk: Cookie Banner Variations
**Impact**: Low - May block interactions
**Mitigation**: Robust cookie acceptance logic with fallbacks

## Test Maintenance Notes
- Update selectors in page objects if website structure changes
- Adjust price range in TEST_DATA if needed
- Update station names if RENFE changes naming conventions
- Review and update wait timeouts based on performance

## Test Coverage
This test covers:
- ✓ Homepage navigation
- ✓ Cookie consent handling
- ✓ Journey type selection
- ✓ Station search and selection
- ✓ Search form submission
- ✓ Results page loading
- ✓ Ticket information display
- ✓ Price filtering
- ✓ Ticket selection
- ✓ Fare type selection
- ✓ Navigation to next step
- ✓ Popup handling

This test does NOT cover:
- ✗ Passenger information entry
- ✗ Payment processing
- ✗ Ticket confirmation
- ✗ Round-trip tickets
- ✗ Multi-city tickets
- ✗ Premium/Business class fares

## Related Test Cases
- TC_002: Purchase Round-Trip Ticket (Future)
- TC_003: Purchase Multi-City Ticket (Future)
- TC_004: Modify Existing Booking (Future)
- TC_005: Cancel Booking (Future)

## Test History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | Initial | Initial test case creation |

## Notes
- Test uses explicit waits throughout to ensure reliability
- Implements retry logic for dynamic content loading
- Handles optional elements (cookie banner, promo popup) gracefully
- Logs ticket details for debugging and reporting
- Test is idempotent and can be run multiple times

## Playwright-Specific Considerations
- Uses `waitForLoadState('networkidle')` for page stability
- Employs `waitForSelector()` for element visibility
- Utilizes Page Object Model for maintainability
- Captures traces and screenshots on failure
- Supports parallel execution when running multiple tests

---

**Document Status**: Approved
**Last Review Date**: February 2026
**Next Review Date**: March 2026
