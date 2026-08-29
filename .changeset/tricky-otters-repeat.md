---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed the scaffolder task worker silently giving up after a transient failure. A single error while picking up a task, such as a dropped database connection, would stop the backend from running any further software templates for the rest of its lifetime. New tasks stayed queued indefinitely with no error shown to the user and no failing health check, and the only way to recover was to restart the backend. Picking up tasks is now retried instead.
