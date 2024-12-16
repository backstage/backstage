---
'@backstage/backend-dynamic-feature-service': patch
'@backstage/frontend-dynamic-feature-loader': patch
'@backstage/frontend-defaults': patch
---

The new package `frontend-dynamic-features-loader` provides a frontend feature loader that dynamically
loads frontend features based on the new frontend system and exposed as module federation remotes.
This new frontend feature loader works hand-in-hand with a new server of frontend plugin module federation
remotes, which is added as part of backend dynamic feature service in package `@backstage/backend-dynamic-feature-service`.
