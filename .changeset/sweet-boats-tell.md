---
'@backstage/plugin-kubernetes-common': minor
---

**BREAKING**: The `kubernetesProxyPermission` is now a `ResourcePermission` with resource type `kubernetes-proxy-request`. This enables attribute-based access control on the Kubernetes proxy endpoint. Permission policies that reference this permission may need to be updated to handle conditional decisions. Frontend code that checks `kubernetesProxyPermission` with `usePermission` must now provide a `resourceRef`; checks without one are rejected by the permission backend. Backend permission checks continue to work. A new `RESOURCE_TYPE_KUBERNETES_PROXY` constant is exported for use in permission policies.
