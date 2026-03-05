---
'@backstage/plugin-notifications-backend-module-slack': minor
---

**BREAKING**: Notifications sent to non-user entities no longer send Slack DMs to resolved users, while notifications sent to explicit user entity recipients still send DMs.
