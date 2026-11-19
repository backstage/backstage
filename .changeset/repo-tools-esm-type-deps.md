---
'@backstage/repo-tools': patch
---

The type-deps check no longer reports ESM-only dependencies as missing: packages whose exports expose no `require` or `default` condition cannot be seen by `require.resolve`, so installed dependencies were reported as missing. The check now falls back to looking for the installed package's root directory before reporting a missing type dependency.
