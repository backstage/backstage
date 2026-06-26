---
'@backstage/plugin-auth-backend': patch
---

Fixed dynamic client registration authorization for desktop OAuth clients using loopback redirect URIs, allowing the callback port to differ from the registered redirect URI.
