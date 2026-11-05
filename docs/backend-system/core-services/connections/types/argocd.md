---
id: argocd
title: Argo CD connections
description: Configure and consume Argo CD connections
---

Use the `argocd` connection type to configure an Argo CD deployment and its API
token. You can configure multiple deployments with different hosts or ports.
The framework calls this [multiton cardinality](../01-concepts.md#cardinality)
with the `host` [lookup strategy](../01-concepts.md#lookup-strategies).

## Configure Argo CD

This example uses dummy tokens. Replace them with environment substitutions
such as `${ARGOCD_PRODUCTION_TOKEN}` in a real deployment.

```yaml title="app-config.yaml"
connections:
  - type: argocd
    title: Production Argo CD
    host: argocd.example.com
    baseUrl: https://argocd.example.com/argo-cd
    auth:
      - method: token
        token: dummy-production-api-token
  - type: argocd
    title: Staging Argo CD
    host: argocd-staging.example.com:8443
    baseUrl: https://argocd-staging.example.com:8443
    auth:
      - method: token
        token: dummy-staging-api-token
```

## Connection fields

| Field     | Type     | Required | Description                                                                      |
| --------- | -------- | -------- | -------------------------------------------------------------------------------- |
| `host`    | `string` | Yes      | Deployment host, including a non-default port, matching the URL's parsed `host`. |
| `baseUrl` | `string` | Yes      | Absolute HTTP(S) deployment root, including any API server path prefix.          |

Set `baseUrl` to the deployment root before `/api/v1`. For example,
`https://argocd.example.com/argo-cd` produces the applications endpoint
`https://argocd.example.com/argo-cd/api/v1/applications`. A trailing slash is
allowed and preserved. Keep the deployment prefix when joining paths so requests
reach the API under that prefix, and append `/api/v1` only once.

Use the API server root reachable by the backend. The
[Argo CD ingress documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#argo-cd-server-and-ui-root-path-v153)
explains how to configure root paths. The UI's `--basehref` setting only changes
the UI path, so it does not tell you where the API is served.

The parsed host of `baseUrl` must equal `host`. Credentials, query parameters,
and fragments in `baseUrl` are rejected, including bare `?` and `#` delimiters.
Percent-encoded path characters such as `%3F` and `%23` are allowed.

## Authentication methods

| Method  | Field   | Type     | Required | Description                                       |
| ------- | ------- | -------- | -------- | ------------------------------------------------- |
| `token` | `token` | `string` | Yes      | Raw API token, without a header or cookie prefix. |

[Argo CD's API documentation](https://argo-cd.readthedocs.io/en/stable/developer-guide/api-docs/#authorization)
specifies `Authorization: Bearer <token>`. Supply an API token issued to a local
account with API access or an Argo CD project role with the required permissions.
The schema rejects empty tokens, whitespace, and the `argocd.token=` cookie
prefix. It does not validate JWT signatures, expiry, or server permissions.

This type supports only `token` authentication. Supply an API token before using
the connection: the service cannot log in with a username and password, complete
SSO login, or access Argo CD anonymously. It returns the configured token
unchanged without contacting Argo CD, so a successful lookup does not confirm
that the token works. Consumers add the Bearer prefix and must handle expired
or revoked tokens; the service does not refresh them.

## Lookup and selection

Consumers pass `query: { url }`. Lookup matches the parsed host and port,
ignoring the scheme and path. Even a query with an unrelated path on the
configured host resolves the same connection. Build API requests from the
returned `baseUrl` so they use the configured scheme and deployment prefix.

Give each deployment a distinct host or port so lookup can select it. The
configuration rejects duplicate `argocd` hosts, even when their `baseUrl` paths
differ. You cannot configure two independently selectable deployments under
different paths on the same host and port.

The service selects the first authentication entry available to the calling
plugin. Use [plugin-scoped entries](../01-concepts.md#plugin-scoping) when a plugin
needs its own token: these take precedence over unrestricted entries. Otherwise,
configuration order decides.

## Consume an Argo CD connection

A backend plugin or module must first [declare the `argocd` connection type](../03-consuming-connections.md#declare-and-resolve-the-connection)
and obtain its connections service. The helper below uses the configured
deployment root to keep the path prefix when building an API request:

```ts
import type { Connection, ConnectionsService } from '@backstage/connections';

export async function listArgoCdApplications(
  connections: ConnectionsService,
  deploymentUrl: string,
): Promise<Response> {
  const connection: Connection<'argocd', 'token'> = await connections.find({
    type: 'argocd',
    query: { url: deploymentUrl },
    authMethods: ['token'],
  });
  const deploymentRoot = `${connection.baseUrl.replace(/\/+$/, '')}/`;
  const url = new URL('api/v1/applications', deploymentRoot);
  return fetch(url, {
    headers: { Authorization: `Bearer ${connection.auth.token}` },
  });
}
```

For both `https://argocd.example.com/argo-cd` and
`https://argocd.example.com/argo-cd/`, the resulting URL is
`https://argocd.example.com/argo-cd/api/v1/applications`. Handle API failures and
permissions in the consuming plugin.

## Existing plugin configuration

[`@backstage-community/plugin-argocd-backend`](https://github.com/backstage/community-plugins/blob/main/workspaces/argocd/plugins/argocd-backend/README.md)
uses per-instance tokens and deployment URLs through its shared
[`ArgoCDService`](https://github.com/backstage/community-plugins/blob/main/workspaces/argocd/plugins/argocd-node/src/ArgoCDService.ts).
Its
[request utilities](https://github.com/backstage/community-plugins/blob/main/workspaces/argocd/plugins/argocd-node/src/serviceUtils.ts)
append `/api/v1` and send raw tokens as Bearer authentication. The
[Roadie backend plugin](https://github.com/RoadieHQ/roadie-backstage-plugins/blob/main/plugins/backend/backstage-plugin-argo-cd-backend/README.md)
also configures named instances with per-instance tokens.

These plugins do not read this connection type yet, so configuring it does not
change how they connect to Argo CD. Keep their existing settings for application
discovery and entity-to-instance mapping, including instance names, application
selectors, and project settings. If a plugin logs in with a username and password
or an identity provider, it still needs to manage that login and any token
refresh itself. This connection type supplies an API token only.

There is no legacy Argo CD integration configuration in this repository to
convert. Keep external plugins' `argocd` settings until those plugins support
connections.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
