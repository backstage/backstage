---
'@backstage/e2e-test-utils': patch
---

Added `generateProjectsWithAuthSetup` function that provides automatic authentication setup for Playwright tests out of the box. This function scans the monorepo for e2e test packages and configures them to use shared authentication state without requiring adopters to manually create setup files. A default guest authentication setup is provided, with the option to customize via the `setupTestMatch` pattern if needed.
