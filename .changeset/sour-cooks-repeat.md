---
'@backstage/backend-common': patch
---

Renamed the `loadBackendConfig` option `additionalConfig` to `additionalConfigs` as an array, and ensured that they get passed on properly.

This is technically breaking, but the [original addition](https://github.com/backstage/backstage/pull/16643) hasn't been released in mainline yet so we are taking this step now as a `patch` change.
