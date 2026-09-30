---
'@backstage/cli-node': patch
---

Commands run through `runCli` now wait for `stdout` and `stderr` to be flushed before exiting, so large command output is no longer truncated on platforms where writes to `stdout` and `stderr` are asynchronous.
