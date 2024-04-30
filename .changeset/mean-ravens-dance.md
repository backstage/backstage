---
'@backstage/backend-common': minor
---

Internal refactor of the database code.

**BREAKING**: The helper functions `createDatabaseClient` and `ensureDatabaseExists` have been removed from the public interface, since they have no usage within the repository and never were suitable for calling from the outside. Please consider using `coreServices.database` or `DatabaseManager` directly wherever possible instead.
