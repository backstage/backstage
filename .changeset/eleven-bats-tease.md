---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING**: `KubernetesBuilder.create` now requires a `permissions` field of type `PermissionEvaluator`. The kubernetes `/proxy` endpoint now requires two tokens: the `Backstage-Kubernetes-Authorization` header should contain a bearer token for the target cluster, and the `Authorization` header should contain a backstage identity token. The kubernetes `/proxy` endpoint now requires a `Backstage-Kubernetes-Cluster` header replacing the previously required `X-Kubernetes-Cluster` header.
