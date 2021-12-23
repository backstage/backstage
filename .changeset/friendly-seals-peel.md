---
'@backstage/backend-common': patch
---

Ensure temporary directories are cleaned up if an error is thrown in the `filter` callback of the `UrlReader.readTree` options.
