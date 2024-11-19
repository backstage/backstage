---
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
---

Correctly detects if additionalScopes contains a non-microsoft scope and returns a limited array of just the addtionalScopes + 'offline_access' for refresh token generation
