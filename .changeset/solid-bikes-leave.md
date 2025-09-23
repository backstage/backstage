---
'@backstage/plugin-scaffolder-node': patch
---

**DEPRECATION**: We're going to be working on refactoring a lot of the internals of the Scaffolder backend plugin, and with that comes a lot of deprecations and removals for public types that are making these things hard.

If you're using these types, please reach out to us either on Discord or a GitHub issue with your use cases.

- `SerializedTask`, `SerializedTaskEvent`, `TaskBroker`, `TaskContext`, `TaskBrokerDispatchOptions`, `TaskBrokerDispatchResult`, `TaskCompletionState`, `TaskEventType`, `TaskFilter`, `TaskFilters`, `TaskStatus` are the types that have now been marked as deprecated, and will be removed in a future release.
