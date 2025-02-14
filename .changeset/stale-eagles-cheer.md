---
'@backstage/plugin-auth-node': patch
---

Added `scopeAlreadyGranted` property to `OAuthAuthenticatorRefreshInput`, signaling to the provider whether the requested scope has already been granted when persisting session scope.
