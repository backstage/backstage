---
'@backstage/core-components': patch
'@backstage/plugin-auth-backend': patch
---

Update OAuthAdapter to create identity.token from identity.idToken if it does not exist, and prevent overwrites to identity.toke. Update login page commonProvider to prefer .token over .idToken
