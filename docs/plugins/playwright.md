---
id: playwright
title: Testing with Playwright
description: Testing frontend plugins with Playwright
---

Testing frontend plugins UI can be done using [Playwright](https://playwright.dev/).

Playwright is a UI test framework built by Microsoft, and comes in with support for
all major browsers and platforms.

## Installing Playwright

Add the playwright test library to the workspace:

    yarn add -D @playwright/test

Install runners and browsers (e.g. Chrome)

    yarn playwright install --with-deps chrome

## Test Configuration

Playwright requires a configuration file to set all the runner options.
For typescript, the default name is `playwright.config.ts`.

Example configuration file:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // where the tests are located
  testDir: 'tests',

  // launch the plugin before the tests run
  webServer: process.env.PLAYWRIGHT_URL
    ? []
    : [
        {
          command: 'yarn start',
          port: 3000,
          reuseExistingServer: true,
          cwd: 'plugins/myPlugin',
        },
      ],

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  reporter: [['html', { open: 'never', outputFolder: 'e2e-test-report' }]],

  // point to 'http://localhost:3000' by default
  use: {
    baseURL: process.env.PLAYWRIGHT_URL ?? 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  // test on chrome
  projects: [
    {
      use: {
        channel: 'chrome',
      },
    },
  ],
});
```

For full list of available options, see the [documentation](https://playwright.dev/docs/test-configuration).

## Writing test cases

Playwright test cases consist of taking actions, and performing assertions.

Example test case:

```typescript
import { test, expect } from '@playwright/test';

test('Guest login to backstage works', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Enter' }).click();

  await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
});
```

### Locating elements

The `page` fixture API offers multiple built-in [locators](https://playwright.dev/docs/locators#quick-guide).
These include locating by text, role, label, or other user-facing attributes.

While locating by attributes such as CSS or Xpath is available, it is discouraged in favour of the user-facing locators.

### Test isolation

Passing the built-in `page` fixture to tests will create a separate browser context for each test case.
By default, test cases don't share environment, and Playwright will attempt to run them in parallel.

```typescript
test('Test A', async ({ page }) => {
...
test('Test B', async ({ page }) => {
```

Test A and B run using isolated browser pages.

## Running tests

To run the tests headless:

    yarn playwright test

Using a headed browser:

    yarn playwright test --headed

Using the Playwright UI runner:

    yarn playwright test --ui

The UI runner is particulary useful when writing tests, as it shows step-by-step execution, and records
the page's state at every action taken.
