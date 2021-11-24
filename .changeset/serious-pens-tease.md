---
'@backstage/plugin-scaffolder-backend': patch
---

Removed all usages of `path.resolve` in order to ensure that template paths are resolved in a safe way.
