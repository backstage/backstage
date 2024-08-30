---
'@backstage/backend-defaults': patch
---

Added the option to skip database migrations by setting `skipMigrations: true` in config. This can be done globally in the database config or by plugin id.
