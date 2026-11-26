---
'@backstage/plugin-scaffolder-backend': patch
---

Avoid repeatedly delivering the same completion event on a task event stream, while preserving completion replay on reconnect and live updates when recoverable tasks are retried.
