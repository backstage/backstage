---
'@backstage/backend-common': patch
---

Replaced dependencies on the `Logger` type from `winston` with `LoggerService` from `@backstage/backend-plugin-api`. This is not a breaking change as the `LoggerService` is a subset of the `Logger` interface.
