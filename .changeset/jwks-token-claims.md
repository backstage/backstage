---
'@backstage/backend-plugin-api': minor
'@backstage/backend-defaults': patch
---

Added optional `tokenClaims` field to `BackstageServicePrincipal`. When a request is authenticated via an external access method of type `jwks`, the verified JWT payload claims (e.g. `upn`, `name`, `oid`, `appid`) are now accessible on `credentials.principal.tokenClaims`. Standard JWT validations (signature, issuer, audience) are applied by the token handler before claims are stored; `tokenClaims` is non-enumerable and will not appear in serialized output.
