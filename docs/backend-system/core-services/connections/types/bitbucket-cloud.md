---
id: bitbucket-cloud
title: Bitbucket Cloud connections
description: Configure and consume Bitbucket Cloud connections
---

The `bitbucket-cloud` connection type represents a Bitbucket Cloud host. It has
[multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure Bitbucket Cloud

```yaml title="app-config.yaml"
connections:
  - type: bitbucket-cloud
    host: bitbucket.org
    auth:
      - method: appPassword
        username: ${BITBUCKET_USERNAME}
        appPassword: ${BITBUCKET_APP_PASSWORD}
```

## Connection fields

| Field  | Type     | Required | Description                                                       |
| ------ | -------- | -------- | ----------------------------------------------------------------- |
| `host` | `string` | Yes      | Bitbucket Cloud host matched against the consumer's resource URL. |

## Authentication methods

| Method        | Field          | Type     | Required | Description                                          |
| ------------- | -------------- | -------- | -------- | ---------------------------------------------------- |
| `none`        | None           | —        | —        | Does not accept authentication fields.               |
| `token`       | `username`     | `string` | Yes      | Bitbucket username associated with the token.        |
| `token`       | `token`        | `string` | Yes      | Bitbucket access token.                              |
| `appPassword` | `username`     | `string` | Yes      | Bitbucket username associated with the app password. |
| `appPassword` | `appPassword`  | `string` | Yes      | Bitbucket app password.                              |
| `oauth`       | `clientId`     | `string` | Yes      | OAuth client ID.                                     |
| `oauth`       | `clientSecret` | `string` | Yes      | OAuth client secret.                                 |

The `oauth` method returns static client credentials. A credential provider is
responsible for exchanging them for a usable access token.

Use `none` explicitly when the consumer only needs public Bitbucket content.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a Bitbucket URL. The service selects the connection whose `host` matches the
parsed URL host exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply different credentials
to a specific plugin; otherwise, configuration order determines which entry is
selected. The selected method must appear in the consumer's `authMethods` list.

## Consume a Bitbucket Cloud connection

```ts
const connection = await connections.find({
  type: 'bitbucket-cloud',
  query: { url: 'https://bitbucket.org/acme/example' },
  authMethods: ['token', 'appPassword', 'oauth', 'none'],
});

if (connection.auth.method === 'appPassword') {
  connection.auth.username; // string
  connection.auth.appPassword; // string
}
```

Return to the [built-in connection type index](../built-in-connection-types.md).
