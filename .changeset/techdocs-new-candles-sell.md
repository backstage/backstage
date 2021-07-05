---
'@backstage/techdocs-common': patch
---

Provide an optional `logStream: Writable` argument to the `GeneratorBase#run(...)` command.
The stream receives all log messages that are emitted during the generator run.
