---
'@backstage/plugin-lighthouse-backend': minor
---

Fixed crashes faced with custom schedule configuration. The configuration schema has been update to leverage the TaskScheduleDefinition interface. It is highly recommended to move the `lighthouse.shedule` and `lighthouse.timeout` respectively to `lighthouse.schedule.frequency` and `lighthouse.schedule.timeout`.
