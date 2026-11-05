---
id: datadog
title: Datadog connections
description: Configure regional Datadog API connections with API and application keys
---

The `datadog` connection type represents a regional Datadog API endpoint. It has
multiton cardinality and uses the `host` lookup strategy.

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

These dummy keys pass configuration validation but cannot authenticate. Replace
both with backend environment substitutions such as `${DATADOG_API_KEY}` and
`${DATADOG_APPLICATION_KEY}` before making requests.

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

Sites are independent. Configure a separate connection for each required API
hostname and use credentials issued by the organization in that site. Endpoint
availability can differ between sites. The schema validates hostname syntax,
not site availability; it does not restrict configuration to this list.

### Authentication

| Method   | Field            | Type     | Required | Description                     |
| -------- | ---------------- | -------- | -------- | ------------------------------- |
| `apiKey` | `apiKey`         | `string` | Yes      | Organization API key.           |
| `apiKey` | `applicationKey` | `string` | Yes      | Application key for API access. |

The `apiKey` method means an API-key/application-key pair. Both keys must be
nonempty and contain no whitespace. Send them as `DD-API-KEY` and
`DD-APPLICATION-KEY` headers, respectively. This contract covers authenticated
catalog API consumers that need both keys. Some Datadog endpoints, such as
telemetry submission, require only an API key; this connection type does not
currently model that credential shape. OAuth and credential refresh are also
outside this contract.

Use an application key with the permissions required by the endpoints the
consumer calls. Datadog's [API authentication guide](https://docs.datadoghq.com/api/latest/authentication/)
explains the key pair, and its [role permissions reference](https://docs.datadoghq.com/account_management/rbac/permissions/)
describes catalog read and write permissions. Prefer a service-account-owned
application key for automation and grant only the permissions needed by the
sync. Configuration validation does not contact Datadog, verify key ownership,
or check permissions.

## Lookup and selection

Pass an API URL in `query.url`. The service matches its parsed host exactly.
For example, `https://api.datadoghq.eu/api/v2/catalog/entity` selects
`host: api.datadoghq.eu`. Browser hosts such as `app.datadoghq.eu`, bare SDK
site parameters, dashboard embed URLs, and entity annotations are not
translated into API hosts.

The first authentication entry visible to the calling plugin wins. Entries
matched to that plugin precede unrestricted entries, with configuration order
breaking ties. The selected `apiKey` method must be in the consumer's
`authMethods` list.

Several Datadog organizations can share one regional API hostname. The
framework permits one connection per hostname, so put their key pairs in
separate authentication entries and use plugin matching when different
plugins need different organizations. Organization selection is not inferred
from entity metadata or URL paths. A plugin that needs to select several
organizations in the same site requires additional selection support in a
future change; it cannot select an entry by its `title`.

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

This helper prepares a request; the consumer chooses the HTTP method and
catalog payload and handles API responses. It must keep the returned headers
on the backend and avoid logging them. See [Consume connections](../03-consuming-connections.md)
for a complete plugin registration example.

## First consumer and adoption gaps

The first concrete adoption target is
[`@datadog/backstage-plugin-datadog-entity-sync-backend`](https://github.com/DataDog/datadog-backstage-plugins/tree/main/plugins/datadog-entity-sync-backend).
Its [Software Catalog client factory](https://github.com/DataDog/datadog-backstage-plugins/blob/main/plugins/datadog-entity-sync-node/src/datadogSoftwareCatalogApi.ts)
currently reads `datadog.integration.apiKey`, `datadog.integration.appKey`, and
`datadog.integration.site`, and constructs the Datadog SDK's `SoftwareCatalogApi`.
Adopting this connection requires an external plugin change to declare
`datadog`, resolve it through the connections service, supply `apiKey` as
`apiKeyAuth` and `applicationKey` as `appKeyAuth`, and configure the SDK server
for the resolved API host. Sync schedules, entity filters, and serializers
remain plugin settings. This addition does not switch that external plugin to
connections, and Backstage has no legacy Datadog integration conversion.
The example apps' `app.datadogRum` settings configure browser Real User
Monitoring (RUM) with a client token and application ID; those settings are
separate from backend API credentials and are not migrated.

The [Roadie Datadog frontend plugin](https://github.com/RoadieHQ/roadie-backstage-plugins/tree/main/plugins/frontend/backstage-plugin-datadog)
embeds shared dashboards and graphs using URLs and annotation values. Those
public embeds are not authenticated Datadog API consumers and do not justify a
`none` authentication method or sending API keys to the browser.
