---
'@backstage/plugin-auth-backend': patch
---

Fixed OIDC token being able to expire before backstage token.

This can cause issue with OIDC removing public keys from the `KeyStore`
needed by the backstage token issuer.
