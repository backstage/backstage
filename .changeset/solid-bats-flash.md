---
'@backstage/plugin-notifications-backend-module-slack': patch
---

The Slack notification processor now uses the `MetricsService` to create metrics, providing plugin-scoped attribution. `{message}` unit has also been added.
