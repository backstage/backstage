---
'@backstage/plugin-scaffolder-backend': patch
---

The `catalog:write` action now automatically adds a `backstage.io/template-source` annotation, indicating which Scaffolder template was used to create the entity.
