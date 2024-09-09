---
'@backstage/plugin-catalog-backend': patch
---

Fixed an issue with the by-query call, where ordering by a field that does not exist on all entities led to not all results being returned
