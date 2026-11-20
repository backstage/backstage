---
id: argocd
title: Argo CD connections
description: Configure and consume Argo CD connections
---

Use an `argocd` connection to read an Argo CD deployment's API with a token.

## Configuring

### Configure an Argo CD token

Create an API token for an Argo CD account with access to the applications your
plugin needs. Follow Argo CD's
[API authorization guide](https://argo-cd.readthedocs.io/en/stable/developer-guide/api-docs/#authorization),
then put the server address and token in your connection configuration.

Supply a nonempty token without whitespace, a `Bearer ` header prefix or an
`argocd.token=` cookie prefix. The `token` method sends it as a Bearer token;
it does not exchange a username and password for one. Every connection needs a
token; anonymous access is not supported.

```yaml title="app-config.yaml"
connections:
  - type: argocd
    baseUrl: https://argocd.example.com/argo-cd/
    auth:
      - method: token
        token: ${ARGOCD_TOKEN}
```

### Choose the server and API addresses

Set `baseUrl` to the Argo CD server root. Include the installation path, such as
`https://argocd.example.com/argo-cd/`, from your server's
[root-path configuration](https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#argo-cd-server-and-ui-root-path-v153).
Leave application routes and `api/v1/` out of this address.

Set `apiBaseUrl` when the backend reaches Argo CD through a different address.
Include `/api/v1/` in that API root. Otherwise, leave it out: the consumer below
appends `api/v1/` to `baseUrl` before requesting applications.

Both addresses accept HTTP or HTTPS without embedded credentials, queries or
fragments. Use HTTPS across untrusted networks. The connection preserves
installation paths and encoded characters and adds a trailing slash, so relative
API routes keep the `/argo-cd/` prefix.

Lookup matches the host and non-default port in `baseUrl`. An internal API
address does not become another lookup host, and two installations on different
paths of one host cannot have separate connections. Use
[plugin scoping](../01-concepts.md#plugin-scoping) when plugins need different
tokens for the same server.

## Consuming

### List applications

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
in your backend plugin. Pass the Argo CD deployment URL to lookup and request
`token` authentication. The example uses `apiBaseUrl` when configured, otherwise
it builds the API root from the server address.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readArgoCdApplications(
  connections: ConnectionsService,
  deploymentUrl: string,
) {
  const connection = await connections.find({
    type: 'argocd',
    query: { url: deploymentUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/v1/', connection.baseUrl);
  const response = await fetch(new URL('applications', apiRoot), {
    redirect: 'error',
    headers: { Authorization: `Bearer ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configured server address, the request goes to
`https://argocd.example.com/argo-cd/api/v1/applications`. Keep routes relative,
without a leading slash, to retain the installation path.

Argo CD checks the token's validity and application permissions. Keep the token
in your backend and send it only to the configured API address; the example
rejects redirects and checks unsuccessful responses. Follow the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
