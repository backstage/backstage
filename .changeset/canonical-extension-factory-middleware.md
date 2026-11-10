---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
---

Updated app options to use the `ExtensionFactoryMiddleware` type from `@backstage/frontend-app-api` instead of the deprecated export from `@backstage/frontend-plugin-api`. Middleware behavior is unchanged.
