---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

Handle error gracefully if failure occurs while loading photos using Microsoft Graph API.

This includes a breaking change: you now have to pass the `options` object to `readMicrosoftGraphUsers` and `readMicrosoftGraphOrg`.
