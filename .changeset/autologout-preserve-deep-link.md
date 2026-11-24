---
'@backstage/core-app-api': patch
'@backstage/core-components': patch
'@backstage/frontend-app-api': patch
---

Added support for the `preserveLocation` option in `IdentityApi.signOut`, allowing `AutoLogout` to preserve deep links upon disconnected session expiry.
