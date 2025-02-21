---
'@backstage/backend-defaults': patch
---

The default logger implementation will now serialize object meta values to JSON in non-production logs, avoiding `[object Object]` in logs.
