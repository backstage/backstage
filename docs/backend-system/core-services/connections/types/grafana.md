---
id: grafana
title: Grafana connections
description: Configure and consume authenticated Grafana instance APIs
---

Use the `grafana` connection type for authenticated API access to Grafana Cloud
stacks and self-hosted Grafana OSS or Enterprise servers. It supports
service-account tokens and self-hosted basic authentication.

## Configuring

### Configure a Grafana connection

Create a [service account](https://grafana.com/docs/grafana/latest/administration/service-accounts/)
in the Grafana organization your plugins need to access, grant it the permissions
they need, and create a token. Use that token with the instance address in your
connection configuration. For self-hosted Grafana, basic authentication is also
available when the server has it enabled.

These examples use dummy credentials. Replace them with
[environment variable references](../../../../conf/writing.md#environment-variable-substitution)
in your deployment.

```yaml title="app-config.yaml"
connections:
  - type: grafana
    baseUrl: https://example.grafana.net/
    auth:
      - method: token
        token: dummy-service-account-token

  - type: grafana
    baseUrl: https://monitoring.example.com:8443/grafana/
    apiBaseUrl: http://grafana.internal:3000/grafana/api/
    auth:
      - method: basic
        username: backstage-reader
        password: dummy-password
        orgId: 2
```

### Choose the instance and API addresses

| Field        | Type     | Required | Description                                                                         |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------- |
| `baseUrl`    | `string` | Yes      | Grafana instance root whose host identifies the connection during lookup.           |
| `apiBaseUrl` | `string` | No       | Separate API root, including the API prefix, when requests use a different address. |

Set `baseUrl` to the instance root in the resource URLs your plugins use, such as
dashboard links. Its parsed host, including a non-default port, identifies the
connection. There is no separate `host` field. See the shared
[host lookup rules](../01-concepts.md#lookup-strategies).

Set `apiBaseUrl` when the backend reaches the API through a different address.
For example, `https://monitoring.example.com:8443/grafana/` identifies the
instance, while `http://grafana.internal:3000/grafana/api/` reaches its API from
the backend. This override does not add another lookup identity. If it is omitted,
the returned connection has no `apiBaseUrl`; the consumer example below derives
an API root from `baseUrl`.

Include any installation subpath from Grafana's
[`root_url` configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/#root_url)
so requests reach the correct installation behind a reverse proxy. Keep dashboard
routes and API prefixes out of `baseUrl`. Include the API prefix in `apiBaseUrl`
so consumers can append routes such as `search` without repeating `api`.

Both URL fields require absolute HTTP or HTTPS addresses without credentials,
queries or fragments. They preserve installation paths and encoded characters,
and gain a trailing slash when one is missing. Use HTTPS over untrusted networks
to protect credentials sent with requests.

Each instance needs a different lookup host. Two installations under different
subpaths on the same host cannot have separate connections because lookup cannot
tell them apart. A URL's `orgId` query also cannot select another organization's
credentials. Use [plugin scoping](../01-concepts.md#plugin-scoping) when different
plugins need credentials for different organizations on the same instance.

### Choose authentication

Use bearer service-account tokens for Cloud and self-hosted instances, as
described in Grafana's
[HTTP API authentication guide](https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/authentication/).
Basic authentication works only with self-hosted instances. Every connection
needs credentials; `none` is not supported.

| Method  | Field      | Type     | Required | Description                                                                    |
| ------- | ---------- | -------- | -------- | ------------------------------------------------------------------------------ |
| `token` | `token`    | `string` | Yes      | Nonempty bearer service-account token, without `Bearer ` prefix or whitespace. |
| `basic` | `username` | `string` | Yes      | Nonempty user login, without colons or line breaks.                            |
| `basic` | `password` | `string` | Yes      | Nonempty user password.                                                        |
| `basic` | `orgId`    | `number` | No       | Positive integer organization ID for `X-Grafana-Org-Id`.                       |

A service-account token belongs to one organization and cannot switch between
organizations. The `token` method therefore has no `orgId` field. For basic
authentication, set `orgId` when requests should use a particular organization;
otherwise Grafana uses the user's active organization. The user must have access
to the organization you choose. The service does not detect Cloud deployments
from their hostname, so choose tokens for Grafana Cloud.

Older instance API keys use the same bearer header, but Grafana has replaced them
with service accounts. The Grafana Cloud management API and direct Mimir, Loki
or Tempo telemetry APIs need
[Cloud Access Policies](https://grafana.com/docs/grafana-cloud/learn-and-build/developer-resources/api-reference/cloud-api/)
instead. Those tokens do not authenticate Grafana instance API requests.
Configure embedded dashboards and browser sessions separately.

## Consuming

### Search Grafana dashboards

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
to receive `ConnectionsService` in your backend plugin. Get the Grafana resource
URL from your plugin or entity configuration and pass it to the lookup. The
`apiBaseUrl` host is not an additional lookup identity.

The shared [credential selection order](../01-concepts.md#what-happens-during-find)
applies. Request the methods your plugin implements; an unsupported selected
method fails lookup instead of trying a later credential. Handle
[lookup errors](../03-consuming-connections.md#handle-lookup-errors) before making
requests.

This example uses a service-account token to search dashboards. It uses the
configured API root when present, otherwise it appends `api/` to the instance
root. Choose routes for the Grafana API version your plugin supports; Grafana's
[HTTP API reference](https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/)
describes the available APIs.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

async function searchDashboards(
  connections: ConnectionsService,
  dashboardUrl: string,
) {
  const connection = await connections.find({
    type: 'grafana',
    query: { url: dashboardUrl },
    authMethods: ['token'],
  });

  // Both configured URL roots have a trailing slash, preserving context paths.
  const apiRoot = connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
  const url = new URL('search?type=dash-db', apiRoot);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${connection.auth.token}` },
    redirect: 'error',
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With `baseUrl: https://example.grafana.net/`, the request goes to
`https://example.grafana.net/api/search?type=dash-db`. With a token connection
using `apiBaseUrl: http://grafana.internal:3000/grafana/api/`, it goes to
`http://grafana.internal:3000/grafana/api/search?type=dash-db`.

The example sends `Authorization: Bearer <token>` for `token`. A plugin supporting
`basic` sends HTTP Basic `Authorization` with base64-encoded `username:password`.
Send `X-Grafana-Org-Id: <orgId>` on organization API requests when configured,
leaving it out for server-admin endpoints.

Check unsuccessful responses before reading the result, as the example does.
The service checks credential fields and their format; Grafana still checks token
validity, expiry and permissions. For basic authentication, also check that the
server has it enabled. Use the returned request destination and follow the shared
[backend credential handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend)
so credentials stay in the backend and go to the configured server. The example
rejects redirects to avoid sending them to another host.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
