---
id: snyk
title: Snyk connections
description: Configure and consume Snyk connections
---

Use a `snyk` connection to access the regional REST and V1 APIs with a configured API token.

## Configuring

```yaml title="app-config.yaml"
connections:
  - type: snyk
    baseUrl: https://api.eu.snyk.io/
    auth:
      - method: token
        token: ${SNYK_TOKEN}
```

Use the HTTPS API root for your region: `https://api.snyk.io/`,
`https://api.us.snyk.io/`, `https://api.eu.snyk.io/` or `https://api.au.snyk.io/`.
No region is inferred from browser URLs. Optional `apiBaseUrl` can name an
independent HTTPS API destination; otherwise consumers use `baseUrl`. Both roots
can preserve a proxy context path. See [REST API URLs](https://docs.snyk.io/developer-tools/snyk-api/rest-api/about-the-rest-api#api-urls)
and [V1 API URLs](https://docs.snyk.io/developer-tools/snyk-api/v1-api#api-urls).

The `token` method accepts a nonempty token without whitespace and sends
`Authorization: token ...`. Token permissions and API availability depend on the
account and plan. No token exchange, refresh or unauthenticated method is
provided. See [API authentication](https://docs.snyk.io/developer-tools/snyk-api/authentication-for-api).
Organization selection and the REST version parameter belong to each request,
not connection lookup.

URL roots reject credentials, query and fragment delimiters, preserve context
paths and encoded characters, and receive a trailing slash. API overrides are
not filled automatically.

Lookup uses the host and non-default port from `baseUrl`, not the API override
or URL path. Two installations under the same host cannot have separate
connections. Use the shared [plugin-scoping rules](../01-concepts.md#plugin-scoping)
when plugins need different credentials for the same instance.

## Consuming

Declare the connection and resolve the service using the shared
[backend consumption guide](../03-consuming-connections.md#declare-and-resolve-the-connection).
Append relative paths without a leading slash so the configured context survives.

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

The examples keep credentials on the backend, reject redirects and check HTTP
errors before reading JSON. The provider checks permissions and token validity
when it receives a request. See the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
