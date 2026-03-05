---
'@backstage/plugin-scaffolder-common': minor
---

**BREAKING PRODUCERS**: Made `retry`, `listTasks`, `listTemplatingExtensions`, `dryRun`, and `autocomplete` required methods on the `ScaffolderApi` interface. Implementations of `ScaffolderApi` must now provide these methods.
