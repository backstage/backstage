---
'@backstage/backend-app-api': patch
---

Exported the default root HTTP router implementation as `DefaultRootHttpRouter`. It only implements the routing layer and needs to be exposed via an HTTP server similar to the built-in setup in the `rootHttpRouterFactory`.
