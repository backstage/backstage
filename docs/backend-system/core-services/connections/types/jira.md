---
id: jira
title: Jira connections
description: Configure and consume Jira connections
---

Use a `jira` connection for a Cloud site or Data Center installation, preserving an independent API gateway when required.

## Configuring

```yaml title="app-config.yaml"
connections:
  - type: jira
    deployment: cloud
    baseUrl: https://example.atlassian.net/
    apiBaseUrl: https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000/
    auth:
      - method: apiToken
        email: reader@example.com
        token: ${JIRA_API_TOKEN}
```

`deployment` is required: `cloud` or `datacenter`. `baseUrl` is the site root,
including a Data Center installation path such as `/jira/`. Optional `apiBaseUrl`
is an independent API root. Keep `/rest` out of both roots; consumers append the
appropriate REST path. HTTP and HTTPS are accepted; use HTTPS across untrusted
networks.

Scoped Cloud tokens require an explicit gateway root of the form
`https://api.atlassian.com/ex/jira/<cloudId>/`. The connection cannot infer the
cloud ID or token scopes. For non-scoped Cloud tokens and Data Center, consumers
can use `baseUrl` when no API override is configured. The gateway does not become
a lookup alias for the site.

Cloud's `apiToken` method requires a valid `email` and a nonempty token without
whitespace; send them with HTTP Basic authentication. Data Center's `pat` method
requires a token and sends Bearer authentication. The service rejects either
method with the wrong deployment, including plugin-scoped entries. `none` is
available for explicitly permitted public reads. See [Cloud Basic authentication](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/)
and [Data Center PATs](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html).

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

export async function readJiraProfile(
  connections: ConnectionsService,
  siteUrl: string,
) {
  const connection = await connections.find({
    type: 'jira',
    query: { url: siteUrl },
    authMethods: ['apiToken', 'pat'],
  });
  const version = connection.deployment === 'cloud' ? '3' : '2';
  const url = new URL(
    `rest/api/${version}/myself`,
    connection.apiBaseUrl ?? connection.baseUrl,
  );
  const authorization =
    connection.auth.method === 'apiToken'
      ? `Basic ${Buffer.from(
          `${connection.auth.email}:${connection.auth.token}`,
        ).toString('base64')}`
      : `Bearer ${connection.auth.token}`;
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: authorization },
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
