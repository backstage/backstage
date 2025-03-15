---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
---

It's now possible to provide a middleware that wraps all extension factories by passing an `extensionFactoryMiddleware` to either `createApp()` or `createSpecializedApp()`.
