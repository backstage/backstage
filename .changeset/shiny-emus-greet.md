---
'@backstage/backend-plugin-api': patch
'@backstage/backend-test-utils': patch
'@backstage/plugin-permission-common': patch
'@backstage/plugin-permission-react': patch
'@backstage/plugin-permission-node': patch
'@backstage/test-utils': patch
---

Allow creating batch permission requests through client

Sometimes it's necessary to check multiple permissions at once using the `permissionApiRef`.
A new function `authorizeBatch` is now available publicly.
