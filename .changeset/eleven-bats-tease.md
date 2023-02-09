---
'@backstage/plugin-kubernetes-backend': minor
---

`KubernetesBuilder.create` now requires a `permissions` field of type `PermissionEvaluator`. The kubernetes `/proxy` endpoint now requires two tokens: the `X-Kubernetes-Authorization` header should contain a bearer token for the target cluster, and the `Authorization` header should contain a backstage identity token.
