---
'@backstage/backend-defaults': patch
---

Added an `instanceId` option to `createBackend`, allowing deployments to use an externally provided backend instance identifier. Each backend instance uses a random UUID by default.
