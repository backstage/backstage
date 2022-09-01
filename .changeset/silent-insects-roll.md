---
'@backstage/plugin-auth-node': patch
---

Deprecate the `getBearerTokenFromAuthorizationHeader` function. It can be replaced with `(await identity.getIdentity({ request })).token`.
