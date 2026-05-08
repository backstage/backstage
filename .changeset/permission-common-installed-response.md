---
'@backstage/plugin-permission-common': patch
---

Added the `AuthorizeByNameRequest` / `AuthorizeByNameResponse` types describing the permission backend's name-based authorize endpoint, used by callers that have a permission name but not the full `Permission` shape.
