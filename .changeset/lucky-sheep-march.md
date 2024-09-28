---
'@backstage/core-components': patch
'@backstage/core-app-api': patch
---

Fix auto sign-in bug after logout for Okta auth provider.
Added a query parameter to prevent auto-login flow from being triggered after redirecting to the home page following logout.
