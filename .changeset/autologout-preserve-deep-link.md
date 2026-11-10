---
'@backstage/frontend-plugin-api': patch
'@backstage/core-plugin-api': minor
'@backstage/core-app-api': patch
'@backstage/core-components': patch
'@backstage/frontend-app-api': patch
---

Added `SignOutOptions` with `preserveLocation` to `IdentityApi.signOut`, allowing `AutoLogout` to preserve deep links upon disconnected session expiry.
