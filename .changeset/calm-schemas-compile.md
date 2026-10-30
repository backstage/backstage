---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-scaffolder-backend': patch
---

Entity validation keeps using the faster ajv engine, now that `@backstage/catalog-model` interprets schemas by default.
