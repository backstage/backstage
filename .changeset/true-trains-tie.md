---
'@backstage/plugin-notifications-backend-module-slack': patch
---

Notifications which mention user entity refs are now replaced with Slack compatible mentions.

Example: `Welcome <@user:default/billy>!` -> `Welcome <@U123456890>!`
