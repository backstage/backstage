---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: The `TokenFactory.issueToken` used by custom sign-in resolvers now ensures that the sub claim given is a full entity reference of the format `<kind>:<namespace>/<name>`. Any existing custom sign-in resolver functions that do not supply a full entity reference must be updated.
