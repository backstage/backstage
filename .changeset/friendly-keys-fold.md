---
'@backstage/backend-plugin-api': patch
'@backstage/backend-app-api': patch
---

Added an optional `accessRestrictions` to external access service tokens and service principals in general, such that you can limit their access to certain plugins or permissions.
