---
id: argocd
title: Argo CD connections
description: Configure and consume Argo CD connections
---

Use the `argocd` connection type to configure an Argo CD deployment and its API
token. Multiple deployments need different hosts or ports.

## Configuring

### Configure access to a deployment

Supply the deployment address and an API token with permission to read the
applications your plugin needs. This example configures production and staging
with separate tokens. Replace the dummy values with environment substitutions
such as `${ARGOCD_PRODUCTION_TOKEN}` in a real deployment.

```yaml title="app-config.yaml"
connections:
  - type: argocd
    title: Production Argo CD
    host: argocd.example.com
    baseUrl: https://argocd.example.com/argo-cd/
    auth:
      - method: token
        token: dummy-production-api-token
  - type: argocd
    title: Staging Argo CD
    host: argocd-staging.example.com:8443
    baseUrl: https://argocd-staging.example.com:8443/
    auth:
      - method: token
        token: dummy-staging-api-token
```

### Deployment addresses

| Field     | Type     | Required | Description                                                                      |
| --------- | -------- | -------- | -------------------------------------------------------------------------------- |
| `host`    | `string` | Yes      | Deployment host, including a non-default port, matching the URL's parsed `host`. |
| `baseUrl` | `string` | Yes      | Absolute HTTP(S) deployment root, including any API server path prefix.          |

Set `baseUrl` to the deployment root before `/api/v1`. Include any path prefix
so requests reach the API under that path. For example,
`https://argocd.example.com/argo-cd/` produces the applications endpoint
`https://argocd.example.com/argo-cd/api/v1/applications`. Both fields are required;
the connection service does not supply a default address.

Use the API server root reachable by the backend. The
[Argo CD ingress documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#argo-cd-server-and-ui-root-path-v153)
explains how to configure root paths. The UI's `--basehref` setting only changes
the UI path, so it does not tell you where the API is served.

The parsed host and port of `baseUrl` must match `host`. A public host with a
different internal API host is rejected. Credentials, query parameters and
fragments are also rejected, including bare `?` and `#` delimiters.
Percent-encoded path characters such as `%3F` and `%23` are allowed.

Give each deployment a distinct host or port so lookup can select it. Duplicate
`argocd` hosts are rejected even when their `baseUrl` paths differ. Two
deployments under different paths on the same host and port cannot be configured
as separate connections.

### API tokens

| Method  | Field   | Type     | Required | Description                                       |
| ------- | ------- | -------- | -------- | ------------------------------------------------- |
| `token` | `token` | `string` | Yes      | Raw API token, without a header or cookie prefix. |

Supply a token issued to a local account with API access or an Argo CD project
role with the required permissions. Only `token` authentication is supported;
the service cannot log in with a username and password, complete SSO login, or
access Argo CD anonymously. Empty tokens, whitespace and the `argocd.token=`
cookie prefix are rejected.

Use [plugin scoping](../01-concepts.md#plugin-scoping) when a plugin needs its own
token. Follow the shared guidance for
[keeping credentials on the backend](../03-consuming-connections.md#keep-connection-data-on-the-backend).

## Consuming

### List applications

First [declare the `argocd` connection type and obtain the connections service](../03-consuming-connections.md#declare-and-resolve-the-connection).
Use [host-based lookup](../03-consuming-connections.md#look-up-a-host-based-connection)
to select a deployment. The URL's path and scheme do not affect selection, so
build requests from the returned `baseUrl` to use the configured deployment
prefix and scheme.

[Argo CD's API](https://argo-cd.readthedocs.io/en/stable/developer-guide/api-docs/#authorization)
expects the raw token in a Bearer header. Lookup returns the token unchanged;
it does not verify its signature, expiry or permissions. Handle expired or
revoked tokens in the plugin because the service does not refresh them. See the
shared [credential limitations](../01-concepts.md#limitations) and
[lookup error handling](../03-consuming-connections.md#handle-lookup-errors).

For this example, configure the deployment root with a trailing slash so the
relative request path keeps the deployment prefix. Connections accept URLs with
or without a trailing slash; this example assumes the slash is present.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function listArgoCdApplications(
  connections: ConnectionsService,
  deploymentUrl: string,
) {
  const connection = await connections.find({
    type: 'argocd',
    query: { url: deploymentUrl },
    authMethods: ['token'],
  });
  // The example base URL ends with / so new URL() preserves the context path.
  const url = new URL('api/v1/applications', connection.baseUrl);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configured base URL `https://argocd.example.com/argo-cd/`, the request
reaches `https://argocd.example.com/argo-cd/api/v1/applications`. The helper
returns the JSON response for a successful request and throws for an API error.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
