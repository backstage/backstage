---
'@backstage/plugin-auth-backend': minor
---

Added validation to TokenFactory.issueToken that ensure any sub claim given is a valid entityRef. This will affect any custom resolver functions given to auth providers.
