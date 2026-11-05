---
id: sonarqube
title: SonarQube connections
description: Configure and consume SonarQube Server and SonarQube Cloud connections
---

Use the `sonarqube` connection type for SonarQube Server and SonarQube Cloud.
You can configure multiple instances
([multiton cardinality](../01-concepts.md#cardinality)), each selected by its
`host` [lookup strategy](../01-concepts.md#lookup-strategies).

## Configure SonarQube

The example uses dummy tokens. For a real instance, supply the token through a
secret environment variable such as `${SONARQUBE_TOKEN}`.

```yaml title="app-config.yaml"
connections:
  - type: sonarqube
    host: sonarqube.example.com:9000
    baseUrl: http://sonarqube.example.com:9000/sonar
    externalBaseUrl: https://quality.example.com/sonar
    auth:
      - method: token
        token: dummy-server-user-token
  - type: sonarqube
    host: sonarcloud.io
    baseUrl: https://sonarcloud.io
    auth:
      - method: token
        token: dummy-cloud-token
  - type: sonarqube
    host: sonarqube.us
    baseUrl: https://sonarqube.us
    auth:
      - method: token
        token: dummy-us-cloud-token
```

SonarQube Cloud uses `https://sonarcloud.io` in the EU region and
`https://sonarqube.us` in the US region. Its
[Web API documentation](https://docs.sonarsource.com/sonarqube-cloud/appendices/web-api)
lists the regional API endpoints. Set `baseUrl` to the instance root, including
any Server context path, without an `/api` suffix. The plugin adds the API path
to this URL. It also needs to choose the API version and endpoint; the connection
type does not choose Cloud V2 endpoints.

## Connection fields

| Field             | Type     | Required | Description                                                                            |
| ----------------- | -------- | -------- | -------------------------------------------------------------------------------------- |
| `host`            | `string` | Yes      | Exact parsed URL host, including a non-default port. Must equal the host of `baseUrl`. |
| `baseUrl`         | `string` | Yes      | Backend HTTP or HTTPS instance URL, including the context path.                        |
| `externalBaseUrl` | `string` | No       | Browser URL used only for display links. Use `baseUrl` when this is omitted.           |

Base URLs must not contain embedded credentials, whitespace, query parameters
or fragments. Even empty `?` and `#` delimiters change how relative API paths
are resolved, so they are rejected. Percent-encoded path characters, context
paths and trailing slashes are preserved as configured.

Set `externalBaseUrl` when users open SonarQube at a different address from the
backend. It supplies display links only: it does not select a connection or
receive credentials. Send authenticated requests only to the configured backend
`baseUrl`.

## Authentication methods

| Method  | Field      | Type                  | Required | Description                                                                                                               |
| ------- | ---------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `token` | `token`    | `string`              | Yes      | Nonempty token without whitespace. Use a Server user token or a Cloud token with permissions for the requested operation. |
| `token` | `authType` | `'bearer' \| 'basic'` | No       | How to send the token. Defaults to `bearer`.                                                                              |
| `none`  |            |                       |          | Explicit anonymous access; omit the Authorization header.                                                                 |

Both the [Server Web API](https://docs.sonarsource.com/sonarqube-server/extension-guide/web-api)
and Cloud Web API recommend `Authorization: Bearer <token>`. Server
[analysis tokens](https://docs.sonarsource.com/sonarqube-server/user-guide/managing-tokens)
are intended for running analyses. Use a user token for general Web API
operations so requests have the permissions of that user. The connection service
returns the configured credentials without contacting SonarQube or checking
permissions. Your plugin builds the request headers and handles token rotation
and HTTP errors.

Set `authType: basic` if the plugin or Server version needs Basic authentication.
Send the token as the username with an empty password:
`Authorization: Basic <base64(token + ':')>`. Server token documentation supports
this use of Basic authentication. The community dashboard supports both Bearer
and Basic, while the Scaffolder action uses Basic. Both default to Basic, so
check that the plugin honours this connection type's Bearer default. Use the
configured method and handle authentication errors without silently retrying
with another method.

`none` supports operations such as Server `api/metrics/search` and
`api/components/search` when
[forced authentication is disabled](https://docs.sonarsource.com/sonarqube-server/instance-administration/security/user-accounts).
Cloud allows anonymous users to view analysis results for
[public projects](https://docs.sonarsource.com/sonarqube-cloud/administering-sonarcloud/about-sonarqube-cloud-solution/resources-structure/projects),
with restrictions on source downloads. Private projects and administrative
operations need suitable credentials, so use anonymous access only for reads
that the instance permits. A plugin that creates projects should request only
`token`.

For authenticated requests, use a token. Username/password login and the
monitoring-only `X-Sonar-Passcode` are not supported. Configure interactive user
sign-in and scanners separately.

## Lookup and selection

Pass `query: { url }` with a URL whose parsed host equals `host`. Lookup uses
only the host and any non-default port, so the scheme, context path, project key
and Cloud organisation do not affect selection. For example,
`http://sonarqube.example.com:9000/other/dashboard` selects the `/sonar`
connection above.

Give each instance a separate host name or port. Configuration rejects two
SonarQube connections with the same host, even if their context paths differ,
because lookup cannot tell them apart. It also cannot select between Cloud
organisations on the same host.

To give a plugin its own credentials, use
[plugin-scoped entries](../01-concepts.md#plugin-scoping). The service places
these before entries without plugin scoping, then selects the first entry
visible to the plugin. Your plugin's `authMethods` must accept that selected
method; the service does not search later entries for a method the plugin
supports. It does not fall back from a token to anonymous access, choose tokens
by project or check token permissions.

## Consume a SonarQube connection

After [declaring the dependency and requesting the service](../03-consuming-connections.md),
a backend plugin can read metrics as follows. The example preserves the Server
context path when joining API and display URLs:

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

  // Relative paths plus a trailing slash preserve /sonar with either
  // baseUrl: .../sonar or baseUrl: .../sonar/.
  const apiUrl = new URL(
    'api/metrics/search',
    `${connection.baseUrl.replace(/\/$/, '')}/`,
  );
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

  // Display links use the browser URL and receive no credentials.
  const dashboardUrl = new URL(
    'dashboard',
    `${(connection.externalBaseUrl ?? connection.baseUrl).replace(/\/$/, '')}/`,
  );
  dashboardUrl.searchParams.set('id', 'example');
  return { metrics: await response.json(), dashboardUrl: dashboardUrl.href };
}
```

The connection contains credentials, so keep it on the backend. Return only the
display link and the result data the frontend needs.

## Existing plugin configuration

The community
[SonarQube dashboard backend](https://github.com/backstage/community-plugins/blob/main/workspaces/sonarqube/plugins/sonarqube-backend/src/service/sonarqubeInfoProvider.ts)
reads named instances, backend and browser URLs, and tokens from its own
`sonarqube` configuration. Its catalog annotation selects an instance by name
and supplies the project key. That instance name is separate from the host
lookup described above.

The community
[SonarQube Scaffolder action](https://github.com/backstage/community-plugins/blob/main/workspaces/scaffolder-backend-module-sonarqube/plugins/scaffolder-backend-module-sonarqube/src/actions/createSonarQubeProject.ts)
takes a base URL and token or username/password as inputs and sends Basic
authentication when creating a project. Project parameters are also action inputs.

Adding this connection type does not change either plugin's configuration or
action inputs. The core repository has no legacy `integrations.sonarqube`
configuration to convert.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
