---
'@backstage/backend-common': minor
---

Added support for Azure AD authentication for PostgreSQL. To define Azure credentials add `tenantId`, `clientId`, `clientSecret` to `app-config.yaml` file.

```
backend:
  database:
    .....
    auth:
      azure:
        tenantId: 'your_tenantId'
        clientId: 'your_clientId'
        clientSecret: 'your_clientSecret'
```
