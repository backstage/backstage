---
'@backstage/plugin-auth-backend': patch
---

Respect the `auth.backstageTokenExpiration` configuration when issuing OAuth access and ID tokens from the OIDC service, instead of hard-coding a 1-hour expiry.
