---
'@backstage/cli-module-format-prettier': patch
---

Added a new CLI module that provides the `package format` command, which formats the current package, or the given files and directories, with the Prettier version that the project root depends on. Pass `--check` to list the files that need formatting and fail if there are any, without changing them.
