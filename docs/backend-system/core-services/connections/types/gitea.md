---
id: gitea
title: Gitea connections
description: Configure and consume Gitea connections
---

The `gitea` connection type represents a Gitea host. It has
[multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure Gitea

```yaml title="app-config.yaml"
connections:
  - type: gitea
    host: gitea.example.com
    baseUrl: https://gitea.example.com
    auth:
      - method: basic
        username: ${GITEA_USERNAME}
        password: ${GITEA_PASSWORD}
```

## Connection fields

| Field     | Required | Purpose                                                 |
| --------- | -------- | ------------------------------------------------------- |
| `host`    | Yes      | Gitea host matched against the consumer's resource URL. |
| `baseUrl` | No       | Base URL of the Gitea instance.                         |

## Authentication methods

| Method  | Required fields        | Optional fields |
| ------- | ---------------------- | --------------- |
| `none`  | None                   | None            |
| `basic` | `username`, `password` | None            |

Use `none` explicitly when the target permits unauthenticated access.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a Gitea URL. The service selects the connection whose `host` matches the
parsed URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected.

## Consume a Gitea connection

```ts
const connection = await connections.find({
  type: 'gitea',
  query: { url: 'https://gitea.example.com/acme/example' },
  authMethods: ['basic', 'none'],
});

connection.baseUrl; // string | undefined

if (connection.auth.method === 'basic') {
  connection.auth.username; // string
  connection.auth.password; // string
}
```

Return to the [built-in connection type index](../built-in-connection-types.md).
