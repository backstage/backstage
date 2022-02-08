---
'@backstage/plugin-permission-node': minor
---

**BREAKING** `PermissionCriteria` now requires at least one condition in `anyOf` and `allOf` arrays. This addresses some ambiguous behavior outlined in #9280.
