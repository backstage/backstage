---
id: azure
title: Azure DevOps connections
description: Configure and consume Azure DevOps connections
---

The `azure` connection type represents an Azure DevOps host. It has
[multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure Azure DevOps

```yaml title="app-config.yaml"
connections:
  - type: azure
    host: dev.azure.com
    auth:
      - method: pat
        personalAccessToken: ${AZURE_DEVOPS_TOKEN}
        orgs:
          - acme
```

## Connection fields

| Field  | Type     | Required | Description                                                    |
| ------ | -------- | -------- | -------------------------------------------------------------- |
| `host` | `string` | Yes      | Azure DevOps host matched against the consumer's resource URL. |

## Authentication methods

| Method              | Field                     | Type       | Required | Description                                                                 |
| ------------------- | ------------------------- | ---------- | -------- | --------------------------------------------------------------------------- |
| `none`              | None                      | —          | —        | Does not accept authentication fields.                                      |
| `pat`               | `personalAccessToken`     | `string`   | Yes      | Azure DevOps personal access token.                                         |
| `pat`               | `orgs`                    | `string[]` | No       | Azure DevOps organizations using the token.                                 |
| `clientCredentials` | `clientId`                | `string`   | Yes      | Microsoft Entra ID client ID.                                               |
| `clientCredentials` | `clientSecret`            | `string`   | Yes      | Microsoft Entra ID client secret.                                           |
| `clientCredentials` | `tenantId`                | `string`   | Yes      | Microsoft Entra ID tenant ID.                                               |
| `clientCredentials` | `orgs`                    | `string[]` | No       | Azure DevOps organizations using the credentials.                           |
| `managedIdentity`   | `clientId`                | `string`   | Yes      | Client ID of the managed identity or app registration to authenticate as.   |
| `managedIdentity`   | `tenantId`                | `string`   | No       | Microsoft Entra ID tenant ID used with a managed identity client assertion. |
| `managedIdentity`   | `managedIdentityClientId` | `string`   | No       | Client ID of the identity generating the assertion, or `system-assigned`.   |
| `managedIdentity`   | `orgs`                    | `string[]` | No       | Azure DevOps organizations using the identity.                              |

`orgs` is returned to consumers as static configuration. The connection
service does not use it when selecting an Azure authentication entry. A
credential provider can use it to select or constrain Azure DevOps
organizations.

Use `none` explicitly when the consumer can access the target without
authentication.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
an Azure DevOps URL. The service selects the connection whose `host` matches
the parsed URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply different credentials
to a specific plugin; otherwise, configuration order determines which entry is
selected.

## Consume an Azure DevOps connection

```ts
const connection = await connections.find({
  type: 'azure',
  query: { url: 'https://dev.azure.com/acme/project/_git/repository' },
  authMethods: ['pat', 'clientCredentials', 'managedIdentity', 'none'],
});

if (connection.auth.method === 'pat') {
  connection.auth.personalAccessToken; // string
  connection.auth.orgs; // string[] | undefined
}
```

Return to the [built-in connection type index](../built-in-connection-types.md).
