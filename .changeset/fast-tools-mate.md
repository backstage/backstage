---
'@backstage/plugin-notifications-backend': patch
---

Show default settings for notifications even before receiving first notification.

Previously, it was not possible for the users to see or modify their notification settings until they had received at
least one notification from specific origin or topic.
This update ensures that default settings are displayed from the outset,
allowing users to customize their preferences immediately.
