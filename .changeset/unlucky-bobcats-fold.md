---
'@backstage/plugin-auth-backend': minor
---

Removed the explicit `disableRefresh` option from `OAuthAdapter`. Refresh can still be disabled for a provider by not implementing the `refresh` method.
