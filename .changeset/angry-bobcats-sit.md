---
'@backstage/backend-common': patch
---

The `subscribe` method on the `Config` returned by `loadBackendConfig` is now forwarded through `getConfig` and `getOptionalConfig`.
