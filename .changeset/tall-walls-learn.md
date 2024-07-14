---
'@backstage/backend-plugin-api': patch
---

All service config types were renamed to option types in order to standardize frontend and backend `create*` function signatures:

- The `ServiceRefConfig` type was renamed to`ServiceRefOptions`;
- The `RootServiceFactoryConfig` type was renamed to `RootServiceFactoryOptions`;
- The `PluginServiceFactoryConfig` type was renamed to `PluginServiceFactoryOptions`
