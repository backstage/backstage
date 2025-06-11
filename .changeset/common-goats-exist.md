---
'@backstage/plugin-notifications-backend': patch
---

Notifications are now automatically deleted after 1 year by default.

There is a new scheduled task that runs every 24 hours to delete notifications older than 1 year.
This can be configured by setting the `notifications.retention` in the `app-config.yaml` file.

```yaml
notifications:
  retention: 1y
```

If the retention is set to false, notifications will not be automatically deleted.
