---
'@backstage/plugin-kubernetes-backend': patch
---

Fixed a bug in the proxy endpoint. Now when the `serviceAccount` strategy is used and no `serviceAccountToken` has been provided, the proxy endpoint assumes backstage is running on Kubernetes and gets the URL and CA from the Pod instance.
