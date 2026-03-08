---
'@backstage/frontend-app-api': patch
---

Extensions with an `enabled` predicate are now evaluated before app tree instantiation, so pages that do not meet their conditions are excluded from the router tree.

`prepareSpecializedApp().finalize()` is now async. Extensions whose `enabled` predicate references `permissions` are checked against the current user's allowed permissions (via a single batched call to `permissionApiRef`) before the app tree is instantiated.
