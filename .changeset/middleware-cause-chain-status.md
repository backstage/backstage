---
'@backstage/backend-defaults': patch
---

The error middleware now checks the cause chain when determining HTTP status codes, so wrapped errors with a known cause are no longer coerced to 500.
