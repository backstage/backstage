---
'@backstage/plugin-notifications-backend': patch
---

added primary key constraint on tables `notifications.broadcast_user_status`, `notifications.user_settings` to address concerns with logical replication's default replica identity.
