---
'@backstage/plugin-auth-backend-module-auth0-provider': patch
---

Added an optional `prompt` setting for Auth0 authorization requests. Set it to
`auto` to let Auth0 determine whether the user needs to be prompted. Existing
configurations continue to use `consent` by default.
