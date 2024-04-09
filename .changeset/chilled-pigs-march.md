---
'@backstage/backend-app-api': patch
---

Deprecate the `getPath` option for the `httpRouterServiceFactory` and more generally the ability to configure plugin API paths to be anything else than `/api/:pluginId/`. Requests towards `/api/*` that do not match an installed plugin will also no longer be handled by the index router, typically instead returning a 404.
