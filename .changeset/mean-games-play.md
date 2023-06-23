---
'@backstage/plugin-catalog-backend-module-unprocessed': patch
---

Downgrade `knex` dependency to version `^2.0.0`. With the newest version the usage of this plugin is causing the `yarn tsc` command to complain due to incompatible types
