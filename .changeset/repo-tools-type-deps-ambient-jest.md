---
'@backstage/repo-tools': patch
---

The `type-deps` command now detects ambient global types from the `jest` namespace in declaration files, rather than only looking for explicit imports and reference directives.
