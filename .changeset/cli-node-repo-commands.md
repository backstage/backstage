---
'@backstage/cli-node': patch
---

CLI modules can now set `isEnabled` on `package` commands, so that several modules can provide the same command and the right one is chosen for each package. A new `addRepoCommand` registry method registers a `repo` command that runs a `package` command for every package in the workspace, with support for `--since`, `--include-dependents` and `--watch`.
