---
'@backstage/backend-defaults': patch
---

Fixed a bug where scheduled tasks that were initially registered with a manual trigger and later re-registered with a duration or cron cadence would never be scheduled to run.
