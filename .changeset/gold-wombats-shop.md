---
'@backstage/core-app-api': patch
'@backstage/core-plugin-api': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-user-settings': patch
---

Bitbucket Cloud authentication - based on the existing GitHub authentication + changes around BB apis and updated scope.

- BitbucketAuth added to core-app-api.
- Bitbucket provider added to plugin-auth-backend.
- Cosmetic entry for Bitbucket connection in user-settings Authentication Providers tab.
