# Troubleshooting Guide - RENFE Test Automation

## Common Issues and Solutions

### ❌ ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'

This error means `requirements.txt` is not found in your current directory.

#### Solution Steps:

**Step 1: Verify you're in the correct directory**
```bash
# Windows PowerShell
cd C:\Users\adamg\Desktop\python\renfe_test
ls

# Linux/Mac
cd ~/renfe_test
ls
```

You should see `requirements.txt` in the file list. If you don't see it, continue to Step 2.

**Step 2: Check if you have the latest repository changes**

The repository was recently updated to remove JavaScript files and keep only Python files. You need to pull the latest changes:

```bash
# Check current branch
git branch

# Check remote status
git remote -v

# Pull latest changes
git pull origin copilot/create-automation-project
```

**Step 3: If you just cloned the repository**

Make sure you're on the correct branch:

```bash
# List all branches
git branch -a

# Switch to the correct branch if needed
git checkout copilot/create-automation-project

# Pull latest changes
git pull
```

**Step 4: Verify the file exists**

After pulling, verify `requirements.txt` is present:

```bash
# Windows PowerShell
dir requirements.txt

# Linux/Mac
ls -l requirements.txt

# View the content
cat requirements.txt
```

Expected content:
```
# Selenium WebDriver for browser automation
selenium==4.27.1

# Pytest testing framework
pytest==8.3.4

# WebDriver Manager for automatic driver management
webdriver-manager==4.0.2

# Additional useful packages
pytest-html==4.1.1  # HTML test reports
```

**Step 5: If file still doesn't exist**

The file might not have been pushed yet, or you might be on an old commit. Try:

```bash
# Fetch all remote changes
git fetch origin

# Reset to the latest remote branch
git reset --hard origin/copilot/create-automation-project
```

⚠️ **Warning:** This will discard any local changes!

---

### ❌ ERROR: npm error enoent Could not read package.json

**Solution:** This is a Python project, NOT Node.js!

Don't use:
- `npm install` ❌
- `npm test` ❌

Use instead:
- `pip install -r requirements.txt` ✅
- `pytest tests/test_renfe.py -v` ✅

See [QUICK_START.md](QUICK_START.md) for details.

---

### ❌ ModuleNotFoundError: No module named 'selenium'

**Problem:** Python dependencies not installed.

**Solution:**
```bash
pip install -r requirements.txt
```

If using a virtual environment (recommended):
```bash
# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### ❌ WebDriver/ChromeDriver errors

**Problem:** ChromeDriver version mismatch or not found.

**Solution:** This project uses `webdriver-manager` which automatically downloads the correct ChromeDriver. Just ensure you have Chrome installed:

1. Install Google Chrome browser
2. Run: `pip install -r requirements.txt`
3. The correct ChromeDriver will be downloaded automatically on first test run

---

### ❌ TimeoutException or element not found errors

**Problem:** Website structure might have changed, or network issues.

**Solutions:**

1. **Check internet connection:**
   - Verify you can access https://www.renfe.com/es/es in your browser

2. **Run in headed mode to see what's happening:**
   - Edit `tests/conftest.py`
   - Comment out the line: `chrome_options.add_argument('--headless')`
   - Run tests again to see the browser

3. **Increase timeouts if needed:**
   - Edit page objects in `tests/pages/`
   - Increase timeout values (default is 10 seconds)

4. **Check if RENFE website structure changed:**
   - Selectors might need updating
   - Check `tests/pages/*.py` files

---

### ❌ Python version issues

**Problem:** Wrong Python version or pip not found.

**Solution:**

Ensure Python 3.7 or higher is installed:

```bash
# Check Python version
python --version
# or
python3 --version

# Check pip version
pip --version
# or
pip3 --version
```

If Python is not installed:
- **Windows:** Download from https://www.python.org/downloads/
- **Linux:** `sudo apt-get install python3 python3-pip`
- **Mac:** `brew install python3`

---

### ❌ Permission denied errors (Linux/Mac)

**Problem:** No permission to install packages globally.

**Solutions:**

1. **Use virtual environment (recommended):**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. **Install for current user only:**
```bash
pip install --user -r requirements.txt
```

3. **Use sudo (not recommended):**
```bash
sudo pip install -r requirements.txt
```

---

### ❌ Tests are failing

**Common reasons and solutions:**

1. **Network issues:**
   - Ensure you have internet access
   - Check if https://www.renfe.com/es/es is accessible

2. **Website changes:**
   - RENFE website might have changed
   - Selectors in page objects might need updates

3. **Browser issues:**
   - Ensure Chrome browser is installed
   - Try updating Chrome to the latest version
   - Clear Chrome cache and try again

4. **Environment issues:**
   - Run in headed mode to debug
   - Check console output for detailed error messages

---

## Quick Checklist for Setup

✅ **Before running tests, ensure:**

- [ ] Python 3.7+ is installed: `python --version`
- [ ] Git repository is up to date: `git pull`
- [ ] You're in the correct directory: `ls requirements.txt`
- [ ] Dependencies are installed: `pip install -r requirements.txt`
- [ ] Chrome browser is installed
- [ ] Internet connection is working

---

## Getting Help

If you're still having issues:

1. Check [README.md](README.md) for project overview
2. Check [SETUP.md](SETUP.md) for detailed setup instructions
3. Check [QUICK_START.md](QUICK_START.md) for quick commands
4. Review [TEST_CASE.md](TEST_CASE.md) for test details

---

## Recent Repository Changes

**Important:** The repository was recently updated (February 2026) to remove JavaScript/Playwright files and keep only Python/Selenium files.

**If you cloned before this change:**
- You might have old files (package.json, *.js files)
- Pull the latest changes: `git pull origin copilot/create-automation-project`
- The repository now only uses Python

**Changes made:**
- ❌ Removed: package.json, package-lock.json, playwright.config.js, all *.js files
- ✅ Kept: requirements.txt, pytest.ini, all *.py files
- ✅ Added: QUICK_START.md, updated README.md and SETUP.md

---

## Still Need Help?

If none of these solutions work, check:
1. Your Python installation: `python --version`
2. Your pip installation: `pip --version`
3. Your current directory: `pwd` (Linux/Mac) or `cd` (Windows)
4. Files in directory: `ls` (Linux/Mac) or `dir` (Windows)
5. Git status: `git status`
6. Git log: `git log --oneline -3`

Report the output of these commands when asking for help.
