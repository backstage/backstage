---
id: github
title: GitHub connections
description: Configure and consume GitHub connections
---

The `github` connection type represents a GitHub or GitHub Enterprise host. It
has [multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

GitHub provides type-specific
[authentication selection](../concepts.md#what-happens-during-find) so a single
host can use different GitHub Apps for different organizations.

## Configure GitHub

```yaml title="app-config.yaml"
connections:
  - type: github
    title: Public GitHub
    host: github.com
    apiBaseUrl: https://api.github.com
    rawBaseUrl: https://raw.githubusercontent.com
    auth:
      - method: app
        title: Backstage organization app
        appId: ${GITHUB_APP_ID}
        privateKey: ${GITHUB_APP_PRIVATE_KEY}
        clientId: ${GITHUB_APP_CLIENT_ID}
        clientSecret: ${GITHUB_APP_CLIENT_SECRET}
        orgs:
          - backstage
      - method: token
        title: Fallback token
        token: ${GITHUB_TOKEN}
```

Use lowercase organization names in `orgs`. The organization parsed from the
lookup URL is normalized to lowercase before matching.

## Connection fields

| Field        | Type     | Required | Description                                                                 |
| ------------ | -------- | -------- | --------------------------------------------------------------------------- |
| `host`       | `string` | Yes      | GitHub host matched against the consumer's resource URL.                    |
| `apiBaseUrl` | `string` | No       | Base URL for the GitHub API. Configure it explicitly for GitHub Enterprise. |
| `rawBaseUrl` | `string` | No       | Base URL used to retrieve raw repository content.                           |

## Authentication methods

| Method  | Field           | Type               | Required | Description                                                          |
| ------- | --------------- | ------------------ | -------- | -------------------------------------------------------------------- |
| `none`  | None            | —                  | —        | Does not accept authentication fields.                               |
| `token` | `token`         | `string`           | Yes      | GitHub access token.                                                 |
| `app`   | `appId`         | `string \| number` | Yes      | GitHub App ID.                                                       |
| `app`   | `privateKey`    | `string`           | Yes      | GitHub App private key.                                              |
| `app`   | `clientId`      | `string`           | Yes      | GitHub App client ID.                                                |
| `app`   | `clientSecret`  | `string`           | Yes      | GitHub App client secret.                                            |
| `app`   | `webhookSecret` | `string`           | No       | Secret used to verify webhook payloads.                              |
| `app`   | `publicAccess`  | `boolean`          | No       | Whether the app can provide read-only access to public repositories. |
| `app`   | `orgs`          | `string[]`         | No       | Lowercase organizations that use this app.                           |

The `app` method returns static GitHub App configuration. It does not return an
installation token. A GitHub credential provider must exchange the application
credentials for a token and cache it for its lifetime.

Use `none` explicitly when a consumer can access public GitHub content without
authentication.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a GitHub URL. The service selects the connection whose `host` matches the
parsed URL host exactly.

After [plugin scoping](../concepts.md#plugin-scoping), GitHub selects an
authentication entry in this order:

1. An app whose `orgs` contains the organization parsed from the URL.
1. An app without an `orgs` restriction.
1. The only visible app, when exactly one app remains.
1. A token.
1. The `none` method.

The selected method must appear in the consumer's `authMethods` list. The list
does not change GitHub's selection priority.

## Consume a GitHub connection

```ts
const connection = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/backstage/backstage' },
  authMethods: ['app', 'token', 'none'],
});

connection.host; // string
connection.apiBaseUrl; // string | undefined

if (connection.auth.method === 'app') {
  connection.auth.appId; // string | number
  connection.auth.privateKey; // string
}
```

## Selection examples

The service selects the host connection, applies
[plugin scoping](../concepts.md#plugin-scoping), and then applies GitHub's
authentication precedence to the remaining entries. The following examples
are independent configurations. Authentication entry titles are included to
make the selected entry easy to identify.

### Select an app by organization

Configure separate apps for organizations that require different GitHub App
installations, followed by the fallback methods:

```yaml title="app-config.yaml"
connections:
  - type: github
    host: github.com
    auth:
      - method: app
        title: Backstage organization app
        appId: ${GITHUB_BACKSTAGE_APP_ID}
        privateKey: ${GITHUB_BACKSTAGE_PRIVATE_KEY}
        clientId: ${GITHUB_BACKSTAGE_CLIENT_ID}
        clientSecret: ${GITHUB_BACKSTAGE_CLIENT_SECRET}
        orgs:
          - backstage
      - method: app
        title: Acme organization app
        appId: ${GITHUB_ACME_APP_ID}
        privateKey: ${GITHUB_ACME_PRIVATE_KEY}
        clientId: ${GITHUB_ACME_CLIENT_ID}
        clientSecret: ${GITHUB_ACME_CLIENT_SECRET}
        orgs:
          - acme
      - method: token
        title: Fallback token
        token: ${GITHUB_FALLBACK_TOKEN}
      - method: none
        title: Public access
```

The first URL path segment determines which organization-specific app is
selected:

```ts
const backstage = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/backstage/backstage' },
  authMethods: ['app', 'token', 'none'],
});

backstage.auth.method; // 'app'
backstage.auth.title; // 'Backstage organization app'

const acme = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/acme/service' },
  authMethods: ['app', 'token', 'none'],
});

acme.auth.method; // 'app'
acme.auth.title; // 'Acme organization app'

const other = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/example/service' },
  authMethods: ['app', 'token', 'none'],
});

other.auth.method; // 'token'
other.auth.title; // 'Fallback token'
```

For the final lookup, neither app matches `example`. Two apps remain visible,
so the single-app fallback does not apply. The token is selected before
`none`. If the token entry is removed, the same lookup selects `Public access`
using the `none` method.

### Prefer an unrestricted app over a token

An app without `orgs`, or with an empty `orgs` list, is unrestricted. It is
selected for any organization that does not have a more specific app:

```yaml title="app-config.yaml"
connections:
  - type: github
    host: github.com
    auth:
      - method: app
        title: Backstage organization app
        appId: ${GITHUB_BACKSTAGE_APP_ID}
        privateKey: ${GITHUB_BACKSTAGE_PRIVATE_KEY}
        clientId: ${GITHUB_BACKSTAGE_CLIENT_ID}
        clientSecret: ${GITHUB_BACKSTAGE_CLIENT_SECRET}
        orgs:
          - backstage
      - method: app
        title: Unrestricted app
        appId: ${GITHUB_DEFAULT_APP_ID}
        privateKey: ${GITHUB_DEFAULT_PRIVATE_KEY}
        clientId: ${GITHUB_DEFAULT_CLIENT_ID}
        clientSecret: ${GITHUB_DEFAULT_CLIENT_SECRET}
      - method: token
        title: Fallback token
        token: ${GITHUB_FALLBACK_TOKEN}
```

```ts
const connection = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/example/service' },
  authMethods: ['app', 'token'],
});

connection.auth.method; // 'app'
connection.auth.title; // 'Unrestricted app'
```

The unrestricted app wins before the token. For a `backstage` URL, the
organization-specific app still wins before the unrestricted app.

### Fall back to the only visible app

When exactly one app remains visible, that app is selected even when its
`orgs` list does not contain the URL organization:

```yaml title="app-config.yaml"
connections:
  - type: github
    host: github.com
    auth:
      - method: app
        title: Backstage organization app
        appId: ${GITHUB_BACKSTAGE_APP_ID}
        privateKey: ${GITHUB_BACKSTAGE_PRIVATE_KEY}
        clientId: ${GITHUB_BACKSTAGE_CLIENT_ID}
        clientSecret: ${GITHUB_BACKSTAGE_CLIENT_SECRET}
        orgs:
          - backstage
      - method: token
        title: Fallback token
        token: ${GITHUB_FALLBACK_TOKEN}
```

```ts
const connection = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/example/service' },
  authMethods: ['app', 'token'],
});

connection.auth.method; // 'app'
connection.auth.title; // 'Backstage organization app'
```

The sole-app fallback comes before the token fallback. An app's `orgs` list
therefore influences selection, but it is not a rule that prevents the app
from being returned for other organizations.

### Declare capabilities, not preferences

The order of `authMethods` does not override GitHub's selection precedence. It
declares which selected methods the consumer knows how to handle. With the
single-app configuration above, this lookup does not fall back to the token:

```ts
await connections.find({
  type: 'github',
  query: { url: 'https://github.com/example/service' },
  authMethods: ['token'],
});
// Throws because GitHub selected the app, but the consumer did not declare
// support for the 'app' method.
```

Listing `token` before `app` also leaves the result unchanged:

```ts
const connection = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/example/service' },
  authMethods: ['token', 'app'],
});

connection.auth.method; // 'app'
```

### Change the visible entries with plugin scoping

Plugin-specific authentication entries are visible only to matching plugins.
They are also placed before unrestricted entries before GitHub performs
selection:

```yaml title="app-config.yaml"
connections:
  - type: github
    host: github.com
    auth:
      - method: app
        title: Shared app
        appId: ${GITHUB_SHARED_APP_ID}
        privateKey: ${GITHUB_SHARED_PRIVATE_KEY}
        clientId: ${GITHUB_SHARED_CLIENT_ID}
        clientSecret: ${GITHUB_SHARED_CLIENT_SECRET}
      - method: app
        title: Catalog app
        match:
          plugins:
            - catalog
        appId: ${GITHUB_CATALOG_APP_ID}
        privateKey: ${GITHUB_CATALOG_PRIVATE_KEY}
        clientId: ${GITHUB_CATALOG_CLIENT_ID}
        clientSecret: ${GITHUB_CATALOG_CLIENT_SECRET}
```

For a connection service injected into the `catalog` plugin, both apps are
visible and the plugin-specific app is considered first:

```ts
const connection = await connections.find({
  type: 'github',
  query: { url: 'https://github.com/backstage/backstage' },
  authMethods: ['app'],
});

connection.auth.title; // 'Catalog app'
```

For any other plugin, `Catalog app` is removed before selection, so the same
lookup returns `Shared app`. When several visible entries satisfy the same
selection step, the first visible entry wins. Plugin-matched entries come
first; otherwise, configuration order breaks the tie.

See [Select a GitHub App by organization](../configuring-connections.md#select-a-github-app-by-organization)
for a plugin-scoped configuration example.

Return to the [built-in connection type index](../built-in-connection-types.md).
