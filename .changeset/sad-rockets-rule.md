---
'@backstage/plugin-notifications-backend-module-slack': patch
---

When an error message is logged due to inability to send a message with the Slack SDK, include the Slack Channel ID in the message to aid debugging.
