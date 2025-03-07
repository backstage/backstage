---
'@backstage/plugin-catalog-backend-module-gitlab': minor
---

Added new configuration option to disable polling which when enabled turns off the schedule and makes processing modified files more robust by performing a delta add mutation before triggering the catalog refresh.
