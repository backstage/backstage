---
'@backstage/eslint-plugin': patch
---

The `no-mixed-plugin-imports` rule now also applies when the repository is checked out below a directory whose name starts with a dot, such as `~/.worktrees/my-repo`. Before, it silently reported nothing in such locations, because `includedFiles` was matched only against the absolute file path. Patterns are now matched against the path relative to the package directory as well.
