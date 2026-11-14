---
id: pagerduty
title: PagerDuty connections
description: Configure and consume PagerDuty REST API connections
---

The `pagerduty` connection type supports REST API token authentication. Each
connection identifies one account, so accounts that share a regional API endpoint
can keep separate credentials.

## Configuring

### Configure REST access

Create an account or user REST API token as described in PagerDuty's
[REST authentication documentation](https://docs.pagerduty.com/developer/authentication).
Use a read-only token if the plugin only reads data, so its token cannot change
PagerDuty data.

Configure one account with its web hostname and regional API endpoint. This
example uses a dummy token; in production, supply the token through a secret
environment variable to keep it out of the configuration file.

```yaml title="app-config.yaml"
connections:
  - type: pagerduty
    host: example.pagerduty.com
    apiBaseUrl: https://api.pagerduty.com
    auth:
      - method: token
        token: dummy-rest-api-token
```

### Account and endpoint fields

| Field        | Type     | Required | Description                                                           |
| ------------ | -------- | -------- | --------------------------------------------------------------------- |
| `host`       | `string` | Yes      | Account web hostname, without a scheme, port, or path.                |
| `apiBaseUrl` | `string` | Yes      | HTTPS REST API base URL, without credentials, a query, or a fragment. |

Accounts can share a regional API endpoint, so that endpoint cannot tell a plugin
which account to use. Set `host` to the account web hostname, such as
`example.pagerduty.com`. Plugins use that hostname to select the account and its
credentials, then send requests to `apiBaseUrl`.

Set `apiBaseUrl` explicitly: the account hostname does not determine the region.
Use `https://api.pagerduty.com` for US accounts or
`https://api.eu.pagerduty.com` for EU accounts. See PagerDuty's
[service regions documentation](https://docs.pagerduty.com/get-started/service-regions).
HTTPS proxy URLs can include a context path, with or without a trailing slash.
The connection service preserves the configured API URL; it does not add a slash
or derive an endpoint from the account hostname.

Literal `?` and `#` delimiters are rejected, even without a query or fragment
after them, because they can change how request paths are joined. Percent-encoded
path characters such as `%3F` and `%23` are accepted.

### Token requirements

| Method  | Field   | Type     | Required | Description                         |
| ------- | ------- | -------- | -------- | ----------------------------------- |
| `token` | `token` | `string` | Yes      | Raw account or user REST API token. |

Supply the raw token without an authorisation prefix. It must be non-empty and
contain no whitespace. Resolving a connection does not contact PagerDuty or check
the token's permissions; PagerDuty checks those when it receives a request.

Unauthenticated access and OAuth are not supported. The connection service does
not exchange or refresh tokens. Do not supply an OAuth access token as a REST API
token: OAuth needs a Bearer header. See PagerDuty's
[private app documentation](https://docs.pagerduty.com/developer/private-apps).

Events API v2 routing keys identify service integrations and belong in event
payloads. They cannot authenticate REST API requests. This connection type has
no Events endpoint or routing-key method. If your plugin sends events, obtain the
service integration's routing key separately, as described in the
[Events API v2 documentation](https://docs.pagerduty.com/developer/events-api-v2-overview).
Validation cannot tell which API issued an arbitrary token string, so check that
you have a REST API token before configuring it.

For plugin-specific credentials, see
[plugin scoping](../01-concepts.md#plugin-scoping).

## Consuming

### Read a PagerDuty service

Set up the connection service in your plugin using the
[consumption guide](../03-consuming-connections.md). Look up a connection with an
account web URL, such as
`https://example.pagerduty.com/service-directory/P123456`. A regional API URL
cannot select an account. Lookup uses the lowercase host, independently of the
path; case-only differences in configured hosts count as duplicates. See the
[host lookup strategy](../01-concepts.md#lookup-strategies).

This example reads one service. It appends a slash locally before joining the API
path so that a proxy context path is preserved with either configured slash form.
The returned connection itself is unchanged.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function getPagerDutyService(
  connections: ConnectionsService,
  accountUrl: string,
  serviceId: string,
) {
  const connection = await connections.find({
    type: 'pagerduty',
    query: { url: accountUrl },
    authMethods: ['token'],
  });
  const apiBaseUrl = connection.apiBaseUrl.endsWith('/')
    ? connection.apiBaseUrl
    : `${connection.apiBaseUrl}/`;
  const url = new URL(`services/${encodeURIComponent(serviceId)}`, apiBaseUrl);
  const response = await fetch(url, {
    headers: {
      Authorization: `Token token=${connection.auth.token}`,
      Accept: 'application/vnd.pagerduty+json;version=2',
    },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return (await response.json()).service;
}
```

PagerDuty requires the REST token header shown above; an OAuth Bearer header or
Events routing key will not work in its place. The example returns the service
from a successful response and raises a response error for an API failure,
including rejected credentials or insufficient permissions. Handle connection
lookup errors separately as described in the
[consumption guide](../03-consuming-connections.md#handle-lookup-errors).
Keep the token and request headers on the backend, following the
[credential handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).

Return to the [built-in connection type index](../04-built-in-connection-types.md).
