---
'@backstage/repo-tools': patch
---

The OpenAPI schema commands now find their bundled templates and the OpenAPI generator when dependencies are not hoisted, for example when installed with pnpm without hoisting or with its global virtual store.
