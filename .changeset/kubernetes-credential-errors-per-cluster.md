---
'@backstage/plugin-kubernetes-backend': patch
---

Failing to get credentials for a cluster, for example when an AWS role cannot be assumed, no longer fails the whole request for an entity's Kubernetes objects. The error is now reported for that cluster only, and objects from the remaining clusters are still returned.
