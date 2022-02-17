---
'@backstage/plugin-scaffolder-backend': minor
---

**BREAKING** - Removed the `CatalogEntityClient` export. This is no longer provider by this package,
but you can implement one pretty simply yourself using the `CatalogApi` and applying filters to fetch templates.
