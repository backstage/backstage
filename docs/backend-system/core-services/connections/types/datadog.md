---
id: datadog
title: Datadog connections
description: Configure regional Datadog API connections with API and application keys
---

Use a `datadog` connection to give a backend plugin the keys it needs to call a
regional Datadog API. Plugins find connections by their `host`, so configure a
separate connection for each API hostname.

## Configuring

Configure keys for the backend plugin that will call Datadog. This example
provides US1 credentials to an illustrative `example-plugin` backend plugin:

```yaml title="app-config.yaml"
connections:
  - type: datadog
    title: Datadog US1
    host: api.datadoghq.com
    auth:
      - method: apiKey
        title: Catalog reader
        match:
          plugins: [example-plugin]
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
for catalog API calls. Both must be nonempty and contain no whitespace.

Some Datadog endpoints, such as telemetry submission, need only an API key.
This connection type still requires both keys. It does not support OAuth or
renew keys automatically, and there is no `none` authentication method. The
plugin uses the configured keys.

The application key needs permission to call each endpoint the plugin uses.
Datadog's [API authentication guide](https://docs.datadoghq.com/api/latest/authentication/)
explains the key pair, and its [role permissions reference](https://docs.datadoghq.com/account_management/rbac/permissions/)
describes catalog read and write permissions. For automation, prefer an
application key owned by a service account and grant only the permissions the
plugin needs. Configuration validation does not contact Datadog or check key
ownership and permissions, so a configuration that loads successfully can still
fail when the plugin makes a request.

### Several organisations in one site

Several Datadog organisations can share one regional API hostname. Since only
one connection is allowed per hostname, put their key pairs in separate
authentication entries and use [plugin scoping](../02-configuring-connections.md#select-a-credential-for-a-plugin)
to give each plugin the pair it needs.

The connection service uses the [first visible authentication entry](../01-concepts.md#what-happens-during-find).
Entity metadata, URL paths and an entry's `title` do not select an organisation.
A plugin cannot use this lookup to choose between several organisations in the
same site.

## Consuming

Follow the [backend plugin setup](../03-consuming-connections.md#declare-and-resolve-the-connection)
to declare `datadog` and request `connectionsServiceRef`. To use the
configuration above, call the helper from `example-plugin`.

Pass an API URL in `query.url`, such as
`https://api.datadoghq.com/api/v2/catalog/entity`. The service uses
[host-based lookup](../03-consuming-connections.md#look-up-a-host-based-connection).
Use the API host for the right site: browser hosts such as `app.datadoghq.com`,
SDK site parameters, dashboard URLs and entity annotations are not translated
into API hosts. The hostname must be configured in lowercase; the schema
rejects uppercase values rather than changing them.

This helper reads the first page of
[Software Catalog entities](https://docs.datadoghq.com/api/latest/software-catalog/get-a-list-of-entities/).
It builds the HTTPS request from the resolved host and sends each key in the
header Datadog expects:

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readDatadogCatalogPage(
  connections: ConnectionsService,
  apiUrl: string,
) {
  const connection = await connections.find({
    type: 'datadog',
    query: { url: apiUrl },
    authMethods: ['apiKey'],
  });

  const response = await fetch(
    `https://${connection.host}/api/v2/catalog/entity`,
    {
      headers: {
        'DD-API-KEY': connection.auth.apiKey,
        'DD-APPLICATION-KEY': connection.auth.applicationKey,
        Accept: 'application/json',
      },
    },
  );
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

A successful response returns the page as parsed JSON. The helper throws on a
failed HTTP response; callers can inspect `ResponseError.statusCode` to handle
an API error. Network failures and invalid JSON also reject the call.
For an authentication or permission failure, check both keys, their organisation
and the application key's permissions. The helper reads one page; use the API's
pagination parameters when you need more results.

See [lookup errors](../03-consuming-connections.md#handle-lookup-errors) for
failures before an HTTP request, and keep keys and request headers on the
backend as described in [credential handling](../03-consuming-connections.md#keep-connection-data-on-the-backend).
