---
'@backstage/cli': patch
---

The `test` command now automatically adds `--passWithNoTests` to the Jest invocation. To revert this behavior, pass `--passWithNoTests=false` or `--no-passWithNoTests`.
