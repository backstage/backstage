---
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-pg': patch
---

Internal refactor to use `LoggerService` and `DatabaseService` instead of the legacy `Logger` and `PluginDatabaseManager` types.
