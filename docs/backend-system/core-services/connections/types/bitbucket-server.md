---
id: bitbucket-server
title: Bitbucket Server connections
description: Configure and consume Bitbucket Server connections
---

The `bitbucket-server` connection type represents a Bitbucket Server or
Bitbucket Data Center host. It has
[multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure Bitbucket Server

```yaml title="app-config.yaml"
connections:
  - type: bitbucket-server
    host: bitbucket.example.com
    apiBaseUrl: https://bitbucket.example.com/rest/api/1.0
    auth:
      - method: token
        token: ${BITBUCKET_SERVER_TOKEN}
```

## Connection fields

| Field        | Type     | Required | Description                                                 |
| ------------ | -------- | -------- | ----------------------------------------------------------- |
| `host`       | `string` | Yes      | Bitbucket host matched against the consumer's resource URL. |
| `apiBaseUrl` | `string` | No       | Base URL for Bitbucket's REST API.                          |

## Authentication methods

| Method  | Field      | Type     | Required | Description                            |
| ------- | ---------- | -------- | -------- | -------------------------------------- |
| `none`  | None       | —        | —        | Does not accept authentication fields. |
| `token` | `token`    | `string` | Yes      | Bitbucket access token.                |
| `basic` | `username` | `string` | Yes      | Username for basic authentication.     |
| `basic` | `password` | `string` | Yes      | Password for basic authentication.     |

Use `none` explicitly for unauthenticated access to public content.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a repository or content URL. The service selects the connection whose `host`
matches the parsed URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply different credentials
to a specific plugin; otherwise, configuration order determines which entry is
selected.

## Consume a Bitbucket Server connection

```ts
const connection = await connections.find({
  type: 'bitbucket-server',
  query: { url: 'https://bitbucket.example.com/projects/ACME/repos/example' },
  authMethods: ['token', 'basic', 'none'],
});

connection.apiBaseUrl; // string | undefined

if (connection.auth.method === 'token') {
  connection.auth.token; // string
}
```

Return to the [built-in connection type index](../built-in-connection-types.md).
