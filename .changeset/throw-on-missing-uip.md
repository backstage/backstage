---
'@backstage/backend-defaults': patch
---

Throw an error when `payload.uip` is missing in `createLimitedUserToken` instead of constructing an invalid limited token with an undefined signature.
