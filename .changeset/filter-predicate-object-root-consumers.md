---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-scaffolder': patch
---

Filter predicates with a primitive value at the root, such as a `templateFilter` configured as `false`, are now rejected as invalid.
