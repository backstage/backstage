---
'@backstage/plugin-auth-backend': minor
---

The auth0 integration is updated to use the `passport-auth0` library. The configuration under `auth.providers.auth0.\*` now supports an optional `audience` parameter; providing that allows you to connect to the correct API to get permissions, access tokens, and full profile information.

[What is an Audience](https://community.auth0.com/t/what-is-the-audience/71414)
