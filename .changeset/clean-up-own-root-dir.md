---
'@backstage/cli-common': patch
---

The `findOwnRootDir` utility now searches for the monorepo root by traversing up the directory tree looking for a `package.json` with `workspaces`, instead of assuming a fixed `../..` relative path. If no workspaces root is found during this traversal, `findOwnRootDir` now throws to enforce stricter validation of the repository layout.
