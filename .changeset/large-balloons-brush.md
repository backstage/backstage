---
'@backstage/plugin-auth-node': minor
---

**BREAKING**: The recently introduced `ProxyAuthenticator.initialize()` method is no longer `async` to match the way the OAuth equivalent is implemented.
