---
'@backstage/plugin-catalog-backend': minor
---

Added a `location_entity_ref` column to the `locations` database table that stores the full entity ref of the corresponding `kind: Location` catalog entity for each registered location row. The value is pre-computed and persisted so that it no longer needs to be recomputed from the location's type and target on every read.
