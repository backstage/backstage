---
id: argocd
title: Argo CD connections
description: Configure and consume Argo CD connections
---

The `argocd` connection type represents an Argo CD deployment. It has
[multiton cardinality](../01-concepts.md#cardinality) and uses the `host`
[lookup strategy](../01-concepts.md#lookup-strategies).

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

`baseUrl` is the deployment root **before** `/api/v1`, not the API root or an
application page. For example, `https://argocd.example.com/argo-cd` produces the
applications endpoint `https://argocd.example.com/argo-cd/api/v1/applications`.
A trailing slash is allowed and preserved. Consumers must join paths without
dropping the deployment prefix or duplicating `/api/v1`.

The [Argo CD ingress documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#argo-cd-server-and-ui-root-path-v153)
describes API server root paths. Use the root reachable by the backend; a UI-only
`--basehref` setting does not itself change the API root.

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

This type supports only `token`. Username/password session exchange, SSO login,
token refresh, and anonymous access are outside this contract. The connections
service returns the configured token unchanged and makes no network requests.
Consumers add the Bearer prefix themselves and manage expired or revoked tokens.

## Lookup and selection

Consumers pass `query: { url }`. Lookup matches only the parsed host and port;
it does not match the scheme or path. Even a query with an unrelated path on
the configured host resolves the same connection. Always build API requests
from the returned `baseUrl`, rather than the lookup URL.

Multiple deployments require distinct hosts or ports. The configuration pipeline
rejects duplicate `argocd` hosts, including entries with different `baseUrl`
paths. Independently selecting two deployments under different paths on the
same host would require a future lookup strategy change.

The first authentication entry visible to the calling plugin is selected.
[Plugin-scoped entries](../01-concepts.md#plugin-scoping) take precedence over
unrestricted entries; otherwise configuration order decides.

## Consume an Argo CD connection

A backend plugin or module must first [declare the `argocd` connection type](../03-consuming-connections.md#declare-and-resolve-the-connection)
and obtain the plugin-scoped connections service. This helper uses the public
types and constructs the request from the configured deployment root:

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

## Consumer adoption

The first concrete adoption target is
[`@backstage-community/plugin-argocd-backend`](https://github.com/backstage/community-plugins/blob/main/workspaces/argocd/plugins/argocd-backend/README.md),
whose shared
[`ArgoCDService`](https://github.com/backstage/community-plugins/blob/main/workspaces/argocd/plugins/argocd-node/src/ArgoCDService.ts)
already uses per-instance tokens and deployment URLs. Its
[request utilities](https://github.com/backstage/community-plugins/blob/main/workspaces/argocd/plugins/argocd-node/src/serviceUtils.ts)
append `/api/v1` and send raw tokens as Bearer authentication. The
[Roadie backend plugin](https://github.com/RoadieHQ/roadie-backstage-plugins/blob/main/plugins/backend/backstage-plugin-argo-cd-backend/README.md)
also configures named instances with per-instance tokens.

These plugins do not consume this connection type yet. Adoption must retain
application discovery and entity-to-instance mapping, translate an instance URL
into a connection lookup, and declare the connection dependency. Instance names,
application selectors, and project settings remain plugin concerns. Existing
username/password login and identity-provider flows need separate credential
lifecycle handling; they cannot be represented by this token-only contract.
Same-host deployments under different paths remain an adoption gap.

There is no legacy Argo CD integration configuration in this repository to
convert. Adding this type does not replace external plugins' `argocd` settings.
External consumer migrations are follow-up work.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
