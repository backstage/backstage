---
id: rollbar
title: Rollbar connections
description: Configure and consume Rollbar connections
---

Use a `rollbar` connection for authenticated Rollbar API requests.

## Configuring

### Configure an account access token

Create an [account access token](https://docs.rollbar.com/docs/access-tokens)
with `read` scope, using a service token or a personal token with access to the
required projects. Ingestion-only project tokens with `post_client_item` or
`post_server_item` scope cannot read account projects.

```yaml title="app-config.yaml"
connections:
  - type: rollbar
    baseUrl: https://api.rollbar.com/
    auth:
      - method: token
        token: ${ROLLBAR_TOKEN}
```

### Choose request addresses

Set `baseUrl` to the API origin `https://api.rollbar.com/`, rather than the
browser application origin. The example appends `api/1/` unless you set
`apiBaseUrl` to a gateway root such as
`http://rollbar.internal:8080/proxy/api/1/`.

The [list projects endpoint](https://docs.rollbar.com/reference/list-all-projects)
requires an account token. Project-specific endpoints may additionally require
a `project_id` request parameter; it cannot select credentials for another
account on the same host. Use [plugin-scoped tokens](../01-concepts.md#plugin-scoping)
when different plugins need separate account access.

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### List account projects

[Declare a connection
dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `token` authentication. Pass
`https://api.rollbar.com/api/1/projects` to this function. The example reads one
response page; follow the provider's pagination contract when you need the
complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readRollbarProjects(
  connections: ConnectionsService,
  instanceUrl: string,
) {
  const connection = await connections.find({
    type: 'rollbar',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/1/', connection.baseUrl);
  const url = new URL('projects', apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { 'X-Rollbar-Access-Token': connection.auth.token },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configuration above, the request goes to
`https://api.rollbar.com/api/1/projects`.
