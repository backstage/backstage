---
'@backstage/techdocs-common': patch
---

Provide optional `logger: Logger` and `logStream: Writable` arguments to the `GeneratorBase#run(...)` command.
They receive all log messages that are emitted during the generator run.
