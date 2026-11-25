---
id: datadog
title: Datadog connections
description: Configure and consume Datadog connections
---

Use a `datadog` connection to access a regional API with an API key and an
application key.

## Configuring

### Configure API and application keys

Create an API key and an application key for the Datadog organization your plugin
needs to read. Give the application key the permissions required by those APIs.
Follow Datadog's
[API authentication guide](https://docs.datadoghq.com/api/latest/authentication/)
and configure both keys with the API address for your region.

The `apiKey` method requires both keys to be nonempty and contain no whitespace.
It sends them in the `DD-API-KEY` and `DD-APPLICATION-KEY` headers. Every connection
needs this pair of keys; OAuth and anonymous access are not supported.

```yaml title="app-config.yaml"
connections:
  - type: datadog
    baseUrl: https://api.datadoghq.com/
    auth:
      - method: apiKey
        apiKey: ${DATADOG_API_KEY}
        applicationKey: ${DATADOG_APPLICATION_KEY}
```

### Choose the regional API address

Set `baseUrl` to the API root for your organization's
[Datadog site](https://docs.datadoghq.com/getting_started/site/), such as
`https://api.datadoghq.com/` or `https://api.datadoghq.eu/`. Supply the API address
directly; the connection does not translate browser hosts or SDK site names.

If your backend reaches that API through a proxy, set `apiBaseUrl` to the proxy's
root, including any context path. Otherwise, leave it out and use `baseUrl`
for requests. Keep `api/v2/` out of these roots: the consumer appends the API route.
Both roots accept HTTP or HTTPS without credentials, queries or fragments. Use
HTTPS across untrusted networks to protect the keys. Installation
paths and encoded characters are preserved, with a trailing slash for joining
relative routes.

Lookup uses the host and non-default port from `baseUrl`. The proxy address and
URL paths do not select another connection or organization. Connections on the
same host would be duplicates, so use
[plugin-scoped key pairs](../01-concepts.md#plugin-scoping) when different plugins
need access to different organizations sharing an API host.

## Consuming

### Read the service catalog

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and pass your regional API URL to lookup. Request `apiKey` authentication so both
keys are available. This example reads catalog entities using the configured
proxy root when present, otherwise the regional API root.

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

For the configuration above, the request goes to
`https://api.datadoghq.com/api/v2/catalog/entity`. Append routes without a leading
slash so a proxy's context path survives.

Datadog checks that the keys are valid and have access to the requested API.
The example checks HTTP errors and rejects redirects before reading JSON.
Keep both keys in your backend, following the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
