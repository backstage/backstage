---
'@backstage/plugin-kubernetes': patch
---

The Kubernetes plugin now requests AKS access tokens from Azure when retrieving
objects from clusters configured with `authProvider: aks` and sets `auth.aks` in
its request bodies appropriately.
