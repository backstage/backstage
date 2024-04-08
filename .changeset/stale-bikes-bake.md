---
'@backstage/plugin-auth-backend': patch
---

Initial implementation of the `/v1/userinfo` endpoint, which is now able to parse and return the `sub` and `ent` claims from a Backstage user token.
