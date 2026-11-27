---
'@backstage/integration': patch
---

Fixed `defaultScmResolveUrl` truncating root-relative paths incorrectly when the base URL contains percent-encoded characters such as `%20`.
