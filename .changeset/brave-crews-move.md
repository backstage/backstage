---
'@backstage/backend-common': patch
---

Make backend.auth.keys optional in config schema. Previously backend.auth was optional but keys was not, which meant that if another plugin introduced additional properties under backend.auth, it would implicitly make backend.auth.keys mandatory.
