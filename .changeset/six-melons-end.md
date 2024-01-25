---
'@backstage/plugin-kubernetes-react': patch
---

Fixed a bug where the logs dialog and any other functionality depending on the proxy endpoint would fail for clusters configured with the OIDC auth provider.
