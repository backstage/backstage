---
id: harness
title: Harness connections
description: Configure and consume Harness connections
---

The `harness` connection type represents a Harness host. It has
[multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure Harness

```yaml title="app-config.yaml"
connections:
  - type: harness
    host: app.harness.io
    auth:
      - method: token
        token: ${HARNESS_TOKEN}
        apiKey: ${HARNESS_API_KEY}
```

## Connection fields

| Field  | Type     | Required | Description                                               |
| ------ | -------- | -------- | --------------------------------------------------------- |
| `host` | `string` | Yes      | Harness host matched against the consumer's resource URL. |

## Authentication methods

Harness requires authentication and does not support the `none` method.

| Method  | Field    | Type     | Required | Description                   |
| ------- | -------- | -------- | -------- | ----------------------------- |
| `token` | `token`  | `string` | Yes      | Harness authentication token. |
| `token` | `apiKey` | `string` | No       | Additional Harness API key.   |

The optional `apiKey` is returned alongside the token for consumers that need
both values.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a Harness URL. The service selects the connection whose `host` matches the
parsed URL host exactly.

When more than one token entry is visible to the calling plugin, the first
visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply different credentials
to a specific plugin; otherwise, configuration order determines which entry is
selected.

## Consume a Harness connection

```ts
const connection = await connections.find({
  type: 'harness',
  query: { url: 'https://app.harness.io/ng/account/example' },
  authMethods: ['token'],
});

connection.auth.method; // 'token'
connection.auth.token; // string
connection.auth.apiKey; // string | undefined
```

Return to the [built-in connection type index](../built-in-connection-types.md).
