---
'@backstage/backend-defaults': patch
---

Fixed the built-in rate limiter throwing a validation error and refusing to start when `backend.rateLimit` is enabled. Requests are now keyed using the address normalization helper from `express-rate-limit`, which is required by newer versions of that library and ensures IPv6 clients are grouped by their address block rather than by individual address.
