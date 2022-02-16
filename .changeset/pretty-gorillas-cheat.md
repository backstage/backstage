---
'@backstage/plugin-scaffolder-backend': minor
---

**BREAKING**: `ctx.token` is now `ctx.secrets.backstageToken` in Actions. Please update any of your Actions that might call out to Backstage API's with this token.
