---
id: snyk
title: Snyk connections
description: Configure and consume Snyk connections
---

The `snyk` connection type represents a Snyk API host. It has
[multiton cardinality](../01-concepts.md#cardinality) and uses the `host`
[lookup strategy](../01-concepts.md#lookup-strategies).

## Configure Snyk

This example uses a dummy token. Replace it with `${SNYK_TOKEN}` in your backend
configuration and supply a token from the same region as the API host.

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

The plugin IDs in `match.plugins` must match the backend plugins that consume
these connections. Unlisted plugins cannot obtain either token in this example.

## Connection fields and API roots

| Field  | Type     | Required | Description                                                            |
| ------ | -------- | -------- | ---------------------------------------------------------------------- |
| `host` | `string` | Yes      | API hostname without a scheme, port, or path; normalized to lowercase. |

Configure the API host, rather than the `app.*` hostname used by the web UI.
There is no default region. Snyk documents these
[regional REST API URLs](https://docs.snyk.io/developer-tools/snyk-api/rest-api/about-the-rest-api#api-urls)
and [V1 API URLs](https://docs.snyk.io/developer-tools/snyk-api/v1-api#api-urls):

| Region     | `host`         | REST root                     | V1 root                     |
| ---------- | -------------- | ----------------------------- | --------------------------- |
| SNYK-US-01 | api.snyk.io    | `https://api.snyk.io/rest`    | `https://api.snyk.io/v1`    |
| SNYK-US-02 | api.us.snyk.io | `https://api.us.snyk.io/rest` | `https://api.us.snyk.io/v1` |
| SNYK-EU-01 | api.eu.snyk.io | `https://api.eu.snyk.io/rest` | `https://api.eu.snyk.io/v1` |
| SNYK-AU-01 | api.au.snyk.io | `https://api.au.snyk.io/rest` | `https://api.au.snyk.io/v1` |

Custom DNS host names are accepted, for example for a reverse proxy. Consumers
construct HTTPS URLs from the host and append either `/rest` or `/v1` once.
API versions are endpoint-specific and remain the consumer's responsibility;
they are not connection fields. Web UI links also remain consumer settings.

## Authentication methods

| Method  | Field   | Type     | Required | Description                                  |
| ------- | ------- | -------- | -------- | -------------------------------------------- |
| `token` | `token` | `string` | Yes      | Snyk API token with no prefix or whitespace. |

Consumers send the exact header `Authorization: token <token>`. The connection
returns the raw token and does not add headers, exchange credentials, or call
Snyk. There is no unauthenticated method.

Use a service account token for backend automation, with permission to read the
required organizations and projects. Snyk also documents personal API tokens.
API access depends on the Snyk plan and token permissions; schema validation
does not verify these. See
[Snyk API authentication](https://docs.snyk.io/developer-tools/snyk-api/authentication-for-api).
Snyk Apps access tokens use a different Bearer authentication contract and are
not supported by this connection type.

## Lookup and organization selection

The consumer supplies an API URL in `query.url`. The service selects the
connection whose `host` matches the parsed URL host exactly. REST and V1 URLs
on the same host select the same connection. Web UI URLs do not match API hosts.
Each configured API host must be unique.

:::caution[Organization annotations do not select credentials]

Organization IDs in URL paths or catalog annotations do not select a token.
The service selects the first authentication entry visible to the calling
plugin after plugin scoping: entries explicitly matched to the plugin come
before entries without plugin scope, with configuration order preserved within
each group.
It does not try another token after an API permission error. Multiple organization tokens on the same host are not
automatically routed by organization.

:::

Use [plugin scoping](../01-concepts.md#plugin-scoping) as shown above when separate
plugins need different credentials. A plugin that reads several organizations
needs a token permitted to read all of them, such as a suitable group service
account token. Independently selecting several organization credentials for a
single plugin on one host is outside this contract.

The consumer obtains organization IDs from its own resource selection, such as
`snyk.io/org-id` or `snyk.io/org-ids` catalog annotations. REST resources use
`/rest/orgs/{orgId}/...`; V1 resources use `/v1/org/{orgId}/...`. Keep organization
IDs, slugs, project IDs, and target filters in the consuming plugin.

## Consume a Snyk connection

This backend example reads projects for an explicit organization ID using the
European API host. The plugin receives a plugin-scoped `ConnectionsService`
through `connectionsServiceRef` from `@backstage/backend-plugin-api/alpha`.
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

This reads one page. A production consumer must handle pagination and rate
limits and choose a supported version for each endpoint. V1 requests use the
same token header and their own endpoint paths.

## First consumer and adoption gaps

The concrete adoption target is
[`backstage-plugin-snyk`](https://github.com/snyk-tech-services/backstage-plugin-snyk).
Its [API client](https://github.com/snyk-tech-services/backstage-plugin-snyk/blob/main/src/api/SnykApiClient.ts)
uses both REST and V1 through Backstage's proxy. Its
[configuration guide](https://github.com/snyk-tech-services/backstage-plugin-snyk#plugin-configuration)
sets a regional proxy target and token header, reads organization IDs from
entity annotations, and configures web UI hosts and API versions separately.

Adding a connection does not change that plugin's proxy configuration or wire
it to the connections service. Adoption needs a backend consumer or proxy
adapter that resolves connections and keeps tokens on the backend. That work,
including mapping annotations to requests and supporting multiple regions in
the plugin, is separate from this connection type. There is no legacy Snyk
integration configuration in this repository to migrate automatically.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
