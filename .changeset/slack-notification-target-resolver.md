---
'@backstage/plugin-notifications-backend-module-slack': patch
---

Added a target resolver extension point (`notificationsSlackTargetResolverExtensionPoint`) that lets you override which Slack channel an entity-addressed notification is delivered to, for example to route notifications to different channels based on their topic. When no resolver is registered, or the resolver returns `undefined`, delivery falls back to the recipient entity's `slack.com/bot-notify` annotation exactly as before.
