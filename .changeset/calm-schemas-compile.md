---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-backend-module-scaffolder-entity-model': patch
---

Entity validation keeps using the faster ajv engine, now that `@backstage/catalog-model` validates without generating code by default.
