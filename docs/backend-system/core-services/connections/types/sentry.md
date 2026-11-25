---
id: sentry
title: Sentry connections
description: Configure and consume Sentry connections
---

Use a `sentry` connection for authenticated Sentry API requests.

## Configuring

### Configure an API token

Create an internal integration or user token with `org:read` access for listing
organization projects. Follow Sentry's [token creation instructions](https://docs.sentry.io/api/auth/).
A Data Source Name (DSN) cannot authenticate these reads.

```yaml title="app-config.yaml"
connections:
  - type: sentry
    baseUrl: https://sentry.io/
    auth:
      - method: token
        token: ${SENTRY_TOKEN}
```

### Choose request addresses

Set `baseUrl` to your Sentry instance root, including any self-hosted
installation path. Without `apiBaseUrl`, the example appends `api/0/` to that root.
For a regional API or internal route, set `apiBaseUrl` explicitly, including
`api/0/`, for example `http://sentry.internal:8080/sentry/api/0/`.

Organization paths identify API resources, but cannot select different
credentials on the same host. Use [plugin-scoped tokens](../01-concepts.md#plugin-scoping)
when different plugins need separate organization access.

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### List an organization's projects

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `token` authentication. Pass `https://sentry.io/organizations/acme/`
and `acme` to this function. The example reads one response page; follow the
provider's pagination contract when you need the complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readSentryProjects(
  connections: ConnectionsService,
  instanceUrl: string,
  organization: string,
) {
  const connection = await connections.find({
    type: 'sentry',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/0/', connection.baseUrl);
  const url = new URL(
    `organizations/${encodeURIComponent(organization)}/projects/`,
    apiRoot,
  );
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: `Bearer ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configuration above and the example arguments, the request goes to
`https://sentry.io/api/0/organizations/acme/projects/`.
