---
'@backstage/backend-common': patch
---

**BREAKING** The config prop `ensureExists` now applies to schema creation when `pluginDivisionMode` is set to `schema`. This means schemas will no longer be automatically created when `ensureExists` is set to `false`. In this case the `pg` database as well as each `schema` must be created out of band.
