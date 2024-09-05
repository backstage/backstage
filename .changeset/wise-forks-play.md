---
'@backstage/backend-defaults': minor
---

**BREAKING**: Simplifications and cleanup as part of the Backend System 1.0 work.

For the `/database` subpath exports:

- The deprecated `dropDatabase` function has now been removed, without replacement.
- The deprecated `LegacyRootDatabaseService` type has now been removed.
- The return type from `DatabaseManager.forPlugin` is now directly a `DatabaseService`, as arguably expected.
- `DatabaseManager.forPlugin` now requires the `deps` argument, with the logger and lifecycle services.

For the `/cache` subpath exports:

- The `PluginCacheManager` type has been removed. You can still import it from `@backstage/backend-common`, but it's deprecated there, and you should move off of that package by migrating fully to the new backend system.
- Accordingly, `CacheManager.forPlugin` immediately returns a `CacheService` instead of a `PluginCacheManager`. The outcome of this is that you no longer need to make the extra `.getClient()` call. The old `CacheManager` with the old behavior still exists on `@backstage/backend-common`, but the above recommendations apply.
