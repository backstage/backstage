---
'@backstage/integration': minor
---

Added `AzureDevOpsCredentialsProvider` to support multiple Azure DevOps organizations and **deprecated** `AzureIntegrationConfig.credential` and `AzureIntegrationConfig.token` in favour of `AzureIntegrationConfig.credentials`. You can now use specific credentials for different Azure DevOps (Server) organizations by specifying the `organizations` field on a credential:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - organizations:
            - my-org
            - my-other-org
          clientId: ${AZURE_CLIENT_ID}
          clientSecret: ${AZURE_CLIENT_SECRET}
          tenantId: ${AZURE_TENANT_ID}
        - organizations:
            - yet-another-org
          personalAccessToken: ${PERSONAL_ACCESS_TOKEN}
```

See the [Azure integration documentation](https://backstage.io/docs/integrations/azure/locations) for more information.
