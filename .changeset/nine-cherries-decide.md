---
'@backstage/backend-common': patch
---

The remaining exports in the package have now been deprecated:

- `cacheToPluginCacheManager`
- `createLegacyAuthAdapters`
- `LegacyCreateRouter`
- `legacyPlugin`
- `loggerToWinstonLogger`
- `makeLegacyPlugin`

Users of these export should fully [migrate to the new backend system](https://backstage.io/docs/backend-system/building-backends/migrating).
