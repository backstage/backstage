---
'@backstage/plugin-auth-backend-module-oidc-provider': patch
---

Added custom timeout setting for oidc provider

Here is an example of how to use a custom timeout with the configuration:

```yaml
auth:
  oidc:
    production:
      clientId: ${AUTH_GOOGLE_CLIENT_ID}
      clientSecret: ${AUTH_GOOGLE_CLIENT_SECRET}
      timeout:
        seconds: 30
```
