---
'@backstage/plugin-auth-backend-module-oidc-provider': patch
---

if oidc server do not provide revocation_endpoint，we should not call revoke function
