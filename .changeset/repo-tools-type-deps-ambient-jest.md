---
'@backstage/repo-tools': patch
---

The `type-deps` command now follows relative imports and re-exports into declaration chunk files, and detects ambient global types such as the `jest` namespace.
