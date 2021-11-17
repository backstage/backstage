---
'@backstage/config-loader': minor
---

Update `loadConfig` to return `LoadConfigResult` instead of an array of `AppConfig`.

This function is primarily used internally by other config loaders like `loadBackendConfig` which means no changes are required for most users.

If you use `loadConfig` directly you will need to update your usage from:

```diff
- const appConfigs = await loadConfig(options)
+ const { appConfigs } = await loadConfig(options)
```
