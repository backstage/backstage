---
'@backstage/backend-defaults': patch
---

Added support for `backend.logger.redactAllowlist` configuration option, which allows specific secret values to pass through log redaction when they are known to be safe to log.
