---
'@backstage/backend-defaults': minor
---

**BREAKING**: Request logs from the root HTTP router no longer include a `date` field, and no longer repeat the date at the start of the message. JSON logs, used when `NODE_ENV` is `production`, now include a `timestamp` field on every log line instead. Update any log pipelines or dashboards that read `date` or parse the date out of the message to use `timestamp`.

If you override the root logger with a custom JSON format, use `format.combine(format.timestamp(), format.json())` to keep the `timestamp` field.
