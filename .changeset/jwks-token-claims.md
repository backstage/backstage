---
'@backstage/backend-plugin-api': minor
'@backstage/backend-defaults': patch
---

Added optional `tokenClaims` field to `BackstageServicePrincipal`. When a request is authenticated via an external access method of type `jwks`, the verified JWT payload claims (e.g. `upn`, `name`, `oid`, `appid`) are now accessible on `credentials.principal.tokenClaims`. The claims are sourced from the verified JWT payload, so signature, issuer, expiry, and audience have already been validated before the claims are stored.
