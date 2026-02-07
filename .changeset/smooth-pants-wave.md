---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/core-plugin-api': patch
'@backstage/core-compat-api': patch
---

Plugins in the new frontend system now have a `pluginId` field rather than `id` to better align with naming conventions used throughout the frontend and backend systems. The old field is still present but marked as deprecated. All internal code has been updated to prefer `pluginId` while maintaining backward compatibility by falling back to `id` when needed.
