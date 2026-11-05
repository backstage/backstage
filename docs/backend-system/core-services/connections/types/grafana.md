---
id: grafana
title: Grafana connections
description: Configure and consume authenticated Grafana instance APIs
---

The `grafana` connection type represents a Grafana instance, either a Grafana
Cloud stack or a self-hosted Grafana OSS or Enterprise server. It has
[multiton cardinality](../01-concepts.md#cardinality) and uses the `host`
[lookup strategy](../01-concepts.md#lookup-strategies).

This type supplies static credentials for authenticated instance APIs. It does
not configure embedded dashboards, browser sessions, the Grafana Cloud management
API, or direct Mimir, Loki, or Tempo telemetry APIs. Those Cloud APIs use
[Cloud Access Policies](https://grafana.com/docs/grafana-cloud/learn-and-build/developer-resources/api-reference/cloud-api/),
which are separate from instance service-account tokens.

## Configure Grafana

The following configuration uses dummy credentials and is valid without
environment variables. Replace the credentials with
[environment variable references](../../../../conf/writing.md#environment-variable-substitution)
in your deployment.

```yaml title="app-config.yaml"
connections:
  - type: grafana
    host: example.grafana.net
    baseUrl: https://example.grafana.net
    auth:
      - method: token
        token: dummy-service-account-token

  - type: grafana
    host: monitoring.example.com:8443
    baseUrl: http://grafana.internal:3000/grafana
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

`host` contains no scheme, path, credentials, query, or fragment. Use the host
returned by `new URL(resourceUrl).host`; default ports are omitted by URL parsing.
`baseUrl` contains no embedded credentials, query, or fragment. Both trailing-slash
forms are accepted. Use HTTPS when sending credentials over an untrusted network.

`host` identifies the instance in resource URLs that the plugin knows, such as an
entity's configured dashboard URL. `baseUrl` is the backend request destination;
it can use a different, internal host. For example, a caller with a dashboard URL
under `https://monitoring.example.com:8443/grafana` looks up
`monitoring.example.com:8443`, then sends requests to
`http://grafana.internal:3000/grafana`. Callers must obtain that resource URL from
their own plugin or entity configuration; this type does not discover instances.

Configure the instance root, not a dashboard URL or an `/api` endpoint. Consumers
append their API routes, preserving the subpath documented in Grafana's
[`root_url` configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/#root_url).
The connection does not choose a Grafana API version or construct a client.

## Authentication methods

Grafana's [HTTP API authentication guide](https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/authentication/)
describes bearer service-account tokens for Cloud and self-hosted instances, and
basic authentication for self-hosted instances only. This type requires
authentication and does not offer `none`.

| Method  | Field      | Type     | Required | Description                                                                    |
| ------- | ---------- | -------- | -------- | ------------------------------------------------------------------------------ |
| `token` | `token`    | `string` | Yes      | Nonempty bearer service-account token, without `Bearer ` prefix or whitespace. |
| `basic` | `username` | `string` | Yes      | Nonempty user login, without colons or line breaks.                            |
| `basic` | `password` | `string` | Yes      | Nonempty user password.                                                        |
| `basic` | `orgId`    | `number` | No       | Positive integer organization ID for `X-Grafana-Org-Id`.                       |

Consumers send `Authorization: Bearer <token>` for `token`, or HTTP Basic
`Authorization` with base64-encoded `username:password` for `basic`. For basic
authentication, send `X-Grafana-Org-Id: <orgId>` when configured on organization
API requests, excluding server-admin endpoints. Without `orgId`, Grafana uses the
user's active organization. The user must have access to the chosen organization.

Prefer a [service account](https://grafana.com/docs/grafana/latest/administration/service-accounts/)
with the permissions needed by your consumer. Service accounts belong to one
organization; a token cannot switch organizations. The `token` method has no
`orgId` field. Older instance API keys use the same bearer header, but Grafana
has replaced API keys with service accounts. Do not use a Cloud Access Policy
token in this method.

The service validates credential shapes, not token validity, expiration,
permissions, or whether a server has basic authentication enabled. Consumers
handle API errors. Basic authentication is not supported by Grafana Cloud even
though the schema does not infer deployment type from a hostname.

## Lookup and selection

The consumer supplies `query: { url }`. The service matches the parsed URL's host
exactly, including non-default ports. Paths and query parameters, including
`orgId`, do not affect lookup or credential selection. The internal `baseUrl`
host does not become an additional lookup identity.

Only one Grafana connection can use a given host. Two instances under different
subpaths on the same host cannot be configured separately; use distinct hosts
for those instances. Multiple organizations also cannot be selected by a URL
query. Use [plugin scoping](../01-concepts.md#plugin-scoping) for credentials
belonging to different plugins or organizations on the same instance.

After plugin scoping, the service selects the first visible authentication entry
in configuration order. If the caller does not support that method, lookup fails
even when a later entry uses a supported method. The order of `authMethods` in
the lookup request does not express a preference. Scope or order credentials
accordingly; a token-only consumer requests `authMethods: ['token']`.

## Consume a Grafana connection

Backend plugins receive the typed `ConnectionsService` through a
[declared connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection).
This token-only example calls the dashboard search endpoint used by the
community Grafana plugin. The plugin chooses the API route for its supported
Grafana versions.

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

  // Keep the configured subpath with or without a trailing slash.
  const root = `${connection.baseUrl.replace(/\/$/, '')}/`;
  const url = new URL('api/search?type=dash-db', root);
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

Use the returned `baseUrl` for authenticated requests. Do not send credentials to
a URL taken directly from an entity annotation or follow redirects to another
host. Keep credentials in the backend.

## First consumer and adoption gaps

The first concrete adoption target is
[`@backstage-community/plugin-grafana`](https://github.com/backstage/community-plugins/tree/main/workspaces/grafana/plugins/grafana).
Its [API client](https://github.com/backstage/community-plugins/blob/main/workspaces/grafana/plugins/grafana/src/api.ts)
performs authenticated dashboard searches and alert queries through the Backstage
proxy. Its [setup guide](https://github.com/backstage/community-plugins/blob/main/workspaces/grafana/plugins/grafana/docs/setup.md)
configures a proxy target and bearer header separately from the public Grafana
domain used for links.

Adoption requires a backend consumer that declares the Grafana connection,
resolves the lookup URL for each configured instance, and performs those requests
with the returned credentials. The plugin's instance identifiers, public link
domains, alerting options, search limits, and dashboard embedding settings remain
plugin concerns. Adding this connection type does not change that plugin or
convert its proxy configuration. This repository has no legacy Grafana
integration configuration to migrate.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
