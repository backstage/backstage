---
id: snyk
title: Snyk connections
description: Configure and consume Snyk connections
---

Use the `snyk` connection type to share a Snyk API host and token with backend
plugins. Each API host identifies a separate connection.

## Configuring

Snyk tokens are specific to a region. Configure the matching API host so the
plugin sends requests to the region that accepts your token. This example
configures access to Snyk Europe:

```yaml title="app-config.yaml"
connections:
  - type: snyk
    host: api.eu.snyk.io
    auth:
      - method: token
        token: dummy-snyk-service-account-token
```

Replace the dummy token with `${SNYK_TOKEN}` and supply it through the backend's
environment. For automation, use a service account token with permission to read
the required organizations and projects. Snyk also supports personal API tokens;
API access depends on your Snyk plan and token permissions. See
[Snyk API authentication](https://docs.snyk.io/developer-tools/snyk-api/authentication-for-api).

### Choose the regional host

| Region     | `host`         |
| ---------- | -------------- |
| SNYK-US-01 | api.snyk.io    |
| SNYK-US-02 | api.us.snyk.io |
| SNYK-EU-01 | api.eu.snyk.io |
| SNYK-AU-01 | api.au.snyk.io |

Use an API host, not the `app.*` host used for web UI links. There is no default
region. Snyk lists its
[regional REST API URLs](https://docs.snyk.io/developer-tools/snyk-api/rest-api/about-the-rest-api#api-urls)
and [V1 API URLs](https://docs.snyk.io/developer-tools/snyk-api/v1-api#api-urls).

The required `host` is a DNS host name without a scheme, port, or path. Parsing
converts it to lowercase, and each configured host must be unique. Custom DNS
host names are accepted, for example for a reverse proxy. Non-default ports
and proxy context paths are not supported.

### Choose a token with the required access

The only authentication method is `token`. Its required `token` field holds the
raw API token without a prefix or whitespace. Anonymous access and Snyk Apps
Bearer tokens are not supported. Configuration validation does not check whether
Snyk accepts the token or grants it access to a project.

A plugin that reads several organizations needs one token with permission to
read all of them, such as a suitable group service account token. Organization
IDs do not choose credentials. If separate plugins need different
tokens, use [plugin scoping](../01-concepts.md#plugin-scoping); see the shared
[credential selection rules](../01-concepts.md#what-happens-during-find).
Follow the shared [backend credential handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).

## Consuming

Use an API URL for [host lookup](../01-concepts.md#lookup-strategies). REST and V1
URLs on the same host select the same connection; web UI URLs do not match the
API host. The connection returns the raw token, and your plugin adds
`Authorization: token <token>` to its request. Resolving a connection does not
contact Snyk or exchange credentials.

### Read one page of projects

This example uses the European API host configured above and an explicit
organization ID. Obtain `ConnectionsService` through `connectionsServiceRef`
from `@backstage/backend-plugin-api/alpha` and
[declare the connection during plugin registration](../03-consuming-connections.md#declare-and-resolve-the-connection).
See the shared guidance for [lookup errors](../03-consuming-connections.md#handle-lookup-errors).

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

The example returns one page of project data and throws a `ResponseError` for
an unsuccessful HTTP response. Handle pagination and rate limits in your plugin.

Construct HTTPS requests from the API host and append either `/rest` or `/v1`
once. Choose a supported version for each endpoint because Snyk endpoints have
separate version contracts. API versions and web UI links are plugin settings,
not connection fields. V1 requests use the same token header with their own
endpoint paths.

### Select the organization for a request

Pass the organization ID required by the endpoint in the request path.
REST resources use `/rest/orgs/{orgId}/...`; V1 resources use
`/v1/org/{orgId}/...`. Organization IDs, slugs, project IDs, and target filters
remain plugin settings.

:::caution[Organization IDs do not select credentials]

Changing an organization ID in a URL does not select another token. All
organizations queried by the plugin on one host use the selected token. The service does not route between organization tokens or try another
token after an API permission error.

:::

Return to the [built-in connection type index](../04-built-in-connection-types.md).
