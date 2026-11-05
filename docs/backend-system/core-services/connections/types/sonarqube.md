---
id: sonarqube
title: SonarQube connections
description: Configure and consume SonarQube Server and SonarQube Cloud connections
---

The `sonarqube` connection type represents a SonarQube Server or SonarQube Cloud
instance. It has [multiton cardinality](../01-concepts.md#cardinality) and uses
the `host` [lookup strategy](../01-concepts.md#lookup-strategies).

## Configure SonarQube

This configuration uses dummy credentials. Replace them with secret environment
variable references such as `${SONARQUBE_TOKEN}` for a real instance.

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
lists the regional API endpoints. `baseUrl` is the instance root, including any
Server context path, without an `/api` suffix. API versions and endpoint paths
belong to the consumer; this type does not select or derive Cloud V2 endpoints.

## Connection fields

| Field             | Type     | Required | Description                                                                            |
| ----------------- | -------- | -------- | -------------------------------------------------------------------------------------- |
| `host`            | `string` | Yes      | Exact parsed URL host, including a non-default port. Must equal the host of `baseUrl`. |
| `baseUrl`         | `string` | Yes      | Backend HTTP or HTTPS instance URL, including the context path.                        |
| `externalBaseUrl` | `string` | No       | Browser URL used only for display links. Defaults to `baseUrl` in consumer code.       |

Base URLs must not contain embedded credentials, whitespace, query parameters,
or fragments, including empty `?` and `#` delimiters. Percent-encoded path
characters, context paths, and trailing slashes are preserved as configured.
`externalBaseUrl` may use a different host. It is neither a lookup alias nor an
alternate destination for credentials. Send authenticated requests only to the
configured backend `baseUrl`.

## Authentication methods

| Method  | Field      | Type                  | Required | Description                                                                                                               |
| ------- | ---------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `token` | `token`    | `string`              | Yes      | Nonempty token without whitespace. Use a Server user token or a Cloud token with permissions for the requested operation. |
| `token` | `authType` | `'bearer' \| 'basic'` | No       | Token transport, defaulting to `bearer`.                                                                                  |
| `none`  |            |                       |          | Explicit anonymous access; omit the Authorization header.                                                                 |

Both the [Server Web API](https://docs.sonarsource.com/sonarqube-server/extension-guide/web-api)
and Cloud Web API recommend `Authorization: Bearer <token>`. Server
[analysis tokens](https://docs.sonarsource.com/sonarqube-server/user-guide/managing-tokens)
are intended for running analyses; use a user token for general Web API operations.
The consumer constructs headers and handles rotation and HTTP errors. The
connection service returns static credentials and does not verify permissions
or contact SonarQube.

Set `authType: basic` explicitly for compatibility with consumers or Server
versions that use tokens as the Basic username with an empty password:
`Authorization: Basic <base64(token + ':')>`. This is token transport, not a
username/password method. Server token documentation supports Basic transport;
the existing community dashboard supports both transports, while the Scaffolder
action uses Basic. Bearer is the default for this connection type even though
those consumers default to Basic. Consumers must honor the configured transport;
they must not silently retry another transport after an authentication failure.

`none` supports operations such as Server `api/metrics/search` and
`api/components/search` when
[forced authentication is disabled](https://docs.sonarsource.com/sonarqube-server/instance-administration/security/user-accounts).
Cloud allows anonymous users to view analysis results for
[public projects](https://docs.sonarsource.com/sonarqube-cloud/administering-sonarcloud/about-sonarqube-cloud-solution/resources-structure/projects),
with restrictions on source downloads. Anonymous access is not a promise that
all endpoints work: private projects and administrative operations need suitable
credentials. A project-creation consumer should request only `token`.

Username/password login, monitoring-only `X-Sonar-Passcode`, interactive user
sign-in, and scanner configuration are outside this contract.

## Lookup and selection

Pass `query: { url }` using a URL whose parsed host equals `host`. Lookup compares
only the host, including a non-default port. Scheme, context path, project key,
and Cloud organization do not participate. For example,
`http://sonarqube.example.com:9000/other/dashboard` selects the `/sonar`
connection above. Two explicit connections with the same type and host are
rejected by configuration validation, even if their context paths differ.
Multiple deployments on the same host therefore require separate host names
or ports. This contract does not distinguish Cloud organizations on one host.

The service selects the first authentication entry visible to the calling
plugin, with [plugin-scoped entries](../01-concepts.md#plugin-scoping) ordered
before unscoped entries. The consumer's `authMethods` must accept that selected
method. There is no automatic token-to-anonymous fallback, project-based token
selection, or token permission check.

## Consume a SonarQube connection

After [declaring the dependency and requesting the service](../03-consuming-connections.md),
a backend consumer can use the inferred fields as follows:

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

Keep the connection and credentials on the backend. A frontend may receive the
constructed display link and appropriate result data, never the connection.

## Consumer adoption

The first concrete consumer is the community
[SonarQube dashboard backend](https://github.com/backstage/community-plugins/blob/main/workspaces/sonarqube/plugins/sonarqube-backend/src/service/sonarqubeInfoProvider.ts).
It reads named instances, backend and browser URLs, and tokens using its own
`sonarqube` configuration. Adoption requires a connection dependency,
transport-aware requests, and a mapping from its instance-name catalog
annotation to a host URL. Project keys remain catalog data.

The community
[SonarQube Scaffolder action](https://github.com/backstage/community-plugins/blob/main/workspaces/scaffolder-backend-module-sonarqube/plugins/scaffolder-backend-module-sonarqube/src/actions/createSonarQubeProject.ts)
is another consumer: it takes a base URL and token or username/password as
inputs and creates projects with Basic authentication. Adoption requires
resolving backend credentials from this service, honoring the transport,
keeping project parameters in action inputs, and handling any Cloud-specific
organization requirements in the action. Username/password input compatibility
needs a separate consumer decision.

These external plugins are not migrated by adding this type. Neither their
configuration nor action inputs are converted automatically, and the core
repository has no legacy `integrations.sonarqube` configuration to migrate.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
