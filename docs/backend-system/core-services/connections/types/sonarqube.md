---
id: sonarqube
title: SonarQube connections
description: Configure and consume SonarQube connections
---

Use a `sonarqube` connection for SonarQube Server or Cloud, keeping the instance URL independent of backend API routing.

## Configuring

```yaml title="app-config.yaml"
connections:
  - type: sonarqube
    baseUrl: https://quality.example.com/sonar/
    apiBaseUrl: http://sonarqube.internal:9000/sonar/api/
    auth:
      - method: token
        token: ${SONARQUBE_TOKEN}
        authType: bearer
```

`baseUrl` is the canonical instance and dashboard root. Include the installation
context path. Optional `apiBaseUrl` is the backend API root, including `/api/`.
It may use another host. Omission leaves it unset; consumers derive `api/` from
`baseUrl`. Use `https://sonarcloud.io/` or `https://sonarqube.us/` explicitly for the
appropriate Cloud region; the connection does not infer regions or organizations.

The `token` method requires a nonempty token without whitespace. `authType`
defaults to `bearer`; set `basic` only for an endpoint requiring token-as-username
Basic compatibility. The `none` method permits explicit anonymous reads where
the server allows them. See the [Server Web API](https://docs.sonarsource.com/sonarqube-server/extension-guide/web-api)
and [Cloud Web API](https://docs.sonarsource.com/sonarqube-cloud/appendices/web-api).

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

export async function readSonarQubeMetrics(
  connections: ConnectionsService,
  instanceUrl: string,
) {
  const connection = await connections.find({
    type: 'sonarqube',
    query: { url: instanceUrl },
    authMethods: ['token', 'none'],
  });
  const headers: Record<string, string> = {};
  if (connection.auth.method === 'token') {
    headers.Authorization =
      connection.auth.authType === 'basic'
        ? `Basic ${Buffer.from(`${connection.auth.token}:`).toString('base64')}`
        : `Bearer ${connection.auth.token}`;
  }
  const apiRoot = connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
  const response = await fetch(new URL('metrics/search', apiRoot), {
    redirect: 'error',
    headers,
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

Pass `connection.baseUrl` to build browser links independently of the API override:

```ts
export function sonarDashboardUrl(baseUrl: string, projectKey: string) {
  const dashboard = new URL('dashboard', baseUrl);
  dashboard.searchParams.set('id', projectKey);
  return dashboard;
}
```

The examples keep credentials on the backend, reject redirects and check HTTP
errors before reading JSON. The provider checks permissions and token validity
when it receives a request. See the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
