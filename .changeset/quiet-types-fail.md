---
'@backstage/repo-tools': patch
---

The `type-deps` command now fails with a clear error when no packages with built type declarations are found, instead of silently passing. Make sure to build all packages before running it.
