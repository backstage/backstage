---
'@backstage/plugin-catalog-backend': patch
---

Fixed several database migration `down` functions that were not properly reversible, causing the SQL report to show warnings:

- `20241003170511_alter_target_in_locations.js`: both `up` and `down` now include `.notNullable()` when altering the `locations.target` column, preventing the `NOT NULL` constraint from being accidentally dropped when widening the column type from `varchar(255)` to `text`.
- `20220116144621_remove_legacy.js`: the `down` function now properly recreates the three dropped legacy tables (`entities`, `entities_search`, `entities_relations`) with correct columns and indices.
- `20210302150147_refresh_state.js`: the `down` function now drops dependent tables in the correct order (avoiding a FK constraint violation) and fixes a typo where the table was referred to as `references` instead of `refresh_state_references`.
- `20201005122705_add_entity_full_name.js`: the `down` function now drops the `full_name` column from `entities` (not `entities_search`), and restores the `entities_unique_name` index with the correct column order `(kind, name, namespace)`.
- `20200702153613_entities.js`: the `down` function now uses `table.integer('generation')` instead of `table.string('generation')`, restoring the correct column type.
