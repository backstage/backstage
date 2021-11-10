---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Tweak logic for msgraph catalog ingesting for display names with security groups

Previously security groups that weren't mail enabled were imported with UUIDs, now they use the display name.
