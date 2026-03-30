---
'@backstage/backend-plugin-api': minor
'@backstage/backend-defaults': patch
---

Added optional `tokenData` field to `BackstageServicePrincipal`. External token handlers can now forward arbitrary data to the resulting service principal via `tokenData`. The built-in `jwks` handler populates this with the verified JWT payload claims (e.g. `upn`, `name`, `oid`, `appid`), accessible on `credentials.principal.tokenData`. Standard JWT validations (signature, issuer, audience) are applied by the token handler before data is stored; `tokenData` is non-enumerable and will not appear in serialized output.
