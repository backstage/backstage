---
'@backstage/plugin-kubernetes': patch
---

fixes a bug where an empty authorization header was provided to the proxy endpoint when a cluster had a server-side auth provider
