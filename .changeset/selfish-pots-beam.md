---
'@backstage/plugin-auth-backend-module-google-provider': patch
---

Fix google auth provider

Do not pass scopes when refreshing token, as this will limit scopes returned to only those provided
