---
id: snyk
title: Snyk connections
description: Configure and consume Snyk connections
---

Use the `snyk` connection type to configure the API host and credentials that
backend plugins use to reach Snyk. You can configure a connection for each API
host: the type has [multiton cardinality](../01-concepts.md#cardinality) and uses
the `host` [lookup strategy](../01-concepts.md#lookup-strategies).

## Configure Snyk

Snyk tokens are specific to a region, so use a token from the same region as
your API host. Replace the dummy token in this example with `${SNYK_TOKEN}` in
your backend configuration.

```yaml title="app-config.yaml"
connections:
  - type: snyk
    title: Snyk Europe
    host: api.eu.snyk.io
    auth:
      - method: token
        title: Snyk plugin service account
        token: dummy-snyk-service-account-token
        match:
          plugins: [snyk]
      - method: token
        title: Catalog service account
        token: dummy-catalog-service-account-token
        match:
          plugins: [catalog]
```

Set `match.plugins` to the IDs of the backend plugins that need each token.
Only those plugins can obtain a token in this example.

## Connection fields and API roots

| Field  | Type     | Required | Description                                                            |
| ------ | -------- | -------- | ---------------------------------------------------------------------- |
| `host` | `string` | Yes      | API hostname without a scheme, port, or path; normalized to lowercase. |

Configure the API host for your region. The `app.*` hostname used by the web UI
does not identify an API connection, and there is no default region. Snyk lists these
[regional REST API URLs](https://docs.snyk.io/developer-tools/snyk-api/rest-api/about-the-rest-api#api-urls)
and [V1 API URLs](https://docs.snyk.io/developer-tools/snyk-api/v1-api#api-urls):

| Region     | `host`         | REST root                     | V1 root                     |
| ---------- | -------------- | ----------------------------- | --------------------------- |
| SNYK-US-01 | api.snyk.io    | `https://api.snyk.io/rest`    | `https://api.snyk.io/v1`    |
| SNYK-US-02 | api.us.snyk.io | `https://api.us.snyk.io/rest` | `https://api.us.snyk.io/v1` |
| SNYK-EU-01 | api.eu.snyk.io | `https://api.eu.snyk.io/rest` | `https://api.eu.snyk.io/v1` |
| SNYK-AU-01 | api.au.snyk.io | `https://api.au.snyk.io/rest` | `https://api.au.snyk.io/v1` |

You can also use a custom DNS host name, for example for a reverse proxy.
Consumers construct HTTPS URLs from the host and append either `/rest` or `/v1`
once. Choose API versions in the consumer because endpoints have separate
version contracts. API versions and web UI links remain consumer settings.

## Authentication methods

| Method  | Field   | Type     | Required | Description                                  |
| ------- | ------- | -------- | -------- | -------------------------------------------- |
| `token` | `token` | `string` | Yes      | Snyk API token with no prefix or whitespace. |

Consumers send the header `Authorization: token <token>`. The connection
returns the raw token; the consumer adds the header and makes the request.
The connection does not exchange credentials or call Snyk, and it requires
authentication.

For backend automation, use a service account token with permission to read the
required organizations and projects. Snyk also documents personal API tokens.
Schema validation checks the configuration, but API access still depends on
your Snyk plan and token permissions. See
[Snyk API authentication](https://docs.snyk.io/developer-tools/snyk-api/authentication-for-api).
Snyk Apps access tokens need Bearer authentication, which this connection type
does not support.

## Lookup and organization selection

Pass an API URL in `query.url`. The service selects the connection whose `host`
matches the parsed URL host exactly, so REST and V1 URLs on the same host use
the same connection. Each configured API host must be unique. Web UI URLs do
not match API hosts.

:::caution[Organization annotations do not select credentials]

Organization IDs in URL paths or catalog annotations do not select a token.
The service puts authentication entries that explicitly match the calling
plugin first, followed by entries without plugin scope. It preserves
configuration order within each group and selects the first visible entry.

That token is used for all organizations the plugin queries on the host. The
service does not route requests between organization tokens or try another
token after an API permission error.

:::

Use [plugin scoping](../01-concepts.md#plugin-scoping) when separate plugins need
different credentials, as in the configuration example. A plugin that reads
several organizations needs one token with permission to read all of them,
such as a suitable group service account token. This connection type cannot
select separate organization credentials for one plugin on the same host.

The consuming plugin selects organizations, for example from the catalog
annotations `snyk.io/org-id` or `snyk.io/org-ids`. REST resources use
`/rest/orgs/{orgId}/...`; V1 resources use `/v1/org/{orgId}/...`. Organization IDs,
slugs, project IDs, and target filters remain plugin settings.

## Consume a Snyk connection

This backend example reads projects for one organization through the European
API host. The plugin receives its `ConnectionsService` through
`connectionsServiceRef` from `@backstage/backend-plugin-api/alpha`, scoped to
that plugin.
[Declare the connection](../03-consuming-connections.md#declare-and-resolve-the-connection)
with `declareConnection(reg, { type: 'snyk', description: 'Reads Snyk projects' })`
during plugin registration before resolving it.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

async function readProjects(connections: ConnectionsService) {
  const orgId = '11111111-1111-4111-8111-111111111111';
  const url = new URL(
    `/rest/orgs/${encodeURIComponent(orgId)}/projects`,
    'https://api.eu.snyk.io',
  );
  url.searchParams.set('version', '2024-10-15');

  const connection = await connections.find({
    type: 'snyk',
    query: { url: url.toString() },
    authMethods: ['token'],
  });

  connection.auth.method; // 'token'
  connection.auth.token; // string

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${connection.auth.token}`,
      Accept: 'application/vnd.api+json',
    },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

The example reads one page. A production consumer must handle pagination and
rate limits and choose a supported version for each endpoint. V1 requests use
the same token header with their own endpoint paths.

## Existing plugin and adoption gaps

[`backstage-plugin-snyk`](https://github.com/snyk-tech-services/backstage-plugin-snyk)
is an existing Backstage consumer of the Snyk API.
Its [API client](https://github.com/snyk-tech-services/backstage-plugin-snyk/blob/main/src/api/SnykApiClient.ts)
uses both REST and V1 through Backstage's proxy. Its
[configuration guide](https://github.com/snyk-tech-services/backstage-plugin-snyk#plugin-configuration)
sets a regional proxy target and token header, reads organization IDs from
entity annotations, and configures web UI hosts and API versions separately.

To use this connection type, the plugin needs a backend consumer or proxy
adapter that resolves connections and keeps tokens on the backend. Adding a
connection leaves its proxy configuration unchanged. Mapping annotations to
requests and supporting multiple regions in the plugin remain separate work.
This repository has no legacy Snyk integration configuration to migrate
automatically.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
