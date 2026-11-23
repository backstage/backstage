---
'@backstage/backend-defaults': patch
---

The auth key store and the scheduler now find their database migrations when dependencies are not hoisted, so a backend installed with pnpm without hoisting or with its global virtual store starts again.
