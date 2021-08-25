---
'@backstage/plugin-auth-backend': patch
---

Fixed a bug where OAuth state parameters would be serialized as the string `'undefined'`.
