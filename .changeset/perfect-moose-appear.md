---
'@backstage/backend-tasks': patch
---

Add support for cron syntax to configure task frequency - `TaskScheduleDefinition.frequency` can now be both a `Duration` and an object on the form `{ cron: string }`, where the latter is expected to be on standard crontab format (e.g. `'0 */2 * * *'`).
