---
'@backstage/plugin-search-backend-module-pg': minor
---

The default export is now a feature loader that only registers the Postgres search engine when `backend.database.client` is `pg`, and the underlying module is now also exposed as a named export `searchModulePostgresEngine`.
