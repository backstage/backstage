---
'@backstage/plugin-notifications-backend': patch
---

Fixed sending a scoped broadcast notification that replaces an existing one, so the response now returns the ID of the stored notification instead of an ID that does not exist.
