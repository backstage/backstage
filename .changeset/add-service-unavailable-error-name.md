---
'@backstage/errors': patch
---

Added explicit `name` property to `ServiceUnavailableError` for consistency with all other error classes, making it resilient to minification.
