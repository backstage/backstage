---
'@backstage/create-app': patch
---

Updates the end to end test in the app to match the new catalog index page title. To apply this change to an existing app, update `packages/app/cypress/integration/app.js` to search for `"My Company Catalog"` instead of `"My Company Service Catalog"`.
