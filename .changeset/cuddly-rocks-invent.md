---
'@backstage/backend-dynamic-feature-service': minor
---

**BREAKING**: `dynamicPluginsServiceFactory` is no longer callable as a function. If you need to provide options to make a custom factory, use `dynamicPluginsSchemasServiceFactoryWithOptions` instead.
