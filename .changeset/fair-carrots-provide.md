---
'@backstage/plugin-scaffolder-backend': minor
---

- **BREAKING** - the `/v2/tasks` endpoint now takes `templateRef` instead of `templateName` in the POST body. This should be a valid stringified `entityRef`.
