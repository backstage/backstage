---
'@backstage/plugin-scaffolder-backend': patch
---

fix for the `gitlab:publish` action to use the `oauthToken` key when creating a
`Gitlab` client. This only happens if `ctx.input.token` is provided else the key `token` will be used.
