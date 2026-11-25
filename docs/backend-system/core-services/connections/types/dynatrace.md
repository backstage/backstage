---
id: dynatrace
title: Dynatrace connections
description: Configure and consume Dynatrace connections
---

Use a `dynatrace` connection for authenticated Dynatrace API requests.

## Configuring

### Configure an environment API token

Generate a [Classic access token](https://docs.dynatrace.com/docs/dynatrace-api/basics/dynatrace-api-authentication)
in the environment with `problems.read` scope for this example. This connection
supports environment API tokens using the `Api-Token` authentication scheme.
Platform tokens and OAuth client credentials are not supported.

```yaml title="app-config.yaml"
connections:
  - type: dynatrace
    baseUrl: https://abc12345.live.dynatrace.com/
    auth:
      - method: token
        token: ${DYNATRACE_TOKEN}
```

### Choose request addresses

Set `baseUrl` to your SaaS environment root. For Managed or ActiveGate, include
the environment path, for example
`https://monitoring.example.com/e/environment-id/`. The example appends
`api/v2/` unless you set `apiBaseUrl` to another environment API root, such as
`http://dynatrace.internal:8080/e/environment-id/api/v2/`.
Do not derive an environment API from a platform application URL.

Separate environment paths on one Managed or ActiveGate host cannot be
configured as separate connections. [Plugin-scoped tokens](../01-concepts.md#plugin-scoping)
can vary permissions for the configured environment, but do not change its URL.

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### Read environment problems

[Declare a connection
dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `token` authentication. Pass the environment URL to this function.
The example reads one response page; follow the provider's pagination contract
when you need the complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readDynatraceProblems(
  connections: ConnectionsService,
  instanceUrl: string,
) {
  const connection = await connections.find({
    type: 'dynatrace',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/v2/', connection.baseUrl);
  const url = new URL('problems', apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: `Api-Token ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configuration above, the request goes to
`https://abc12345.live.dynatrace.com/api/v2/problems`.
