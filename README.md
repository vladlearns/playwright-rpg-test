
# Automated Testing with Playwright and TypeScript for the RPG Game

This repository contains an automated test suite for the RPG game application hosted at [https://test-rpg.vercel.app/play](https://test-rpg.vercel.app/play). The tests are written in TypeScript using the Playwright testing framework. The primary test automates the process of logging in, creating a character named "Knight," leveling up, and reaching the highest level in the game.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Tests](#running-the-tests)



---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 20 or higher.

---

## Installation

1. **Clone the Repository**

   ```bash
    git clone
    ```

### Install Dependencies

Install the Node.js dependencies:

```bash
npm install
```

### Install Playwright Browsers

Install the required browsers for Playwright:

```bash
npx playwright install --with-deps
```

The --with-deps option ensures that all necessary browser dependencies are installed.

## Environment Variables
The tests are configurable using environment variables. These variables allow you to adjust test parameters without modifying the code.

### Available Environment Variables

TEST_TIMEOUT: (Optional) The timeout for each test in milliseconds. Default is 300000 (5 minutes).

MAX_LEVEL_UPS: (Optional) The maximum number of level-up attempts. Default is 20.

BUILDS: (Optional) A comma-separated list of character builds to test. Default is Knight.

MAX_LEVEL: (Optional) The maximum level to reach. Default is 5.

BASE_URL: (Optional) The base URL of the application. Default is <https://test-rpg.vercel.app/>.

Setting Environment Variables Locally
Create a .env file in the root directory of the project:

```env
TEST_TIMEOUT=300000
MAX_LEVEL_UPS=20
BUILDS=Knight
MAX_LEVEL=5
BASE_URL=<https://test-rpg.vercel.app/>
```

## Running the Tests

Execute All Tests

```bash
npx playwright test
```

This command will run all tests in the tests/ directory across all configured browsers (Chromium, Firefox, WebKit), using the environment variables specified.

Running Tests in a Specific Browser
To run tests in a specific browser, use the --project flag:

```bash
npx playwright test --project=chromium
```

Available browser options are:

chromium

firefox

webkit

Viewing the Test Report
After running the tests, you can generate and view the HTML report:

```bash
npx playwright show-report
```

This command will open the test report in your default browser.
