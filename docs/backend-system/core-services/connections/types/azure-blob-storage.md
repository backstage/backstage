---
id: azure-blob-storage
title: Azure Blob Storage connections
description: Configure and consume Azure Blob Storage connections
---

The `azure-blob-storage` connection type represents an Azure Blob Storage or
compatible endpoint. It has [multiton cardinality](../concepts.md#cardinality)
and uses the `host` [lookup strategy](../concepts.md#lookup-strategies).

## Configure Azure Blob Storage

```yaml title="app-config.yaml"
connections:
  - type: azure-blob-storage
    host: backstage.blob.core.windows.net
    accountName: backstage
    auth:
      - method: accountKey
        accountKey: ${AZURE_STORAGE_ACCOUNT_KEY}
```

## Connection fields

| Field            | Type     | Required | Description                                             |
| ---------------- | -------- | -------- | ------------------------------------------------------- |
| `host`           | `string` | Yes      | Storage host matched against the resource URL.          |
| `accountName`    | `string` | No       | Azure Storage account name.                             |
| `endpoint`       | `string` | No       | Custom Blob Storage endpoint.                           |
| `endpointSuffix` | `string` | No       | Custom endpoint suffix used by the storage environment. |

## Authentication methods

| Method             | Field              | Type     | Required | Description                            |
| ------------------ | ------------------ | -------- | -------- | -------------------------------------- |
| `none`             | None               | —        | —        | Does not accept authentication fields. |
| `accountKey`       | `accountKey`       | `string` | Yes      | Azure Storage account key.             |
| `sasToken`         | `sasToken`         | `string` | Yes      | Shared access signature token.         |
| `connectionString` | `connectionString` | `string` | Yes      | Azure Storage connection string.       |
| `aadCredential`    | `clientId`         | `string` | Yes      | Microsoft Entra ID client ID.          |
| `aadCredential`    | `tenantId`         | `string` | Yes      | Microsoft Entra ID tenant ID.          |
| `aadCredential`    | `clientSecret`     | `string` | Yes      | Microsoft Entra ID client secret.      |

The `aadCredential` method name is retained in configuration and represents
Microsoft Entra ID client credentials. The connection service returns the
static values and does not perform token exchange.

Use `none` explicitly for public containers or compatible endpoints that do
not require authentication.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a blob URL. The service selects the connection whose `host` matches the parsed
URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply different credentials
to a specific plugin; otherwise, configuration order determines which entry is
selected.

## Consume an Azure Blob Storage connection

```ts
const connection = await connections.find({
  type: 'azure-blob-storage',
  query: {
    url: 'https://backstage.blob.core.windows.net/catalog/entities.json',
  },
  authMethods: [
    'accountKey',
    'sasToken',
    'connectionString',
    'aadCredential',
    'none',
  ],
});

connection.accountName; // string | undefined
connection.auth.method; // selected authentication method
```

Return to the [built-in connection type index](../built-in-connection-types.md).
