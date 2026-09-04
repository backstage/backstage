---
'@backstage/plugin-scaffolder-backend': patch
---

Removed user entity references from scaffolder task count metrics to avoid exposing user identities and creating high-cardinality metric labels.
