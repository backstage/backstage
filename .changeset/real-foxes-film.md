---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-cluster': patch
'@backstage/plugin-kubernetes-common': patch
'@backstage/plugin-kubernetes': patch
---

The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
