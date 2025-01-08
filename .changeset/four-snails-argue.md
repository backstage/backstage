---
'@backstage/integration': minor
---

Added support for federated credentials using managed identities in the Azure DevOps integration. Federated credentials are only available for Azure DevOps organizations that have been configured to use Entra ID for authentication.

```diff
integrations:
  azure:
    - host: dev.azure.com
      credentials:
+       - clientId: ${APP_REGISTRATION_CLIENT_ID}
+         managedIdentityClientId: system-assigned
+         tenantId: ${AZURE_TENANT_ID}
```

This also adds support for automatically using the system-assigned managed identity of an Azure resource by specifying `system-assigned` as the client ID of the managed identity.

```diff
integrations:
  azure:
    - host: dev.azure.com
      credentials:
-       - clientId: ${AZURE_CLIENT_ID}
+       - clientId: system-assigned
```
