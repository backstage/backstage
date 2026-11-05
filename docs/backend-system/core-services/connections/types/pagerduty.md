---
id: pagerduty
title: PagerDuty connections
description: Configure and consume PagerDuty REST API connections
---

The `pagerduty` connection type represents a PagerDuty account. It has
[multiton cardinality](../01-concepts.md#cardinality) and uses the `host`
[lookup strategy](../01-concepts.md#lookup-strategies).

## Configure PagerDuty

This example uses dummy credentials. Supply a real REST API token through a
secret environment variable in production.

```yaml title="app-config.yaml"
connections:
  - type: pagerduty
    host: example.pagerduty.com
    apiBaseUrl: https://api.pagerduty.com
    auth:
      - method: token
        token: dummy-rest-api-token
```

## Connection fields

| Field        | Type     | Required | Description                                                           |
| ------------ | -------- | -------- | --------------------------------------------------------------------- |
| `host`       | `string` | Yes      | Account web hostname, without a scheme, port, or path.                |
| `apiBaseUrl` | `string` | Yes      | HTTPS REST API base URL, without credentials, a query, or a fragment. |

The account identity and request endpoint serve different purposes. Configure
`host` as the account web hostname, such as `example.pagerduty.com`, even for
accounts using the same regional API. Consumers match that host and send requests
to the returned `apiBaseUrl`. Do not use the shared REST API host as the account
identity.

Select `https://api.pagerduty.com` for US accounts or
`https://api.eu.pagerduty.com` for EU accounts, as described in PagerDuty's
[service regions documentation](https://docs.pagerduty.com/get-started/service-regions).
The type requires an explicit endpoint and does not infer the region from the
account hostname. HTTPS proxy base URLs are also accepted; consumers are
responsible for constructing request paths relative to the configured base.
Literal `?` and `#` delimiters are rejected, including empty query or fragment
suffixes. Context paths, trailing slashes, and percent-encoded path characters
such as `%3F` and `%23` are accepted.

## Authentication

| Method  | Field   | Type     | Required | Description                         |
| ------- | ------- | -------- | -------- | ----------------------------------- |
| `token` | `token` | `string` | Yes      | Raw account or user REST API token. |

The token must be non-empty and contain no whitespace. Pass the raw value,
without an authorization prefix. Following PagerDuty's
[REST authentication documentation](https://docs.pagerduty.com/developer/authentication),
consumers send `Authorization: Token token=<token>` and
`Accept: application/vnd.pagerduty+json;version=2`. Prefer a read-only token
when the consumer only reads data. Token permissions remain enforced by
PagerDuty; lookup does not verify permissions or contact the provider.

Only REST API token authentication is supported. There is no unauthenticated
method. Scoped OAuth client credentials, OAuth access tokens, token exchange,
and refresh are outside this contract. OAuth access tokens require a Bearer
header and must not be supplied as REST API tokens. See PagerDuty's
[private app documentation](https://docs.pagerduty.com/developer/private-apps).

Events API v2 routing keys identify a service integration and belong in Events
API payloads. They are not REST API credentials. This type has no Events endpoint
or routing-key method. A consumer that sends events must obtain the service's
routing key separately. See the plugin's
[PagerDuty integration guide](https://pagerduty.github.io/backstage-plugin-docs/getting-started/pagerduty/).
Schema validation cannot determine whether an arbitrary token string was issued
for the REST API or the Events API.

## Lookup and selection

Supply an account web URL, such as
`https://example.pagerduty.com/service-directory/P123456`. Lookup matches its
normalized lowercase host exactly, independently of its path. Configured hosts
are converted to lowercase before lookup and duplicate identity validation, so
`Example.PagerDuty.com` and `example.pagerduty.com` identify the same account.
Two accounts can share `apiBaseUrl`
while resolving different tokens. Passing the regional API URL does not identify
an account and does not match the preceding configuration.

The first authentication entry visible to the plugin is selected.
[Plugin scoping](../01-concepts.md#plugin-scoping) places entries matched to the
calling plugin before unrestricted entries. Within each group, configuration
order determines which token is selected.

## Consume a PagerDuty connection

Declare `type: 'pagerduty'` using `declareConnection` in the consuming plugin's
registration and request `connectionsServiceRef` from
`@backstage/backend-plugin-api/alpha`, as shown in the
[consumption guide](../03-consuming-connections.md). A typed helper can then
resolve the account and construct request headers:

```ts
import type { Connection, ConnectionsService } from '@backstage/connections';

export async function pagerDutyRequestOptions(
  connections: ConnectionsService,
  accountUrl: string,
) {
  const connection: Connection<'pagerduty', 'token'> = await connections.find({
    type: 'pagerduty',
    query: { url: accountUrl },
    authMethods: ['token'],
  });

  return {
    apiBaseUrl: connection.apiBaseUrl,
    headers: {
      Authorization: `Token token=${connection.auth.token}`,
      Accept: 'application/vnd.pagerduty+json;version=2',
    },
  };
}
```

Keep these values on the backend and never log the token or return the headers
to the frontend.

## First consumer and adoption gaps

The first concrete adoption target is
[`@pagerduty/backstage-plugin-backend`](https://github.com/PagerDuty/backstage-plugins/tree/main/plugins/backstage-plugin-backend).
Its [`apis/pagerduty.ts`](https://github.com/PagerDuty/backstage-plugins/blob/main/plugins/backstage-plugin-backend/src/apis/pagerduty.ts)
stores API endpoints by `account.id` and accepts an account argument on service
lookups. Its [`auth/auth.ts`](https://github.com/PagerDuty/backstage-plugins/blob/main/plugins/backstage-plugin-backend/src/auth/auth.ts)
stores tokens under the same account ID and constructs the REST token header.

The plugin's [multi-account configuration guide](https://pagerduty.github.io/backstage-plugin-docs/getting-started/backstage/#multiple-pagerduty-accounts)
defines account IDs and the `pagerduty.com/account` entity annotation as the
account subdomain. An adopter of this connection type must map an explicit
subdomain such as `example` to `https://example.pagerduty.com` for lookup.
The existing consumer passes account IDs rather than those URLs; this mapping
is required adoption work, not existing connection-service behavior. Its
single-account and default-account fallbacks also need an explicit account
identity when moving to host-based lookup.

The external plugin does not consume this connection type without further
changes. It must declare the type, request the service, map account identities,
and use the resolved endpoint and token in its client. Its scoped OAuth and
Events functionality need separate credential handling. No `integrations.pagerduty`
legacy configuration exists in this repository, and this addition does not
convert external `pagerDuty` plugin configuration or generic proxy endpoints.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
