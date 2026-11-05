---
id: datadog
title: Datadog connections
description: Configure regional Datadog API connections with API and application keys
---

Use a `datadog` connection to give a backend plugin the keys it needs to call a
regional Datadog API. Plugins find connections by their `host`, so configure a
separate connection for each API hostname.

## Configure Datadog

```yaml title="app-config.yaml"
connections:
  - type: datadog
    title: Datadog US1
    host: api.datadoghq.com
    auth:
      - method: apiKey
        title: Catalog sync
        match:
          plugins: [datadog-entity-sync]
        apiKey: dummy-datadog-api-key
        applicationKey: dummy-datadog-application-key
```

The dummy keys make this a valid configuration example, but Datadog will reject
requests that use them. Replace both with environment variables such as
`${DATADOG_API_KEY}` and `${DATADOG_APPLICATION_KEY}` before making requests.

### Connection fields and sites

| Field  | Type     | Required | Description                                                              |
| ------ | -------- | -------- | ------------------------------------------------------------------------ |
| `host` | `string` | Yes      | Lowercase API hostname, without a scheme, port, path, or trailing slash. |

Use the API hostname for the organization's [Datadog site](https://docs.datadoghq.com/getting_started/site/).
The API runs over HTTPS. The [Datadog API reference](https://docs.datadoghq.com/api/latest/authentication/)
lists regional endpoints; the site parameter used by Datadog SDKs differs from
the API hostname:

| Site    | SDK site parameter  | API hostname            |
| ------- | ------------------- | ----------------------- |
| US1     | `datadoghq.com`     | `api.datadoghq.com`     |
| US3     | `us3.datadoghq.com` | `api.us3.datadoghq.com` |
| US5     | `us5.datadoghq.com` | `api.us5.datadoghq.com` |
| EU1     | `datadoghq.eu`      | `api.datadoghq.eu`      |
| AP1     | `ap1.datadoghq.com` | `api.ap1.datadoghq.com` |
| AP2     | `ap2.datadoghq.com` | `api.ap2.datadoghq.com` |
| UK1     | `uk1.datadoghq.com` | `api.uk1.datadoghq.com` |
| US1-FED | `ddog-gov.com`      | `api.ddog-gov.com`      |
| US2-FED | `us2.ddog-gov.com`  | `api.us2.ddog-gov.com`  |

Datadog sites are independent, so use the API hostname and keys for the
organisation you want to access. Configure a separate connection for each site
you need. Some endpoints are available only in certain sites; check the API
reference for the endpoint you plan to call. Configuration accepts other
hostname values too, but a valid hostname does not confirm that an API is
available there.

### Authentication

| Method   | Field            | Type     | Required | Description                     |
| -------- | ---------------- | -------- | -------- | ------------------------------- |
| `apiKey` | `apiKey`         | `string` | Yes      | Organization API key.           |
| `apiKey` | `applicationKey` | `string` | Yes      | Application key for API access. |

The `apiKey` method requires both an API key and an application key, as needed
for catalog API calls. Both must be nonempty and contain no whitespace. Send
them in the `DD-API-KEY` and `DD-APPLICATION-KEY` headers, respectively.

Some Datadog endpoints, such as telemetry submission, need only an API key.
This connection type still requires both keys. It does not support OAuth or
renew keys automatically. The plugin uses the configured keys.

The application key needs permission to call each endpoint the plugin uses.
Datadog's [API authentication guide](https://docs.datadoghq.com/api/latest/authentication/)
explains the key pair, and its [role permissions reference](https://docs.datadoghq.com/account_management/rbac/permissions/)
describes catalog read and write permissions. For automation, prefer an
application key owned by a service account and grant only the permissions the
sync needs. Configuration validation does not contact Datadog or check key
ownership and permissions, so a configuration that loads successfully can still
fail when the plugin makes a request.

## Lookup and selection

Pass an API URL in `query.url`. The service matches its parsed host exactly.
For example, `https://api.datadoghq.eu/api/v2/catalog/entity` selects
`host: api.datadoghq.eu`. Browser hosts such as `app.datadoghq.eu`, bare SDK
site parameters, dashboard embed URLs, and entity annotations are not
translated into API hosts.

The service uses the first authentication entry available to the calling
plugin. It considers entries matched to that plugin before shared entries;
within each group, configuration order decides which entry it uses. The
selected `apiKey` method must be in the plugin's `authMethods` list. That list
does not change which entry the service selects.

Several Datadog organisations can share one regional API hostname. Since only
one connection is allowed per hostname, put their key pairs in separate
authentication entries and match each entry to the plugin that needs it.
Entity metadata and URL paths do not select an organisation. A plugin cannot
choose an entry by its `title` either, so it cannot use this lookup to choose
between several organisations in the same site.

## Consume a Datadog connection

Declare the type during plugin registration:

```ts
import { declareConnection } from '@backstage/backend-plugin-api/alpha';

// Inside register(reg), before registerInit:
declareConnection(reg, {
  type: 'datadog',
  description: 'Syncs catalog entities to Datadog Software Catalog',
});
```

Request `connectionsServiceRef` from `@backstage/backend-plugin-api/alpha` in
the plugin's initialization dependencies. A backend helper can then build the
request without exposing credentials to the frontend:

```ts
import type { Connection, ConnectionsService } from '@backstage/connections';

export async function createDatadogCatalogRequest(
  connections: ConnectionsService,
  apiUrl: string,
): Promise<{ url: string; headers: Record<string, string> }> {
  const connection: Connection<'datadog', 'apiKey'> = await connections.find({
    type: 'datadog',
    query: { url: apiUrl },
    authMethods: ['apiKey'],
  });

  return {
    url: `https://${connection.host}/api/v2/catalog/entity`,
    headers: {
      'DD-API-KEY': connection.auth.apiKey,
      'DD-APPLICATION-KEY': connection.auth.applicationKey,
      'Content-Type': 'application/json',
    },
  };
}
```

This helper prepares the URL and headers. The plugin still needs to choose the
HTTP method and catalog payload and handle the response. The returned headers
contain the keys, so keep them on the backend and avoid logging them.
See [Consume connections](../03-consuming-connections.md) for a complete plugin
registration example.

## Existing Datadog integrations

The
[`@datadog/backstage-plugin-datadog-entity-sync-backend`](https://github.com/DataDog/datadog-backstage-plugins/tree/main/plugins/datadog-entity-sync-backend)
plugin syncs Backstage catalog entities to Datadog.
Its [Software Catalog client factory](https://github.com/DataDog/datadog-backstage-plugins/blob/main/plugins/datadog-entity-sync-node/src/datadogSoftwareCatalogApi.ts)
currently reads `datadog.integration.apiKey`, `datadog.integration.appKey`, and
`datadog.integration.site`, and constructs the `SoftwareCatalogApi` client.
A `datadog` connection provides the same key values: `apiKey` corresponds to
`apiKeyAuth` and `applicationKey` to `appKeyAuth`. The SDK server needs to use
the matching API host. The plugin still reads its own settings, so adding a
connection alone does not change its client. Sync schedules, entity filters,
and entity formatting are also plugin settings. Backstage does not convert
existing Datadog integration settings into connections.

The example apps' `app.datadogRum` settings configure browser Real User
Monitoring (RUM) with a client token and application ID; those settings are
separate from backend API credentials and are not migrated.

The [Roadie Datadog frontend plugin](https://github.com/RoadieHQ/roadie-backstage-plugins/tree/main/plugins/frontend/backstage-plugin-datadog)
embeds shared dashboards and graphs using URLs and annotation values. Those
public embeds do not need an authenticated API connection. There is no `none`
authentication method for this connection type. Keep API keys on the backend;
they are not needed to display the shared dashboards and graphs.
