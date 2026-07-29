---
'@backstage/plugin-notifications-backend-module-slack': patch
---

Added support for routing notifications to a specific Slack channel via `payload.metadata.slackChannel`, with the existing entity annotation lookup as a fallback.
