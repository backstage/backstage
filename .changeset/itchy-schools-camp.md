---
'@backstage/backend-defaults': patch
---

Explicitly stringify extra logger fields with `JSON.stringify` to prevent `[object Object]` errors.
