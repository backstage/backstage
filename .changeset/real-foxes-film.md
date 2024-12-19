---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-common': minor
---

The `/clusters` endpoint is now protected by the `kubernetes.clusters` permission.
The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources` permission.
The `/resources` endpoints are now protected by the `kubernetes.resources` permission.
