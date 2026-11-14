---
id: sonarqube
title: SonarQube connections
description: Configure and consume SonarQube Server and SonarQube Cloud connections
---

Use the `sonarqube` connection type for SonarQube Server and SonarQube Cloud.
You can configure [several instances](../01-concepts.md#cardinality), each
selected by its backend host.

## Configuring

### Configure SonarQube

Add the instances your plugins need to the backend configuration. The example
uses dummy tokens; supply real tokens through secret environment variables such
as `${SONARQUBE_TOKEN}`.

```yaml title="app-config.yaml"
connections:
  - type: sonarqube
    host: sonarqube.example.com:9000
    baseUrl: http://sonarqube.example.com:9000/sonar/
    externalBaseUrl: https://quality.example.com/sonar/
    auth:
      - method: token
        token: dummy-server-user-token
  - type: sonarqube
    host: sonarcloud.io
    baseUrl: https://sonarcloud.io/
    auth:
      - method: token
        token: dummy-cloud-token
  - type: sonarqube
    host: sonarqube.us
    baseUrl: https://sonarqube.us/
    auth:
      - method: token
        token: dummy-us-cloud-token
```

SonarQube Cloud uses `https://sonarcloud.io` in the EU region and
`https://sonarqube.us` in the US region. Choose the region that contains your
projects; see the [Cloud Web API documentation](https://docs.sonarsource.com/sonarqube-cloud/appendices/web-api)
for its API endpoints.

### Connection fields

| Field             | Type     | Required | Description                                                                            |
| ----------------- | -------- | -------- | -------------------------------------------------------------------------------------- |
| `host`            | `string` | Yes      | Exact parsed URL host, including a non-default port. Must equal the host of `baseUrl`. |
| `baseUrl`         | `string` | Yes      | Backend HTTP or HTTPS instance URL, including the context path.                        |
| `externalBaseUrl` | `string` | No       | Browser URL used only for display links. Use `baseUrl` when this is omitted.           |

Both `host` and `baseUrl` are required. Set `host` to the parsed backend URL
host, including a non-default port, and `baseUrl` to the instance root, including
any Server context path, without an `/api` suffix. The service returns this URL
as configured; it does not derive it from the host or add a trailing slash.

Give each instance a separate host name or port. Configuration rejects two
SonarQube connections with the same host, even if their context paths differ,
because lookup cannot tell them apart. It also cannot select between Cloud
organisations on the same host.

Set `externalBaseUrl` when users open SonarQube at a different address from the
backend. Plugins use it for display links, while API requests use `baseUrl`.
It does not provide another host for connection lookup or receive credentials.

Base URLs must not contain embedded credentials, whitespace, query parameters
or fragments. Even empty `?` and `#` delimiters change how relative API paths
are resolved, so they are rejected. Percent-encoded path characters, context
paths and trailing slashes are preserved as configured. URLs with or without a
trailing slash are accepted; the examples below need the trailing slashes shown
above to preserve the Server context path when joining relative paths.

### Choose authentication

| Method  | Field      | Type                  | Required | Description                                                                                                               |
| ------- | ---------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `token` | `token`    | `string`              | Yes      | Nonempty token without whitespace. Use a Server user token or a Cloud token with permissions for the requested operation. |
| `token` | `authType` | `'bearer' \| 'basic'` | No       | How to send the token. Defaults to `bearer`.                                                                              |
| `none`  |            |                       |          | Explicit anonymous access; omit the Authorization header.                                                                 |

For general Web API operations, create a Server user token or a Cloud token with
the permissions the plugin needs. Server
[analysis tokens](https://docs.sonarsource.com/sonarqube-server/user-guide/managing-tokens)
are intended for running analyses. Both the
[Server Web API](https://docs.sonarsource.com/sonarqube-server/extension-guide/web-api)
and Cloud Web API recommend Bearer authentication, which is the default here.
Set `authType: basic` explicitly if the plugin or Server version needs Basic
token authentication. Use [plugin scoping](../01-concepts.md#plugin-scoping) to
provide different credentials to different plugins.

Choose `none` only for reads the instance permits without authentication. Server
operations such as `api/metrics/search` and `api/components/search` allow this
when [forced authentication is disabled](https://docs.sonarsource.com/sonarqube-server/instance-administration/security/user-accounts).
Cloud allows anonymous users to view analysis results for
[public projects](https://docs.sonarsource.com/sonarqube-cloud/administering-sonarcloud/about-sonarqube-cloud-solution/resources-structure/projects),
with restrictions on source downloads. Private projects and administrative
operations need suitable credentials.

For authenticated requests, use a token. Username/password login and the
monitoring-only `X-Sonar-Passcode` are not supported. Configure interactive user
sign-in and scanners separately.

## Consuming

### Read metrics

After [declaring the dependency and requesting the service](../03-consuming-connections.md),
use the backend URL to find the connection and request metrics. Lookup uses the
[URL host and non-default port](../01-concepts.md#lookup-strategies).
For the Server configuration above, use a URL such as
`http://sonarqube.example.com:9000/sonar/`, whose host matches the backend,
instead of a URL on the browser host `quality.example.com`. The path does not
select an instance:
`http://sonarqube.example.com:9000/other/dashboard` still selects the configured
`/sonar/` instance. Project keys and Cloud organisations do not select
credentials either.

The example accepts tokens and anonymous reads. A plugin that creates projects
should request only `token`. Follow the shared
[authentication selection rules](../03-consuming-connections.md#handle-more-than-one-authentication-method):
listing a supported method does not make the service skip an earlier entry it
has already selected.

```ts
import type { ConnectionsService } from '@backstage/connections';

async function readMetrics(connections: ConnectionsService) {
  const connection = await connections.find({
    type: 'sonarqube',
    query: {
      url: 'http://sonarqube.example.com:9000/sonar/dashboard?id=example',
    },
    authMethods: ['token', 'none'],
  });

  // The example base URL ends with / so new URL() preserves the context path.
  const apiUrl = new URL('api/metrics/search', connection.baseUrl);
  const headers: Record<string, string> = {};
  if (connection.auth.method === 'token') {
    headers.Authorization =
      connection.auth.authType === 'basic'
        ? `Basic ${Buffer.from(`${connection.auth.token}:`).toString('base64')}`
        : `Bearer ${connection.auth.token}`;
  }
  const response = await fetch(apiUrl, { headers });
  if (!response.ok) {
    throw new Error(`SonarQube metrics request failed: ${response.status}`);
  }

  return response.json();
}
```

With the example configuration, the request goes to
`http://sonarqube.example.com:9000/sonar/api/metrics/search`. Basic authentication
sends the token as the username with an empty password; Bearer sends the token
directly. Honour the configured method rather than retrying another method
after a failure.

Lookup does not contact SonarQube or check token permissions. Handle HTTP errors
from the API, including authentication and permission failures. Your plugin also
handles token rotation and chooses the API version and endpoint; the connection
type does not choose Cloud V2 endpoints. Follow the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend)
when returning results to a frontend.

### Build a dashboard link

For a display link, request the connection without credentials and use its
browser URL, falling back to the backend URL when it is omitted:

```ts
const connection = await connections.find({
  type: 'sonarqube',
  query: { url: 'http://sonarqube.example.com:9000/sonar/' },
});

// The example base URL ends with / so new URL() preserves the context path.
const dashboardUrl = new URL(
  'dashboard',
  connection.externalBaseUrl ?? connection.baseUrl,
);
dashboardUrl.searchParams.set('id', 'example');
```

This produces `https://quality.example.com/sonar/dashboard?id=example`. Without
an external URL, it produces
`http://sonarqube.example.com:9000/sonar/dashboard?id=example`. The browser URL
supplies the link destination only; lookup still needs the backend host.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
