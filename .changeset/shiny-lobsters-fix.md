---
'@backstage/plugin-azure-devops-backend': patch
---

`createRouter` now requires an additional reader: `UrlReader` argument

```diff
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return createRouter({
    logger: env.logger,
    config: env.config,
+   reader: env.reader,
  });
}
```

Remember to check if you have already provided these settings previously.

#### [Azure DevOps]

```yaml
# app-config.yaml
azureDevOps:
  host: dev.azure.com
  token: my-token
  organization: my-company
```

#### [Azure Integrations]

```yaml
# app-config.yaml
integrations:
  azure:
    - host: dev.azure.com
      token: ${AZURE_TOKEN}
```
