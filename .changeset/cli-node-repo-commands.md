---
'@backstage/cli-node': patch
---

A new `addRunTarget` registry method lets CLI modules add a target to the `repo run` command, which runs a `package` command for every package in the workspace, with support for `--since`, `--include-dependents`, `--watch`, `--concurrency`, `--verbose` and package selectors (positional arguments or `--package`). Arguments are not passed on to the package command. With `--success-cache`, packages that passed before and have not changed since are skipped. It shows a live progress view in a terminal, hides package output unless `--verbose` is set, and stops cleanly on Ctrl+C.
