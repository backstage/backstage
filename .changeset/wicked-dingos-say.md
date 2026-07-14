---
'@backstage/plugin-notifications-backend': patch
---

Fix an issue where `NotificationPayload.metadata` was not persisted by the notifications backend. Metadata is now stored and restored for both notifications and broadcasts.
