---
'@backstage/plugin-auth-node': patch
---

Ensure `getIdentity` throws an `AuthenticationError` instead of a `NotAllowed` error when authentication fails
