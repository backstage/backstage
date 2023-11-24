---
'@backstage/plugin-catalog': patch
---

- Fixes bug where after unregistering an entity you are redirected to `/`.
- Adds an optional external route `unregisterRedirect` to override this behaviour to another route.
