---
id: circleci
title: CircleCI connections
description: Configure and consume CircleCI connections
---

Use a `circleci` connection for authenticated CircleCI API requests.

## Configuring

### Configure a personal API token

Create a [personal API token](https://circleci.com/docs/guides/toolkit/managing-api-tokens/)
for a user with access to the required projects. Personal tokens work with API
v1.1 and v2 on Cloud and Server. Project API tokens support v1 only and are not
supported by this connection.

```yaml title="app-config.yaml"
connections:
  - type: circleci
    baseUrl: https://circleci.com/
    auth:
      - method: token
        token: ${CIRCLECI_TOKEN}
```

### Choose request addresses

Set `baseUrl` to `https://circleci.com/` for Cloud, or your Server installation
root, including any reverse proxy path. The example appends `api/` unless you
set `apiBaseUrl` to another API root, such as
`http://circleci.internal:8080/circleci/api/`. Leave the version to the request.

The example uses the v2 GitHub project slug `gh/organization/project`; use the
slug supported by your integration and Server version. Project paths cannot
select separate credentials on the same host; use [plugin scoping](../01-concepts.md#plugin-scoping)
when different plugins need different tokens.

The `Circle-Token` header works for v1.1 and v2; v3 requires Bearer
authentication instead. See the [API overview](https://circleci.com/docs/guides/toolkit/api-intro/).

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### List a project's pipelines

[Declare a connection
dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `token` authentication. Pass `https://circleci.com/gh/acme/service`,
`acme` and `service` to this function. The example reads one response page;
follow the provider's pagination contract when you need the complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readCircleCiPipelines(
  connections: ConnectionsService,
  instanceUrl: string,
  organization: string,
  project: string,
) {
  const connection = await connections.find({
    type: 'circleci',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot = connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
  const url = new URL(
    `v2/project/gh/${encodeURIComponent(organization)}/${encodeURIComponent(
      project,
    )}/pipeline`,
    apiRoot,
  );
  const response = await fetch(url, {
    redirect: 'error',
    headers: { 'Circle-Token': connection.auth.token },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configuration above and the example arguments, the request goes to
`https://circleci.com/api/v2/project/gh/acme/service/pipeline`.
