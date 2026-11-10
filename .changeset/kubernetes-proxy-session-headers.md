---
'@backstage/plugin-kubernetes-backend': patch
---

Kubernetes proxy: stop forwarding the caller's `Authorization` and `Cookie` headers to the target cluster. Upstream requests now carry only credentials from the configured auth strategy or the `Backstage-Kubernetes-Authorization` header.
