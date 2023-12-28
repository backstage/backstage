---
'@backstage/plugin-kubernetes-react': patch
'@backstage/plugin-kubernetes': patch
---

Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

Thanks to this, people with multiple simultaneously logged-in accounts in their GCP console will automatically view objects with the same email as the one signed in to the Google auth provider in Backstage.
