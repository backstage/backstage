---
'@backstage/plugin-auth-backend': patch
---

Encode the OAuth state parameter using URL safe chars only, so that providers have an easier time forming the callback URL.
