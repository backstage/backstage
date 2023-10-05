---
'@backstage/create-app': patch
---

The E2E test setup based on Cypress has been replaced with one based on [Playwright](https://playwright.dev/). Migrating existing apps is not required as this is a standalone setup, only do so if you also want to switch from Cypress to Playwright.

The scripts to run the E2E tests have been removed from `packages/app/package.json`, as they are now instead run from the root. Instead, a new script has been added to the root `package.json`, `yarn test:e2e`, which runs the E2E tests in development mode, unless `CI` is set in the environment.

The Playwright setup uses utilities from the new `@backstage/e2e-test-utils` package to find and include all packages in the monorepo that have an `e2e-tests` folder.
