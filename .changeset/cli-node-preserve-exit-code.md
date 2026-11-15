---
'@backstage/cli-node': patch
---

Commands run through `runCli` now exit with the exit code they set, instead of always exiting with `0` on completion. For example, `catalog validate` and `template dry-run` now exit with a non-zero code when the input is invalid.
