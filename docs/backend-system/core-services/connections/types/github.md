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

| Field        | Required | Purpose                                                                     |
| ------------ | -------- | --------------------------------------------------------------------------- |
| `host`       | Yes      | GitHub host matched against the consumer's resource URL.                    |
| `apiBaseUrl` | No       | Base URL for the GitHub API. Configure it explicitly for GitHub Enterprise. |
| `rawBaseUrl` | No       | Base URL used to retrieve raw repository content.                           |

## Authentication methods

| Method  | Required fields                                   | Optional fields                         |
| ------- | ------------------------------------------------- | --------------------------------------- |
| `none`  | None                                              | None                                    |
| `token` | `token`                                           | None                                    |
| `app`   | `appId`, `privateKey`, `clientId`, `clientSecret` | `webhookSecret`, `publicAccess`, `orgs` |

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

See [Select a GitHub App by organization](../configuring-connections.md#select-a-github-app-by-organization)
for a plugin-scoped configuration example.

Return to the [built-in connection type index](../built-in-connection-types.md).
