---
id: gitlab
title: GitLab connections
description: Configure and consume GitLab connections
---

The `gitlab` connection type represents a GitLab or self-managed GitLab host.
It has [multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure GitLab

```yaml title="app-config.yaml"
connections:
  - type: gitlab
    host: gitlab.example.com
    baseUrl: https://gitlab.example.com
    apiBaseUrl: https://gitlab.example.com/api/v4
    auth:
      - method: token
        token: ${GITLAB_TOKEN}
```

## Connection fields

| Field        | Type     | Required | Description                                              |
| ------------ | -------- | -------- | -------------------------------------------------------- |
| `host`       | `string` | Yes      | GitLab host matched against the consumer's resource URL. |
| `apiBaseUrl` | `string` | No       | Base URL for the GitLab API.                             |
| `baseUrl`    | `string` | No       | Base URL of the GitLab instance.                         |

## Authentication methods

| Method  | Field   | Type     | Required | Description                            |
| ------- | ------- | -------- | -------- | -------------------------------------- |
| `none`  | None    | —        | —        | Does not accept authentication fields. |
| `token` | `token` | `string` | Yes      | GitLab access token.                   |

Use `none` explicitly when the consumer only needs public GitLab content.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a GitLab URL. The service selects the connection whose `host` matches the
parsed URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply a different token to a
specific plugin; otherwise, configuration order determines which entry is
selected.

## Consume a GitLab connection

```ts
const connection = await connections.find({
  type: 'gitlab',
  query: { url: 'https://gitlab.example.com/acme/example' },
  authMethods: ['token', 'none'],
});

connection.apiBaseUrl; // string | undefined

if (connection.auth.method === 'token') {
  connection.auth.token; // string
}
```

Return to the [built-in connection type index](../built-in-connection-types.md).
