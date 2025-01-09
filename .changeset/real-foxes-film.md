---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-cluster': minor
'@backstage/plugin-kubernetes-common': minor
'@backstage/plugin-kubernetes': minor
---

**BREAKING** The `/clusters` endpoint is now protected by the `kubernetes.clusters.read` permission.
**BREAKING** The `/services/:serviceId` endpoint is now protected by the `kubernetes.resources.read` permission.
**BREAKING** The `/resources` endpoints are now protected by the `kubernetes.resources.read` permission.
