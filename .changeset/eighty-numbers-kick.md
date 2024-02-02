---
'@backstage/plugin-auth-backend-module-pinniped-provider': patch
---

Fixed a bug when refreshing the idToken, now when the audience query param is present on the refresh endpoint, it will be execute the rfc8693TokenExchange to get the a valid idToken for that specific audience
