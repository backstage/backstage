---
'@backstage/backend-defaults': patch
---

Remove use of the `stoppable` library on the `DefaultRootHttpRouterService` as Node's native http server [close](https://nodejs.org/api/http.html#serverclosecallback) method already drains requests.
Also, we pass a new `lifecycleMiddleware` to the `rootHttpRouterServiceFactory` configure function that must be called manually if you don't call `applyDefaults`.
