---
id: sonarqube
title: SonarQube connections
description: Configure and consume SonarQube connections
---

Use a `sonarqube` connection to read SonarQube Server or Cloud APIs while keeping
browser links pointed at the instance address.

## Configuring

### Configure a SonarQube token

Create a token with access to the SonarQube data your plugin needs. Use the
[Server Web API](https://docs.sonarsource.com/sonarqube-server/extension-guide/web-api)
or [Cloud Web API](https://docs.sonarsource.com/sonarqube-cloud/appendices/web-api)
documentation for your deployment, then configure the token with its instance
address. The example uses an internal API address while keeping the public
SonarQube URL for dashboard links.

Use `token` with a nonempty token without whitespace. `authType` defaults to
`bearer`; set it to `basic` only when your endpoint requires the token as the
Basic authentication username with an empty password. Use `none` for anonymous
reads only when SonarQube permits them.

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

### Choose browser and API addresses

Set `baseUrl` to the instance root used in dashboard links, including an
installation path such as `https://quality.example.com/sonar/`. For Cloud, choose
`https://sonarcloud.io/` or `https://sonarqube.us/` for your region. Select the
organization in your requests; the connection does not infer it from the address.

Set `apiBaseUrl` when backend requests use a different address, including `/api/`
in that root. For example, `http://sonarqube.internal:9000/sonar/api/` reaches the
API while `baseUrl` remains the browser address. Without this override, the
consumer appends `api/` to `baseUrl`.

Both roots accept HTTP or HTTPS without credentials, queries or fragments.
Use HTTPS over untrusted networks. Installation paths and encoded characters
are preserved, and a trailing slash lets callers append API routes without
losing `/sonar/`.

Lookup matches the host and non-default port from `baseUrl`; the internal API
host cannot select the connection. Two installations on different paths of one
host cannot have separate connections. Use
[plugin scoping](../01-concepts.md#plugin-scoping) when plugins need different
tokens for an instance or Cloud organizations sharing a host.

## Consuming

### Read available metrics

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and pass the instance URL used in browser links to lookup. The example supports
`token` and `none`, chooses the matching authentication header, and sends API
requests through the internal address when configured.

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

With the configuration above, metrics come from
`http://sonarqube.internal:9000/sonar/api/metrics/search`. Keep API routes relative
so the backend request retains the configured installation path.

### Build dashboard links

Pass `connection.baseUrl` to build browser links independently of the API override:

```ts
export function sonarDashboardUrl(baseUrl: string, projectKey: string) {
  const dashboard = new URL('dashboard', baseUrl);
  dashboard.searchParams.set('id', projectKey);
  return dashboard;
}
```

This produces a dashboard link under `https://quality.example.com/sonar/`, while
API requests still use the internal address. SonarQube checks token validity and
permissions for those requests. The fetch example rejects redirects and checks
HTTP errors; follow the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend)
to keep tokens in your backend.
