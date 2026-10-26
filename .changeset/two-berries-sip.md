---
'@backstage/plugin-kubernetes-backend': patch
---

Added attribute-based access control (ABAC) to the Kubernetes API proxy endpoint. The proxy now evaluates permissions using request attributes including HTTP method, Kubernetes resource type, namespace, cluster, and action category. This allows permission policies to distinguish between read, write, delete, and exec operations, enabling least-privilege access to the Kubernetes API. Permission rules `isCluster`, `isNamespace`, `isResourceType`, `isAction`, and `isVerb` are available for policy authors. Condition factories are exported as `kubernetesConditions` and `createKubernetesProxyConditionalDecision`. Legacy watch paths and percent-encoded path segments are interpreted before policy evaluation, while ambiguous paths are denied. Requests to Kubernetes `proxy` subresources are classified as `exec`. Permissions are registered through the permissions registry service instead of the deprecated permission integration router.
