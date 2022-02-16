---
'@backstage/plugin-scaffolder-backend': minor
---

**BREAKING**: `ctx.secrets.token` is now `ctx.secrets.backstageToken` in actions. Please update any of your actions that might call out to Backstage API's with this token.
