---
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': minor
---

**BREAKING**: The Cloudflare Access provider now requires the application audience in its configuration. Before upgrading, set `auth.providers.cfaccess.audience` to the Audience (AUD) tag shown for your Backstage application in Cloudflare Zero Trust.

```yaml
auth:
  providers:
    cfaccess:
      teamName: example
      audience: ${AUTH_CFACCESS_AUDIENCE}
```
