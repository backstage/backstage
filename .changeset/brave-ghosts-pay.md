---
'@backstage/plugin-auth-backend-module-pinniped-provider': patch
---

Deprecated the `authModulePinnipedProvider` export. A default export is now available and should be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-pinniped-provider'));`
