---
'@backstage/cli-node': patch
---

CLI modules can now set `isEnabled` on `package` commands, so that several modules can provide the same command and the right one is chosen for each package. A new `addRunTarget` registry method adds a target to the `repo run` command, which runs a `package` command for every package in the workspace, with support for `--since`, `--include-dependents`, `--watch`, `--concurrency`, `--verbose` and package selectors (positional arguments or `--package`), with options for the package command passed after `--`. It shows a live progress view in a terminal, hides package output unless `--verbose` is set, and stops cleanly on Ctrl+C.
