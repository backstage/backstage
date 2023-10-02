---
'@backstage/plugin-auth-node': patch
---

Fix `authenticate()`'s `ctx` properties being missing due to being wrapped in a `Promise`
