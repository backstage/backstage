---
'@backstage/plugin-kubernetes': patch
---

Fixed bug in CronJobsAccordions component that causes an error when cronjobs use a kubernetes alias, such as `@hourly` or `@daily` instead of standard cron syntax.
