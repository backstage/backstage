---
id: pagerduty
title: PagerDuty connections
description: Configure and consume PagerDuty connections
---

Use a `pagerduty` connection to select account-specific REST credentials, even when several accounts share a regional endpoint.

## Configuring

```yaml title="app-config.yaml"
connections:
  - type: pagerduty
    baseUrl: https://example.pagerduty.com/
    apiBaseUrl: https://api.eu.pagerduty.com/
    auth:
      - method: token
        token: ${PAGERDUTY_REST_TOKEN}
```

`baseUrl` is the account web URL used to identify credentials. `apiBaseUrl` is
required and independent: choose `https://api.pagerduty.com/` for US accounts or
`https://api.eu.pagerduty.com/` for EU accounts. The account URL does not determine
the region, and no regional endpoint is inferred. HTTPS proxy roots with context
paths are supported. See PagerDuty's [service regions](https://docs.pagerduty.com/get-started/service-regions).

Both roots require HTTPS. The `token` method accepts a raw, nonempty REST API token
without whitespace. It uses `Token token=...` authorization. OAuth Bearer tokens
and Events API routing keys use different protocols and are not supported here.
See [REST authentication](https://docs.pagerduty.com/developer/authentication).

URL roots reject credentials, query and fragment delimiters, preserve context
paths and encoded characters, and receive a trailing slash. Regional API destinations must be configured explicitly.

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

export async function readPagerDutyService(
  connections: ConnectionsService,
  accountUrl: string,
  serviceId: string,
) {
  const connection = await connections.find({
    type: 'pagerduty',
    query: { url: accountUrl },
    authMethods: ['token'],
  });
  const url = new URL(
    `services/${encodeURIComponent(serviceId)}`,
    connection.apiBaseUrl,
  );
  const response = await fetch(url, {
    redirect: 'error',
    headers: {
      Authorization: `Token token=${connection.auth.token}`,
      Accept: 'application/vnd.pagerduty+json;version=2',
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
