# Azure Repo Picker

This field have `three` main behaviors:

- (Default) Static without `allowedOrganizations` and `allowedOwners` it's will display only `InputTexts`.
- (Default) Static with `allowedOrganizations` and `allowedOwners` it's will display `Selects` with predefined values.
- Dynamic, that will fetch `organizations` and `owners` from `Azure DevOps Api` and display `Selects`.

## Configuring this apiRef

### On `package.json`

```json
{
  "files": [
    ...
    "src/plugins/azure-devops-apiref/config.d.ts"
  ],
  "configSchema": "src/plugins/azure-devops-apiref/config.d.ts"
}
```

### On `app-config.yaml`

Configure api ref `defaultOrganization`

```yaml
app:
  ...
  azureDevOpsApiRef:
    defaultOrganization: default-organization-of-token
```

and configure Standard `proxy to azure devops` route

```yaml
proxy:
  ...
  '/azure-devops-apiref':
    target: "https://dev.azure.com"
    headers:
      Authorization: Basic ${PROXY_AZURE_DEVOPS_AUTH_HEADER_BASIC}
```

### Generating `PROXY_AZURE_DEVOPS_AUTH_HEADER_BASIC`

First generate an `AZURE_PAT`, follow this steps [Creating Azure Personal Access Token](https://learn.microsoft.com/pt-br/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate).

With you `PAT` follow this script:

```sh
echo -n ":$YOUR_AZURE_PAT" | base64 -w 0
```
