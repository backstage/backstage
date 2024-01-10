---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-node': patch
---

Enabled a way to include custom auth metadata info on the clusters endpoint. Ff you want to implement a Kubernetes auth strategy which requires surfacing custom auth metadata to the frontend, use the new presentAuthMetadata method on the AuthenticationStrategy interface
