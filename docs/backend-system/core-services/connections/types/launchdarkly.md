---
id: launchdarkly
title: LaunchDarkly connections
description: Configure and consume LaunchDarkly connections
---

Use a `launchdarkly` connection for authenticated LaunchDarkly API requests.

## Configuring

### Configure a REST access token

Create a personal or service [REST access token](https://launchdarkly.com/docs/home/account/api)
with permission to read flags in the project. SDK evaluation keys, mobile keys
and client-side IDs cannot access the REST API.

```yaml title="app-config.yaml"
connections:
  - type: launchdarkly
    baseUrl: https://app.launchdarkly.com/
    auth:
      - method: token
        token: ${LAUNCHDARKLY_TOKEN}
```

### Choose request addresses

Set `baseUrl` to the application origin for your region:
`https://app.launchdarkly.com/`, `https://app.eu.launchdarkly.com/`, or
`https://app.launchdarkly.us/` for federal environments. See the
[REST API overview](https://launchdarkly.com/docs/api/overview).

The example appends `api/v2/` unless you set `apiBaseUrl` to another REST API
root, such as `http://launchdarkly.internal:8080/proxy/api/v2/`.
Send the raw token in `Authorization`, without a `Bearer` prefix.

Project paths cannot select separate credentials on the same regional host.
Use [plugin-scoped tokens](../01-concepts.md#plugin-scoping) when different
plugins need different project access.

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### List a project's flags

[Declare a connection
dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `token` authentication. Pass
`https://app.launchdarkly.com/projects/service/flags` and `service` to this
function. The example reads one response page; follow the provider's pagination
contract when you need the complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readLaunchDarklyFlags(
  connections: ConnectionsService,
  instanceUrl: string,
  project: string,
) {
  const connection = await connections.find({
    type: 'launchdarkly',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/v2/', connection.baseUrl);
  const url = new URL(`flags/${encodeURIComponent(project)}`, apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: connection.auth.token },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configuration above and the example arguments, the request goes to
`https://app.launchdarkly.com/api/v2/flags/service`.
