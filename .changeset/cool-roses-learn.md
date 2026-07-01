---
'@backstage/config-loader': patch
---

Added support for comma-separated values in the `BACKSTAGE_ENV` environment variable, allowing multiple environment-specific configuration files to be loaded and stacked at startup. For example, setting `BACKSTAGE_ENV=e2e-test,production` will load `app-config.e2e-test.yaml` and `app-config.production.yaml` in addition to the base `app-config.yaml`, with later environments taking priority. Local override files (`.local.yaml`) are always loaded after all non-local files.
