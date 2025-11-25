---
'@backstage/backend-defaults': patch
---

Fixed JWT signature verification failures when a freshly-published signing key (kid) was not present in the cached JWKS keystore, and fixed invalid limited-user token creation when `payload.uip` was missing.
