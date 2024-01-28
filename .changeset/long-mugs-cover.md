---
'@backstage/backend-plugin-api': minor
'@backstage/backend-app-api': minor
---

**BREAKING**: `HttpRouterService`'s `use` is now protected by default, using the `Authorization` header. There are 2 new methods to cover use cases where protected by default may not be desired, `useWithoutAuthentication` and `useWithCookieAuthentication`.

Tokens will now be required for all sessions. This means that if you are using the default `'guest'` authentication, you should migrate to either the `@backstage/plugin-auth-backend-module-guest-provider` or a more tailored provider.
