---
'@backstage/plugin-kubernetes-backend': patch
---

Fixed a bug where the proxy endpoint would error when used in combination with
a local kubectl proxy process and a token-based auth strategy on-cluster.
