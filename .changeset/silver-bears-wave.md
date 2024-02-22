---
'@backstage/plugin-kubernetes-backend': patch
---

Fixed bug at Kubernetes proxy, now when ServiceAccount Strategy is used and no serviceAccountToken has been provided, the Kubernetes Proxy assumes backstage is running on k8s, so it is able to get the token and CA from the Pod instance
