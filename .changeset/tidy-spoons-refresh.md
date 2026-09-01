---
'@backstage/backend-defaults': patch
---

Improve authentication reliability during signing key rotation by performing budgeted JWKS reloads when a newly published key is requested during the remote key set cooldown.
