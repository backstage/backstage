---
'@backstage/backend-defaults': patch
---

Improve authentication reliability during signing key rotation by refreshing JWKS endpoints for newly published keys even while remote key set refreshes are normally paused.
