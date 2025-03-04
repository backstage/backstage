---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Update actual catalog.providers.microsoftGraphOrg.target config def to be optional as this has a default value. Revert the previously mistakenly updated processors config which as it is deprecated.
