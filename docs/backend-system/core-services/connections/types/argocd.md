---
id: argocd
title: Argo CD connections
description: Configure and consume Argo CD connections
---

Use an `argocd` connection to access a deployment with a raw API token.

## Configuring

```yaml title="app-config.yaml"
connections:
  - type: argocd
    baseUrl: https://argocd.example.com/argo-cd/
    auth:
      - method: token
        token: ${ARGOCD_TOKEN}
```

Include the server's installation context path in `baseUrl`. Both HTTP and
HTTPS roots are accepted; use HTTPS when credentials cross an untrusted network.
Set optional `apiBaseUrl` to a separate API root, including `/api/v1/`, when the
backend uses an internal endpoint. Omission leaves the field unset; consumers
derive `api/v1/` from the instance root.

The `token` method requires a nonempty token without whitespace. Supply the raw
token, without a `Bearer ` header prefix or `argocd.token=` cookie prefix. No
username/password exchange or unauthenticated method is provided. See Argo CD's
[API authorization](https://argo-cd.readthedocs.io/en/stable/developer-guide/api-docs/#authorization)
and [root-path configuration](https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#argo-cd-server-and-ui-root-path-v153).

URL roots reject credentials, query and fragment delimiters, preserve context
paths and encoded characters, and receive a trailing slash. API overrides are
not filled automatically.

Lookup uses the host and non-default port from `baseUrl`, not the API override
or URL path. Two installations under the same host cannot have separate
connections. Use the shared [plugin-scoping rules](../01-concepts.md#plugin-scoping)
when plugins need different credentials for the same instance.

## Consuming

Declare the connection and resolve the service using the shared
[backend consumption guide](../03-consuming-connections.md#declare-and-resolve-the-connection).
Append relative paths without a leading slash so the configured context survives.

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

The examples keep credentials on the backend, reject redirects and check HTTP
errors before reading JSON. The provider checks permissions and token validity
when it receives a request. See the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
