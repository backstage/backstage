---
'@backstage/plugin-kubernetes-backend': patch
---

Kubernetes clusters now support `authProvider: aks`. When configured this way,
the `retrieveObjectsByServiceId` action will use the `auth.aks` value in the
request body as a bearer token to authenticate with Kubernetes.
