---
'@backstage/core-app-api': patch
---

Adds the optional `signOutUrl` value to the app config that can be used in combination with Oauth2 Proxy. The `AppRouter` will check if the value is within the app config, set it to the `IdentityApi`, and use this value to navigate to the sign out page of the configured authentication provider on `signOut`.
