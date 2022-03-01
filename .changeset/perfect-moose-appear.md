---
'@backstage/backend-tasks': patch
---

Add support for cron syntax to configure task frequency - `TaskScheduleDefinition.frequency` can now be both a `Duration` and a string, where the latter is expected to be on standard cron format (e.g. `'0 */2 * * *'`).
