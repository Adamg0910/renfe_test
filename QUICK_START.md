# Quick Start Guide - RENFE Test Automation

## 🚨 IMPORTANT: This is a Python Project!

If you tried to run `npm install` and got an error, **that's expected!** This is a **Python project**, not a Node.js project.

## ❌ What NOT to Do

```bash
npm install        # ❌ WRONG - This will fail!
npm test           # ❌ WRONG - No package.json exists
node something.js  # ❌ WRONG - This is not JavaScript
```

## ✅ What to Do Instead

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the Tests
```bash
pytest tests/test_renfe.py -v
```

That's it! 🎉

## Quick Commands Reference

| Task | Command |
|------|---------|
| Install dependencies | `pip install -r requirements.txt` |
| Run all tests | `pytest tests/test_renfe.py -v` |
| Run with output | `pytest tests/test_renfe.py -v -s` |
| Generate HTML report | `pytest --html=reports/report.html` |
| Run smoke tests only | `pytest -m smoke tests/` |

## Project Stack

- **Language**: Python 3.x
- **Framework**: Selenium WebDriver
- **Test Runner**: Pytest
- **Pattern**: Page Object Model

## Folder Structure

```
tests/
├── test_renfe.py           # Main test file
├── conftest.py             # Pytest configuration
├── pages/                  # Page objects
│   ├── base_page.py
│   ├── home_page.py
│   ├── result_page.py
│   └── passenger_details_page.py
└── utils/
    └── test_data.py        # Test constants
```

## Need More Help?

- 📖 See `README.md` for full documentation
- 📋 See `SETUP.md` for detailed setup instructions
- 📝 See `TEST_CASE.md` for test case details

## Common Questions

### Q: Why doesn't `npm install` work?
**A:** This is a Python project, not Node.js. Use `pip install` instead.

### Q: Where is package.json?
**A:** There isn't one! This project uses `requirements.txt` for Python dependencies.

### Q: Can I use Node.js/JavaScript instead?
**A:** This branch is Python-only. If you need JavaScript, please request a separate branch.

### Q: How do I see the browser while testing?
**A:** Edit `tests/conftest.py` and comment out the `--headless` option.

---

🐍 Happy Testing with Python! 🐍
