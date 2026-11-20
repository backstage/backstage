---
'@backstage/plugin-kubernetes-node': patch
---

Added `kubernetesProxyPermissionResourceRef` for the Kubernetes proxy permission resource type, along with `KubernetesProxyRequest` and `KubernetesAction` types. These are used by the permission framework to evaluate attribute-based access control conditions on proxy requests.
