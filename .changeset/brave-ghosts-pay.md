---
'@backstage/plugin-auth-backend-module-pinniped-provider': minor
---

**BREAKING** The `authModulePinnipedProvider` is now the default export and should be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-pinniped-provider'));`
