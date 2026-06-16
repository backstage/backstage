---
'@backstage/frontend-app-api': patch
---

Extension `if` predicates now support inferring permission attributes from the permission name. When a permission name contains a `#` separator (e.g. `catalog.entity.read#read`), the part after `#` is used as the `action` attribute when evaluating the permission. This removes the need to configure attributes separately for basic permissions.
