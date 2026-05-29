---
'@backstage/plugin-techdocs-common': minor
'@backstage/plugin-techdocs-backend': minor
---

Added `techdocs.entity.read` permission to control access to TechDocs documentation independently from catalog entity visibility. When `permission.enabled` is true, all TechDocs endpoints now authorize requests using this permission before serving content.
