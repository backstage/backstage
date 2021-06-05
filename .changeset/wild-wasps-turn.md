---
'@backstage/plugin-proxy-backend': patch
---

Fixed proxy requests to the base URL of routes without a trailing slash redirecting to the `target` with the full path appended.
