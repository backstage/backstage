---
'@backstage/backend-defaults': patch
---

JSON logs, used when `NODE_ENV` is `production`, now include a `timestamp` field on every log line. Request logs from the root HTTP router no longer include a `date` field or repeat the date at the start of the message, so log pipelines that read `date` from request logs should use `timestamp` instead.
