---
'@backstage/core-components': patch
---

`SignInPage`'s `'guest'` provider now supports the `@backstage/plugin-auth-backend-module-guest-provider` package to generate tokens. It will continue to use the old frontend-only auth as a fallback.
