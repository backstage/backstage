---
'@backstage/plugin-notifications-backend': patch
---

Fix handling of `limit=0` in `getNotifications` query to return empty results instead of all notifications
