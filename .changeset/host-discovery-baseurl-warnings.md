---
'@backstage/backend-defaults': patch
---

`HostDiscovery` now logs a warning when `backend.baseUrl` is set to a localhost address while `NODE_ENV` is `production`, and when `backend.baseUrl` is not a valid URL.
