---
'@backstage/backend-defaults': minor
---

**BREAKING**: Simplifications and cleanup as part of the Backend System 1.0 work.

- The deprecated `dropDatabase` function has now been removed, without replacement.
- The deprecated `LegacyRootDatabaseService` type has now been removed.
- The return type from `DatabaseManager.forPlugin` is now directly a `DatabaseService`, as arguably expected.
- `DatabaseManager.forPlugin` now requires the `deps` argument, with the logger and lifecycle services.
