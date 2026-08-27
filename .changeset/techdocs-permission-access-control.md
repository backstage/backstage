---
'@backstage/plugin-techdocs-common': minor
'@backstage/plugin-techdocs-backend': minor
---

Added `techdocs.entity.read` permission to control access to TechDocs documentation independently from catalog entity visibility. When `permission.enabled` is true, all TechDocs endpoints now authorize requests using this permission before serving content.

Also added a well-known `backstage.io/techdocs-visibility` annotation that entity owners can use to mark documentation as restricted. Documentation stays open by default, and a permission policy can read this annotation to restrict access to specific entities (for example, limiting them to owners) without affecting other documentation.

The TechDocs backend now registers this permission with the permission system, so it can be discovered and evaluated by permission tooling such as the RBAC plugin.
