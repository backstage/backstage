---
'@backstage/core-components': minor
---

**BREAKING** `SignInPage`'s `'guest'` provider now uses `@backstage/plugin-auth-backend-module-guest-provider` to generate tokens. You must install that provider into your backend to continue using the `'guest'` option.

```diff
const backend = createBackend();

+backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

backend.start();
```
