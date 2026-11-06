---
'@backstage/plugin-auth-node': patch
---

Preserve replacement OAuth refresh tokens when profile processing fails after the provider has renewed the session. Failed requests still reject authentication, but a later request can recover without another interactive sign-in once profile processing succeeds.
