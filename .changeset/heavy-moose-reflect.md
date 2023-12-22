---
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
---

Deprecated the `authModuleMicrosoftProvider` export. A default export is now available and should be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));`
