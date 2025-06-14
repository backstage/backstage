---
'@backstage/plugin-scaffolder-node': patch
---

Use `LoggerService` instead of `Logger`. This is a non-breaking change, as the `LoggerService` is a subset of the `Logger` interface.
