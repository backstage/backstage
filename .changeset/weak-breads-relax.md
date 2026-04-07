---
'@backstage/plugin-catalog-backend-module-scaffolder-entity-model': minor
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/catalog-model': minor
---

Added optional `spec.owners` (string array) field to Component, API, System, Domain, Resource, and Template kinds. When `spec.owners` is provided, ownership relations are emitted for all entries. Existing `spec.owner` usage is unaffected.
