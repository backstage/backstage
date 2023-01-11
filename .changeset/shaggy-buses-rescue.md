---
'@backstage/backend-app-api': patch
---

Moved over logging and configuration loading implementations from `@backstage/backend-common`. There is a now `WinstonLogger` which implements the `RootLoggerService` through Winston with accompanying utilities. For configuration the `loadBackendConfig` function has been moved over, but it now instead returns an object with a `config` property.
