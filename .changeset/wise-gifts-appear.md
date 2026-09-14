---
'@backstage/plugin-notifications-backend-module-email': patch
'@backstage/plugin-notifications-backend-module-slack': patch
'@backstage/plugin-notifications-node': patch
---

Added `resolveNotificationLink` utility function that resolves relative notification links to absolute URLs using a provided base URL. This can be used by notification processor modules to ensure links are absolute before forwarding them to external systems.
