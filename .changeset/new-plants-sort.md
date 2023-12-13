---
'@backstage/plugin-kubernetes-react': patch
'@backstage/plugin-kubernetes': patch
---

Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

Thanks to this, people with multiple simultaneously logged-in accounts in GCP console to be automatically picked.
