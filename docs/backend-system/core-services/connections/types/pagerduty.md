---
id: pagerduty
title: PagerDuty connections
description: Configure and consume PagerDuty REST API connections
---

The `pagerduty` connection type lets you configure a separate connection for each
PagerDuty account ([multiton cardinality](../01-concepts.md#cardinality)). Plugins
look up an account by its `host` using the
[lookup strategy](../01-concepts.md#lookup-strategies).

## Configure PagerDuty

This example uses dummy credentials. In production, supply the REST API token
through a secret environment variable to keep it out of the configuration file.

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

Accounts can share a regional API endpoint, so that endpoint cannot tell a plugin
which account to use. Set `host` to the account web hostname, such as
`example.pagerduty.com`. Plugins use that hostname to select the account and its
credentials, then send requests to `apiBaseUrl`.

Select `https://api.pagerduty.com` for US accounts or
`https://api.eu.pagerduty.com` for EU accounts, as described in PagerDuty's
[service regions documentation](https://docs.pagerduty.com/get-started/service-regions).
Set the endpoint explicitly because the account hostname does not determine the
region. You can also use an HTTPS proxy base URL. When building requests, preserve
any path in that base URL.

Literal `?` and `#` delimiters are rejected, even without a query or fragment
after them, because they can change how request paths are joined. Context paths,
trailing slashes and percent-encoded path characters such as `%3F` and `%23` are
accepted.

## Authentication

| Method  | Field   | Type     | Required | Description                         |
| ------- | ------- | -------- | -------- | ----------------------------------- |
| `token` | `token` | `string` | Yes      | Raw account or user REST API token. |

The token must be non-empty and contain no whitespace. Supply the raw token
without an authorisation prefix; the plugin adds the header when making a
request. Following PagerDuty's
[REST authentication documentation](https://docs.pagerduty.com/developer/authentication),
consumers send `Authorization: Token token=<token>` and
`Accept: application/vnd.pagerduty+json;version=2`. Prefer a read-only token
when the plugin only reads data, so its token cannot change PagerDuty data.
PagerDuty checks permissions when it receives a request. Resolving the connection
does not contact PagerDuty or verify the token's permissions.

Use a REST API token for this connection. Unauthenticated access and OAuth are
not supported, and the connection service does not exchange or refresh tokens.
Do not supply an OAuth access token in place of a REST API token: OAuth needs a
Bearer header. See PagerDuty's
[private app documentation](https://docs.pagerduty.com/developer/private-apps).

To send events through Events API v2, obtain the service integration's routing
key separately and include it in the event payload. A routing key cannot
authenticate REST API requests. This connection type does not accept routing keys
or an Events endpoint. See the plugin's
[PagerDuty integration guide](https://pagerduty.github.io/backstage-plugin-docs/getting-started/pagerduty/).
Validation can check the token's format, but cannot tell which API issued it.
Check that you have a REST API token before adding it to the configuration.

## Lookup and selection

Supply an account web URL, such as
`https://example.pagerduty.com/service-directory/P123456`. Lookup matches its
lowercase host exactly; the path does not affect which account is selected.
Configured hosts are converted to lowercase before lookup and duplicate checks, so
`Example.PagerDuty.com` and `example.pagerduty.com` identify the same account.
Two accounts can share `apiBaseUrl` while keeping separate tokens. Passing the
regional API URL will not match the account in the example above.

When an account has several tokens,
[plugin scoping](../01-concepts.md#plugin-scoping) lets you give a plugin its own
credentials. Entries matched to the calling plugin come before unrestricted
entries. The service selects the first entry in that order, using configuration
order within each group.

## Consume a PagerDuty connection

Declare `type: 'pagerduty'` using `declareConnection` in the consuming plugin's
registration so the service knows it uses PagerDuty. Request `connectionsServiceRef` from
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

Keep these values on the backend. Logging the token or returning the headers to
the frontend would expose credentials that can access PagerDuty.

## Existing plugin configuration

The
[`@pagerduty/backstage-plugin-backend`](https://github.com/PagerDuty/backstage-plugins/tree/main/plugins/backstage-plugin-backend)
package reads its own configuration; adding a connection does not change the
endpoint or credentials it uses.
Its [`apis/pagerduty.ts`](https://github.com/PagerDuty/backstage-plugins/blob/main/plugins/backstage-plugin-backend/src/apis/pagerduty.ts)
stores API endpoints by `account.id` and accepts an account argument on service
lookups. Its [`auth/auth.ts`](https://github.com/PagerDuty/backstage-plugins/blob/main/plugins/backstage-plugin-backend/src/auth/auth.ts)
stores tokens under the same account ID and constructs the REST token header.

The plugin's [multi-account configuration guide](https://pagerduty.github.io/backstage-plugin-docs/getting-started/backstage/#multiple-pagerduty-accounts)
defines account IDs and the `pagerduty.com/account` entity annotation as the
account subdomain. For a connection lookup, map a subdomain such as `example` to
`https://example.pagerduty.com`. The plugin passes account IDs to its client, so
you cannot pass those IDs directly to the connection service. Single-account and
default-account settings also need an explicit account hostname for lookup.

The plugin handles scoped OAuth and Events credentials separately. There is no
`integrations.pagerduty` configuration in this repository. The connection service
does not convert the external plugin's `pagerDuty` configuration or generic proxy
endpoints, so keep those settings for plugins that still read them.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
