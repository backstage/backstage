---
id: google-gcs
title: Google Cloud Storage connections
description: Configure and consume Google Cloud Storage connections
---

The `google-gcs` connection type represents a Google Cloud Storage host. It has
[multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure Google Cloud Storage

```yaml title="app-config.yaml"
connections:
  - type: google-gcs
    host: storage.googleapis.com
    auth:
      - method: serviceAccount
        clientEmail: ${GCS_CLIENT_EMAIL}
        privateKey: ${GCS_PRIVATE_KEY}
```

## Connection fields

| Field  | Type     | Required | Description                                               |
| ------ | -------- | -------- | --------------------------------------------------------- |
| `host` | `string` | Yes      | Storage host matched against the consumer's resource URL. |

## Authentication methods

| Method           | Field         | Type     | Required | Description                            |
| ---------------- | ------------- | -------- | -------- | -------------------------------------- |
| `none`           | None          | —        | —        | Does not accept authentication fields. |
| `serviceAccount` | `clientEmail` | `string` | Yes      | Google service-account client email.   |
| `serviceAccount` | `privateKey`  | `string` | Yes      | Google service-account private key.    |

The service returns static service-account configuration. A Google Cloud
credential provider is responsible for constructing or refreshing usable
credentials.

Use `none` explicitly for publicly readable objects.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a Google Cloud Storage URL. The service selects the connection whose `host`
matches the parsed URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply different credentials
to a specific plugin; otherwise, configuration order determines which entry is
selected.

## Consume a Google Cloud Storage connection

```ts
const connection = await connections.find({
  type: 'google-gcs',
  query: { url: 'https://storage.googleapis.com/acme/catalog-info.yaml' },
  authMethods: ['serviceAccount', 'none'],
});

if (connection.auth.method === 'serviceAccount') {
  connection.auth.clientEmail; // string
  connection.auth.privateKey; // string
}
```

Return to the [built-in connection type index](../built-in-connection-types.md).
