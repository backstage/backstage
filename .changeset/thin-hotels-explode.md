---
'@backstage/errors': patch
---

Trim `error.cause.stack` in addition to `error.stack` when trimming stack traces from serialized errors.
