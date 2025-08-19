---
'@backstage/plugin-notifications-backend': patch
'@backstage/plugin-notifications-common': minor
---

Add an optional generic object `metadata` field to `NotificationPayload`. Metadata can be used to store additional unstructured data for the notification and are available to use by processors.
