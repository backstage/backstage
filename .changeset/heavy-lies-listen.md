---
'@backstage/plugin-kubernetes-backend': patch
---

Fix a bug where `getDefault` in the `kubernetesFetcherExtensionPoint` had the wrong `this` value
