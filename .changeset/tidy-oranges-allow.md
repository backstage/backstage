---
'@backstage/plugin-scaffolder-backend': minor
---

Added experimental flag for scaffolder to wait for running tasks to complete on shutdown

Enabling the `EXPERIMENTAL_gracefulShutdown` flag in the scaffolder config will make the
scaffolder block the shutdown process until all running tasks have completed. This is useful
when there is a need to ensure that all tasks have completed before the scaffolder is shut down.

Please note, that the `TaskWorker` `stop` method is now asynchronous and awaited for the
tasks to complete when the experimental flag is enabled.
