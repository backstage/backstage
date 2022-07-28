---
'@backstage/plugin-catalog-backend': patch
---

Fix issue for conditional decisions based on properties stored as arrays, like tags.

Before this change, having a permission policy returning conditional decisions based on metadata like tags, such like `createCatalogConditionalDecision(permission, catalogConditions.hasMetadata('tags', 'java'),)`, was producing wrong results. The issue occurred when authorizing entities already loaded from the database, for example when authorizing `catalogEntityDeletePermission`.
