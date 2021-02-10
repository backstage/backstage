---
'@backstage/plugin-scaffolder-backend': minor
---

Introduced `v2` Scaffolder REST API, which uses an implementation that is database backed, making the scaffolder instances stateless. The `createRouter` function now requires a `PluginDatabaseManager` instance to be passed in, commonly available as `database` in the plugin environment in the backend.

This API should be considered unstable until used by the scaffolder frontend.
