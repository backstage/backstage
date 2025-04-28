---
'@backstage/plugin-auth-backend': patch
---

The `static` key store now issues tokens with the same structure as other key stores. Tokens now include the `typ` field in the header and the `uip` (user identity proof) in the payload.
