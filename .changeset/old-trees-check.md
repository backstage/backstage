---
'@backstage/backend-tasks': patch
---

Deprecate the legacy `TaskScheduler.fromConfig` method and stop using the `getVoidlogger` in tests files to reduce the dependency on the soon-to-deprecate `backstage-common` package.
