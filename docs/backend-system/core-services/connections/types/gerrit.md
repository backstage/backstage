---
id: gerrit
title: Gerrit connections
description: Configure and consume Gerrit connections
---

The `gerrit` connection type represents a Gerrit code review host and its
Gitiles endpoint. It has [multiton cardinality](../concepts.md#cardinality) and
uses the `host` [lookup strategy](../concepts.md#lookup-strategies).

## Configure Gerrit

```yaml title="app-config.yaml"
connections:
  - type: gerrit
    host: gerrit.example.com
    baseUrl: https://gerrit.example.com
    gitilesBaseUrl: https://gerrit.example.com/plugins/gitiles
    auth:
      - method: basic
        username: ${GERRIT_USERNAME}
        password: ${GERRIT_PASSWORD}
```

## Connection fields

| Field            | Required | Purpose                                                  |
| ---------------- | -------- | -------------------------------------------------------- |
| `host`           | Yes      | Gerrit host matched against the consumer's resource URL. |
| `baseUrl`        | No       | Base URL of the Gerrit instance.                         |
| `gitilesBaseUrl` | Yes      | Base URL used to access repositories through Gitiles.    |
| `cloneUrl`       | No       | Alternative base URL used to clone repositories.         |

## Authentication methods

| Method  | Required fields        | Optional fields |
| ------- | ---------------------- | --------------- |
| `none`  | None                   | None            |
| `basic` | `username`, `password` | None            |

Use `none` explicitly when Gerrit and Gitiles permit unauthenticated access.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a Gerrit URL. The service selects the connection whose `host` matches the
parsed URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected.

## Consume a Gerrit connection

```ts
const connection = await connections.find({
  type: 'gerrit',
  query: { url: 'https://gerrit.example.com/c/acme/example/+/123' },
  authMethods: ['basic', 'none'],
});

connection.gitilesBaseUrl; // string
connection.cloneUrl; // string | undefined
```

Return to the [built-in connection type index](../built-in-connection-types.md).
