---
'@backstage/plugin-notifications-backend': patch
---

The notifications backend now emits a `notification-create` audit event when a service sends a notification, recording the sending service, recipient type, requested entity references, and counts.
