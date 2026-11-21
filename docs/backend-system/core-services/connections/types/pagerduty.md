---
id: pagerduty
title: PagerDuty connections
description: Configure and consume PagerDuty connections
---

Use a `pagerduty` connection to access an account's REST API. Accounts sharing a
regional API endpoint can keep separate credentials.

## Configuring

### Configure a REST API token

Create a REST API token for the PagerDuty account your plugin needs to access,
following the [REST authentication guide](https://docs.pagerduty.com/developer/authentication).
Configure the token with the account's web address and regional API endpoint.

Use `token` with a raw, nonempty REST API token without whitespace. Requests send
it as `Token token=...`. OAuth Bearer tokens and Events API routing keys use
different authentication and cannot be used here.

```yaml title="app-config.yaml"
connections:
  - type: pagerduty
    baseUrl: https://example.pagerduty.com/
    apiBaseUrl: https://api.eu.pagerduty.com/
    auth:
      - method: token
        token: ${PAGERDUTY_REST_TOKEN}
```

### Choose the account and region

Set `baseUrl` to the account web address, such as
`https://example.pagerduty.com/`. Set the required `apiBaseUrl` to
`https://api.pagerduty.com/` for a US account or `https://api.eu.pagerduty.com/` for
an EU account. Choose it from your account's
[service region](https://docs.pagerduty.com/get-started/service-regions);
the account web address does not tell the connection which region to use.

Both roots accept HTTP or HTTPS without credentials, queries or fragments. Use
HTTPS over untrusted networks to protect the REST token.
A proxy root may include a context path. The connection preserves that path and
encoded characters and adds a trailing slash, so appending `services/...` keeps
requests under the configured API root.

Lookup matches the account host and non-default port in `baseUrl`. Several
accounts can therefore share `apiBaseUrl` while selecting their own tokens.
Different paths on the same account host cannot identify separate connections.
For different plugin credentials on one account, use
[plugin scoping](../01-concepts.md#plugin-scoping).

## Consuming

### Read a service

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and pass an account resource URL to lookup. Use the account URL even though the
request goes to the regional API: the shared API host cannot identify an account.
The example requests `token` authentication and reads a service by its ID.

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

For the configured EU endpoint and service ID `P123456`, the request goes to
`https://api.eu.pagerduty.com/services/P123456`. Keep the service route relative
so an API proxy's context path is preserved.

PagerDuty checks the REST token's validity and permissions. Keep it in the
backend and send it to the configured regional API. The example rejects
redirects and checks unsuccessful responses; see the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
