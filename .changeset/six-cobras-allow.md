---
'@backstage/plugin-scaffolder-backend': minor
---

- **BREAKING** - Removed the re-export of types `TaskSpec` `TaskSpecV1Beta2` and `TaskSpecV1Beta3` these should now be import from `@backstage/plugin-scaffolder-common` directly.
- **BREAKING** - Removed the `observe` method from the `TaskBroker` interface, this has now been replaced with an `Observable` implementation under `event$`.
