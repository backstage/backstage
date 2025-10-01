---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-node': patch
---

Added backstage identity to ObjectFetchParams interface so KubernetesFanOutHandler can pass it to fetchObjectsForService.
