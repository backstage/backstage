---
'@backstage/backend-defaults': patch
---

Throw an error if `payload.uip` is missing when creating a limited user token, and make JWKS refresh safe by adding a minimum interval between refreshes.
