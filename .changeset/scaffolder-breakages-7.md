---
'@backstage/plugin-scaffolder-node': minor
---

**BREAKING CHANGES**

The soon to be removed `TaskWorker` and `CreateWorkerOptions` now take a `LoggerService` implementation as the `logger` option instead of the old `winston` logger interface. Technically this is marked as a breaking change, albeit only in rare circumstances.
