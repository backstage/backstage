---
id: datadog
title: Datadog connections
description: Configure and consume Datadog connections
---

Use a `datadog` connection to give a backend plugin paired API and application keys for a regional API.

## Configuring

```yaml title="app-config.yaml"
connections:
  - type: datadog
    baseUrl: https://api.datadoghq.com/
    auth:
      - method: apiKey
        apiKey: ${DATADOG_API_KEY}
        applicationKey: ${DATADOG_APPLICATION_KEY}
```

Use an explicit HTTPS API root for the organization's [Datadog site](https://docs.datadoghq.com/getting_started/site/),
for example `https://api.datadoghq.com/` or `https://api.datadoghq.eu/`. Browser
hosts and SDK site names are not translated into regional API addresses.
Optional `apiBaseUrl` can name an independent HTTPS destination; when absent,
consumers use `baseUrl` directly. Include any proxy context path in the root.

The `apiKey` method requires both nonempty keys without whitespace. Read APIs
require an application key with the appropriate permissions in addition to the
API key. No OAuth exchange or unauthenticated method is provided. See
[API authentication](https://docs.datadoghq.com/api/latest/authentication/).
Multiple organizations sharing one API host need plugin-scoped key pairs; URL
paths do not select an organization.

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

export async function readDatadogCatalog(
  connections: ConnectionsService,
  apiUrl: string,
) {
  const connection = await connections.find({
    type: 'datadog',
    query: { url: apiUrl },
    authMethods: ['apiKey'],
  });
  const url = new URL(
    'api/v2/catalog/entity',
    connection.apiBaseUrl ?? connection.baseUrl,
  );
  const response = await fetch(url, {
    redirect: 'error',
    headers: {
      'DD-API-KEY': connection.auth.apiKey,
      'DD-APPLICATION-KEY': connection.auth.applicationKey,
      Accept: 'application/json',
    },
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
