---
'@backstage/plugin-kubernetes-backend': minor
---

PermissionApi of type PermissionEvaluator must now be passed as a parameter when calling proxy.createRequestHandler() for the KubernetesProxyEndpoint. Kubernetes `/proxy` endpoint now requires two tokens in its header per request.The field `X-Kubernetes-Authentication` needs the value of a authentication authorities' bearer token.The field `Authorization` should contain a backstage identity token.
