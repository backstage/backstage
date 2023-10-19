---
'@backstage/plugin-auth-backend-module-microsoft-provider': minor
---

Added support for specifying a `domain_hint` on Microsoft authentication provider configuration.
This should typically be set to the same value as your `tenantId`.
If you allow users from multiple tenants to authenticate, then leave this blank.

```yaml
auth:
  providers:
    microsoft:
      development:
        #...
        domainHint: ${AZURE_TENANT_ID}
```
