---
id: snyk
title: Snyk connections
description: Configure and consume Snyk connections
---

Use a `snyk` connection to read the regional REST or V1 API with an API token.

## Configuring

### Configure an API token

Create an API token for the Snyk account your plugin uses, following the
[API authentication guide](https://docs.snyk.io/developer-tools/snyk-api/authentication-for-api).
Check that the account's plan and token permissions allow the APIs you need,
then configure the token with your region's API address.

The `token` method requires a nonempty token without whitespace and sends
`Authorization: token ...`. Every connection needs a token. Supply a token you manage; the connection does
not exchange or refresh tokens.

```yaml title="app-config.yaml"
connections:
  - type: snyk
    baseUrl: https://api.eu.snyk.io/
    auth:
      - method: token
        token: ${SNYK_TOKEN}
```

### Choose the regional API root

Set `baseUrl` to the API root for your region: `https://api.snyk.io/`,
`https://api.us.snyk.io/`, `https://api.eu.snyk.io/` or `https://api.au.snyk.io/`.
Use an API address directly; browser URLs do not select a region. See the
[REST API URLs](https://docs.snyk.io/developer-tools/snyk-api/rest-api/about-the-rest-api#api-urls)
and [V1 API URLs](https://docs.snyk.io/developer-tools/snyk-api/v1-api#api-urls).

If your backend uses an API proxy, set `apiBaseUrl` to its root. Otherwise,
the consumer uses `baseUrl`. Include any proxy context path, but leave `rest/`
and `v1/` out of these roots so callers can choose the API for each request.
Both roots accept HTTP or HTTPS without credentials, queries or fragments. Use
HTTPS over untrusted networks to protect the token. The connection
preserves paths and encoded characters and adds a trailing slash for appending
relative routes.

The host and non-default port from `baseUrl` identify the connection. Neither an
API override nor an organization in the request path adds a lookup identity.
Connections sharing that host would be duplicates. Use
[plugin scoping](../01-concepts.md#plugin-scoping) when plugins need different
tokens for organizations on the same regional API.

## Consuming

### List an organization's projects

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and look up the regional API URL with `token` authentication. Pass the
organization ID and supported REST API version to this function; both belong to
the request, not lookup. It sends requests through `apiBaseUrl` when configured.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readSnykProjects(
  connections: ConnectionsService,
  apiUrl: string,
  organizationId: string,
  apiVersion: string,
) {
  const connection = await connections.find({
    type: 'snyk',
    query: { url: apiUrl },
    authMethods: ['token'],
  });
  const url = new URL(
    `rest/orgs/${encodeURIComponent(organizationId)}/projects`,
    connection.apiBaseUrl ?? connection.baseUrl,
  );
  url.searchParams.set('version', apiVersion);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: `token ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

For the EU configuration, the request starts at
`https://api.eu.snyk.io/rest/orgs/`, followed by the organization ID and `projects`.
The `version` query parameter selects the REST API version. Append relative
routes so a configured proxy path remains part of the request.

Snyk checks API availability and the token's permissions when it handles the
request. The example checks unsuccessful responses and rejects redirects.
Keep the token on the backend; see the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
