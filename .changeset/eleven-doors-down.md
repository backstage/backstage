---
'@backstage/plugin-mcp-actions-backend': patch
---

Proxy `/.well-known/oauth-authorization-server` to `/.well-known/openid-configuration` on `auth-backend` when `auth.experimental.enableDynamicClientRegistration` is enabled.
