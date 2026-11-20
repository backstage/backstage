---
id: jira
title: Jira connections
description: Configure and consume Jira connections
---

Use a `jira` connection to access a Jira Cloud site or Data Center installation.
Cloud API requests can use a separate gateway address when the token requires it.

## Configuring

### Configure credentials for your deployment

Set `deployment` to `cloud` or `datacenter`. For Cloud, create an API token and
configure it with the account's email using `apiToken`, following the
[Cloud Basic authentication guide](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/).
For Data Center, create a
[personal access token](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)
and use `pat`. Both token methods require a nonempty token without whitespace;
`apiToken` also requires a valid email address.

Cloud requests send the email and token with HTTP Basic authentication. Data
Center requests send the personal access token as a Bearer token. The service
rejects a method for the wrong deployment, including plugin-scoped credentials.
Use `none` only for public reads that your Jira installation permits.

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

### Choose the site and API addresses

Set `baseUrl` to the site root, such as `https://example.atlassian.net/`. For Data
Center, include the installation path, such as `/jira/`. Keep `/rest` out of both
`baseUrl` and `apiBaseUrl`; the consumer appends the REST path for your deployment.
Both addresses accept HTTP or HTTPS without credentials, queries or fragments.
Use HTTPS across untrusted networks. Paths and encoded characters are preserved,
and a trailing slash keeps relative REST routes under the installation root.

Scoped Cloud tokens need `apiBaseUrl` set to
`https://api.atlassian.com/ex/jira/<cloudId>/`, using your site's cloud ID.
The YAML example shows that gateway form. You must supply the cloud ID and
choose the address for your token's scopes; the connection cannot determine
them from the site URL. For non-scoped Cloud tokens or Data Center, you can
leave it out when the backend uses the same address as the site.

Lookup uses the site's host and non-default port from `baseUrl`. The gateway
address does not identify the site, and different installation paths on one host
cannot have separate connections. Use
[plugin scoping](../01-concepts.md#plugin-scoping) if plugins need different
credentials for the same site.

## Consuming

### Read the authenticated user's profile

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and pass the Jira site URL to lookup, even when requests go through a Cloud
gateway. The example requests both supported token methods, uses Basic or Bearer
authentication to match the selected credential, and chooses REST API version 3
for Cloud or version 2 for Data Center.

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

With the gateway in the configuration, the request goes to
`https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000/rest/api/3/myself`.
Without an override, a Cloud site uses
`https://example.atlassian.net/rest/api/3/myself`. Append REST paths without a
leading slash to retain a Data Center installation path or Cloud gateway prefix.

Jira checks the token's validity, scopes and permissions. The example rejects
redirects and checks the response before reading JSON. Keep the email and token
in your backend, following the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend).
