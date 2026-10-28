---
'@backstage/frontend-plugin-api': minor
---

Removed deprecated frontend plugin identity aliases. Use `pluginId`, `CreateFrontendPluginOptions`, and `PageLayoutTab`, and create API references with `createApiRef<T>().with(...)`.

The `createApiRef` export from `@backstage/core-plugin-api` still accepts configuration directly. Older frontend plugin objects remain supported at runtime.
