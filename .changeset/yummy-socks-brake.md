---
'@backstage/plugin-auth-backend': patch
---

Allow configuring dynamic client registration token expiration with config `auth.experimentalDynamicClientRegistration.tokenExpiration`.

Maximum expiration for the DCR token is 24 hours. Default expiration is 1 hour.
