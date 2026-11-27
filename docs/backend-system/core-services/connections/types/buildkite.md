---
id: buildkite
title: Buildkite connections
description: Configure and consume Buildkite connections
---

Use a `buildkite` connection for authenticated Buildkite API requests.

## Configuring

### Configure an API access token

Create a static [API access token](https://buildkite.com/docs/apis/managing-api-tokens)
with access to the required organizations and the `read_builds` scope for this
example. Agent registration tokens and webhook tokens do not grant REST API access.

```yaml title="app-config.yaml"
connections:
  - type: buildkite
    baseUrl: https://api.buildkite.com/
    auth:
      - method: token
        token: ${BUILDKITE_TOKEN}
```

### Choose request addresses

Set `baseUrl` to the API origin `https://api.buildkite.com/`, rather than the
`buildkite.com` browser origin. The example appends `v2/` unless you set
`apiBaseUrl` to a gateway root such as
`http://buildkite.internal:8080/proxy/v2/`, including the version prefix.

Organization and pipeline paths identify resources, but cannot select separate
tokens on the same host. Use a token with the required organization access or
[plugin-scoped tokens](../01-concepts.md#plugin-scoping) for different plugins.

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### List a pipeline's builds

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `token` authentication. Pass the full API resource URL
`https://api.buildkite.com/v2/organizations/acme/pipelines/service/builds`,
`acme` and `service` to this function. The example reads one response page;
follow the provider's pagination contract when you need the complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readBuildkiteBuilds(
  connections: ConnectionsService,
  instanceUrl: string,
  organization: string,
  pipeline: string,
) {
  const connection = await connections.find({
    type: 'buildkite',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot = connection.apiBaseUrl ?? new URL('v2/', connection.baseUrl);
  const url = new URL(
    `organizations/${encodeURIComponent(
      organization,
    )}/pipelines/${encodeURIComponent(pipeline)}/builds`,
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
`https://api.buildkite.com/v2/organizations/acme/pipelines/service/builds`.
