---
id: grafana
title: Grafana connections
description: Configure and consume authenticated Grafana instance APIs
---

Use the `grafana` connection type to give backend plugins API access to a Grafana
Cloud stack or a self-hosted Grafana OSS or Enterprise server. You can configure
[multiple instances](../01-concepts.md#cardinality), each identified by its `host`
when a plugin [looks up a connection](../01-concepts.md#lookup-strategies).

Use instance service-account tokens for Grafana API requests. The Grafana Cloud
management API and direct Mimir, Loki, or Tempo telemetry APIs need
[Cloud Access Policies](https://grafana.com/docs/grafana-cloud/learn-and-build/developer-resources/api-reference/cloud-api/)
instead. Tokens for those APIs do not authenticate requests to a Grafana instance.
Configure embedded dashboards and browser sessions separately.

## Configure Grafana

These examples use dummy credentials and can be loaded without environment variables.
Replace the credentials with
[environment variable references](../../../../conf/writing.md#environment-variable-substitution)
in your deployment.

```yaml title="app-config.yaml"
connections:
  - type: grafana
    host: example.grafana.net
    baseUrl: https://example.grafana.net/
    auth:
      - method: token
        token: dummy-service-account-token

  - type: grafana
    host: monitoring.example.com:8443
    baseUrl: http://grafana.internal:3000/grafana/
    auth:
      - method: basic
        username: backstage-reader
        password: dummy-password
        orgId: 2
```

## Connection fields

| Field     | Type     | Required | Description                                                                               |
| --------- | -------- | -------- | ----------------------------------------------------------------------------------------- |
| `host`    | `string` | Yes      | Lowercase host used for lookup, including a port when present in the parsed resource URL. |
| `baseUrl` | `string` | Yes      | Absolute HTTP or HTTPS Grafana instance root, including any reverse-proxy subpath.        |

Set `host` to the value returned by `new URL(resourceUrl).host` so it matches the
plugin's resource URL. This leaves out the scheme, path, credentials, query and
fragment, as well as default ports.

Set `baseUrl` without embedded credentials, a query or a fragment. Plugins append
API routes to this URL, so a query or fragment would put the route in the wrong
part of the URL. Both trailing-slash forms are accepted. Use HTTPS over an
untrusted network to protect the credentials sent with each request.

A plugin uses `host` to find the connection for a resource URL, such as an entity's
configured dashboard URL. Set `baseUrl` to an address the backend can reach; this
can use a different, internal host. For example, a plugin with a dashboard URL
under `https://monitoring.example.com:8443/grafana` looks up
`monitoring.example.com:8443`, then sends requests to
`http://grafana.internal:3000/grafana`. The plugin needs to get the resource URL
from its own configuration or an entity. The connection service does not discover
Grafana instances.

Use the instance root so plugins can append their API routes. A dashboard URL or
an `/api` endpoint already contains a route. Include any subpath from Grafana's
[`root_url` configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/#root_url)
so requests reach Grafana when it runs behind a reverse proxy. The plugin chooses
the API version and creates its own client.

## Authentication methods

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

Send `Authorization: Bearer <token>` for `token`, or HTTP Basic `Authorization`
with base64-encoded `username:password` for `basic`. With basic authentication,
send `X-Grafana-Org-Id: <orgId>` on organization API requests when it is configured,
so Grafana uses the intended organization. Leave that header out of requests to
server-admin endpoints. Without `orgId`, Grafana uses the user's active
organization. The user must have access to the organization you choose.

Prefer a [service account](https://grafana.com/docs/grafana/latest/administration/service-accounts/)
with the permissions your plugin needs. Each service account belongs to one
organization, so its token cannot switch organizations. The `token` method has
no `orgId` field. Older instance API keys use the same bearer header, but Grafana
has replaced API keys with service accounts. A Cloud Access Policy token cannot
authenticate these instance API requests.

The service checks the required credential fields and their format. Your plugin still needs to handle API errors for expired or invalid tokens,
missing permissions, or disabled basic authentication. Choose service-account
tokens for Grafana Cloud: the service does not check which deployment you use
from its hostname.

## Lookup and selection

Pass the resource URL in `query: { url }`. The service matches its host exactly,
including non-default ports. Paths and query parameters, including `orgId`, do
not select a different connection or credential. A resource URL using the internal
`baseUrl` host will not find the connection unless it also matches the configured
host.

Configure a different host for each Grafana instance. The service rejects two
connections with the same host, even if their subpaths differ, because lookup
cannot tell them apart. A URL query cannot choose between organizations either.
Use [plugin scoping](../01-concepts.md#plugin-scoping) to give different plugins
the credentials for their organization on the same instance.

The service puts credentials matched to the calling plugin before shared
credentials, keeping configuration order within each group. Credentials matched
to other plugins are excluded. It picks the first entry in that order, then
checks whether the plugin supports its method. If it does not, lookup fails;
the service does not try a later credential. Put a supported credential first in
the relevant group or restrict which plugins can use it. Changing the order of
`authMethods` in the lookup request does not change the selection. A plugin that
supports only tokens requests `authMethods: ['token']`.

## Consume a Grafana connection

Give your backend plugin access to `ConnectionsService` by
[declaring a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection).
This example uses a token to search dashboards. It calls the same endpoint as
the community Grafana plugin; choose API routes that work with the Grafana
versions your plugin supports.

This example assumes the configured base URL ends with a slash. Connections also
accept URLs without a trailing slash.

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

  // The example base URL ends with / so new URL() preserves the context path.
  const url = new URL('api/search?type=dash-db', connection.baseUrl);
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

With a base URL of `http://grafana.internal:3000/grafana/`, the relative path above
resolves to `http://grafana.internal:3000/grafana/api/search?type=dash-db`.

Send authenticated requests to the returned `baseUrl` so the credentials go to
the configured Grafana server. Do not send credentials to a URL taken directly
from an entity annotation or follow redirects to another host: either could
send them to another server. Keep credentials in the backend.

## Existing plugin configuration

The
[`@backstage-community/plugin-grafana`](https://github.com/backstage/community-plugins/tree/main/workspaces/grafana/plugins/grafana)
[API client](https://github.com/backstage/community-plugins/blob/main/workspaces/grafana/plugins/grafana/src/api.ts)
performs authenticated dashboard searches and alert queries through the Backstage
proxy. Its [setup guide](https://github.com/backstage/community-plugins/blob/main/workspaces/grafana/plugins/grafana/docs/setup.md)
configures a proxy target and bearer header separately from the public Grafana
domain used for links.

Keep the public link domain and plugin settings in the plugin's configuration.
The connection service provides API credentials and an address for backend
requests; it does not replace the plugin's instance identifiers, alerting options,
search limits or dashboard embedding settings. Configuring a connection does not
change the plugin or convert its proxy configuration. This repository has no
legacy Grafana integration configuration to migrate.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
