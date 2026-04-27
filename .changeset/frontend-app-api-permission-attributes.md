---
'@backstage/frontend-app-api': patch
---

The `if` predicate now resolves permission attributes and resource types from the permission backend's installed-permissions catalog, so attribute-aware policies evaluate predicates correctly. Falls back to the previous basic-permission shape when the catalog isn't available.
