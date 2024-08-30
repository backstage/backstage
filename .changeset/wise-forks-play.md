---
'@backstage/backend-common': minor
'@backstage/backend-defaults': minor
---

**BREAKING**: Simplifications and cleanup as part of the Backend System 1.0 work.

- The deprecated `dropDatabase` function has now been removed, without replacement.
- The deprecated `LegacyRootDatabaseService` type has now been removed. The implication is that you now need to pass deps to a `DatabaseManager` when constructing one.
- The return type from `DatabaseManager.forPlugin` is now directly a `DatabaseService`, as arguably expected.
