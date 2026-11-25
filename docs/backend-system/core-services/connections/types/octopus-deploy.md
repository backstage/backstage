---
id: octopus-deploy
title: Octopus Deploy connections
description: Configure and consume Octopus Deploy connections
---

Use an `octopus-deploy` connection for authenticated Octopus Deploy API
requests.

## Configuring

### Configure an API key

Create an [API key](https://octopus.com/docs/api-and-integration/api/how-to-create-an-api-key)
for a user or service account with permission to view projects in the required
spaces. The key inherits or restricts that account's permissions; choosing a
space in a request does not grant access to it.

```yaml title="app-config.yaml"
connections:
  - type: octopus-deploy
    baseUrl: https://deploy.example.com/octopus/
    auth:
      - method: apiKey
        apiKey: ${OCTOPUS_DEPLOY_API_KEY}
```

### Choose request addresses

Set `baseUrl` to the Octopus Server or Cloud instance root, including an
installation path such as `octopus/`. The example appends `api/` unless you
set `apiBaseUrl` to another API root, such as
`http://octopus.internal:8080/octopus/api/`, without a space ID.

Space-scoped resources use `api/{spaceId}/...`; system resources such as
`api/spaces` do not. Pass a space ID explicitly instead of relying on the
server's default space. See the [Octopus API](https://octopus.com/docs/api).
A space path cannot select a different key on the same host; use
[plugin-scoped keys](../01-concepts.md#plugin-scoping) when different plugins
need separate space access.

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### List a space's projects

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `apiKey` authentication. Pass
`https://deploy.example.com/octopus/app#/Spaces-1` and `Spaces-1` to this
function. The example reads one response page; follow the provider's pagination
contract when you need the complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readOctopusProjects(
  connections: ConnectionsService,
  instanceUrl: string,
  spaceId: string,
) {
  const connection = await connections.find({
    type: 'octopus-deploy',
    query: { url: instanceUrl },
    authMethods: ['apiKey'],
  });
  const apiRoot = connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
  const url = new URL(`${encodeURIComponent(spaceId)}/projects`, apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { 'X-Octopus-ApiKey': connection.auth.apiKey },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configuration above and the example arguments, the request goes to
`https://deploy.example.com/octopus/api/Spaces-1/projects`.
