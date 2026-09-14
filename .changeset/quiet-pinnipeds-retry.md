---
'@backstage/plugin-auth-backend-module-pinniped-provider': patch
---

Prevented an unavailable Pinniped supervisor during provider startup from causing an unhandled promise rejection before the first authentication request.
