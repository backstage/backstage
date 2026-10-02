---
'@backstage/connections': patch
---

Fixed the `Connection` type so that `auth` is a union of method variants instead of an array when no specific auth method is provided.
