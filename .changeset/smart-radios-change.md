---
'@backstage/backend-common': patch
---

Fixed `SingleHostDiscovery` so that it properly handles single-string `backend.listen` configurations such as `:80`.
