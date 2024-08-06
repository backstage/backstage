---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-common': patch
---

- The `analyze-location` endpoint is now protected by the `catalog.location.create` permission.
- The `validate-entity` endpoint is now protected by the `catalog.entity.create` permission.
