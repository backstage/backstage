---
'@backstage/plugin-scaffolder-backend': patch
---

This adds a configuration option to the scaffolder plugin router, so we can allow for multiple `TaskWorkers`. Currently with only one `TaskWorker` you are limited to scaffolding one thing at a time. Set the `taskWorkers?: number` option in your scaffolder router to get more than 1 `TaskWorker`
