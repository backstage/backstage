---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-node': patch
---

Added backstageCredentials to ObjectFetchParams interface so KubernetesFanOutHandler can pass it to fetchObjectsForService.
