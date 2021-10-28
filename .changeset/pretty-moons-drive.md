---
'@backstage/backend-common': patch
---

Adding config prop `usePluginSchemas` to allow plugins using the `pg` client to create their own management schemas in the db. This allows `pg` client plugins to work in separate schemas in the same db.
