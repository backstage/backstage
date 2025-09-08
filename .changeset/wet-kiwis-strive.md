---
'@backstage/plugin-auth-node': patch
---

Changes OAuth cookies from domain-scoped to host-only by avoid setting the domain attribute in the default cookie configurer.
