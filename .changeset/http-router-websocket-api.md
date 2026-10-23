---
'@backstage/backend-plugin-api': minor
---

Add WebSocket upgrade handler registration to the HTTP router services, through an options object with a path, raw handler, and optional authentication policy. Plugin routes authenticate by default and supply verified credentials to the handler. Browser clients can pass bearer tokens through the WebSocket protocol header; user-only, cookie, and public routes are supported. Plugins can use their preferred WebSocket library or forward upgrades upstream.

**BREAKING PRODUCERS**: Custom implementations of `HttpRouterService` and `RootHttpRouterService` must implement `addWebSocketHandler`.
