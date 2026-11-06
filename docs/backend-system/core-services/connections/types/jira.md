---
id: jira
title: Jira connections
description: Configure and consume Jira Cloud and Data Center connections
---

The `jira` connection type represents a Jira Cloud site or Data Center
installation. It has [multiton cardinality](../01-concepts.md#cardinality)
and uses the `host` [lookup strategy](../01-concepts.md#lookup-strategies).

## Configuring

### Connect to Cloud or Data Center

Choose the entry for your deployment and replace the dummy credentials and
Cloud ID with your own values. Load real tokens through environment substitution
such as `${JIRA_API_TOKEN}`. The Cloud example uses a separate API root because
scoped tokens must go through the gateway, while lookup still uses the site
host. The Data Center example includes an installation context path.

```yaml title="app-config.yaml"
connections:
  - type: jira
    host: example.atlassian.net
    deployment: cloud
    baseUrl: https://example.atlassian.net/
    # Required when using scoped Cloud API tokens:
    apiBaseUrl: https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000/
    auth:
      - method: apiToken
        email: reader@example.com
        token: dummy-cloud-api-token

  - type: jira
    host: jira.example.com:8443
    deployment: datacenter
    baseUrl: https://jira.example.com:8443/jira/
    auth:
      - method: pat
        token: dummy-datacenter-personal-access-token
```

### Connection fields

| Field        | Type                      | Required | Description                                                                                                                         |
| ------------ | ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `host`       | `string`                  | Yes      | Site host, including a non-default port when present. Must equal the parsed host of `baseUrl`.                                      |
| `deployment` | `'cloud' \| 'datacenter'` | Yes      | Identifies Cloud or Data Center so validation can reject credentials meant for the other deployment.                                |
| `baseUrl`    | `string`                  | Yes      | Absolute HTTP(S) site root, including any Data Center context path, such as `https://jira.example.com/jira`.                        |
| `apiBaseUrl` | `string`                  | No       | Absolute HTTP(S) API root when different from the site root. Scoped Cloud tokens use `https://api.atlassian.com/ex/jira/<cloudId>`. |

Supply both the site host and site root: the service does not derive one from
the other. The optional API root is returned as configured; it has no default.
When it is absent, the request example below uses the site root.

Both roots must be absolute HTTP(S) URLs without REST API paths. The current
validator rejects any path segment named `rest`, even in an installation context
path. Trailing slashes and percent-encoded path characters are allowed. URL
credentials are rejected; put credentials in the authentication fields instead.
Literal query (`?`) or fragment (`#`) delimiters, including empty suffixes, are
rejected because they would change how request paths are joined.

### Authentication setup

| Method     | Required fields  | Deployment  | Use                                                                      |
| ---------- | ---------------- | ----------- | ------------------------------------------------------------------------ |
| `apiToken` | `email`, `token` | Cloud       | Atlassian account email and API token.                                   |
| `pat`      | `token`          | Data Center | Personal access token from an installation that supports and enables it. |
| `none`     | None             | Either      | Only operations that the installation and endpoint allow anonymously.    |

Store raw tokens, without an authorization scheme or base64 encoding. Emails
must be valid email addresses; tokens must be nonempty and contain no whitespace.
Token length and prefix are not constrained. Configuration validation checks the
format of these fields. It does not contact Jira to check token validity, expiry,
permissions or scopes. Choose permissions and scopes for the operations your
plugin needs.

[Jira Cloud basic authentication](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/)
uses an Atlassian account email and API token, not an account password.
[Scoped Cloud API tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
require the API gateway root containing the site's Cloud ID; tokens without
scopes use the site root. Set `apiBaseUrl` for the kind of token you are using:
the service cannot tell whether a token has scopes by inspecting its value.

[Data Center personal access tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)
are separate credentials sent as Bearer tokens and require a deployment that
supports and enables them. They are not interchangeable with Cloud API tokens.
The schema rejects `pat` for Cloud and `apiToken` for Data Center.

Use `method: none` only for requests that your installation and the endpoint
allow anonymously. The service does not switch to anonymous access if an
authenticated request fails.

This connection type does not support username/password logins, OAuth
authorization flows, token refresh, or signed-in user authentication. Check that
your plugin supports the authentication your installation needs before
configuring a connection.

## Consuming

### Read the authenticated Jira profile

Follow the shared [backend plugin setup](../03-consuming-connections.md#declare-and-resolve-the-connection)
to declare `jira` and obtain the plugin-scoped service. The helper below looks
up the connection by a site URL, requests the authenticated profile and returns
the JSON response. It accepts `apiToken` and `pat` because this endpoint requires
authentication.

Look up the Jira site, not the shared `api.atlassian.com` gateway: the Cloud ID
in the API path does not identify a connection for host-based lookup. See
[host-based lookup](../03-consuming-connections.md#look-up-a-host-based-connection)
and [authentication selection](../01-concepts.md#what-happens-during-find). Jira
has no extra selection rules; use [plugin scoping](../01-concepts.md#plugin-scoping)
to provide credentials your plugin supports.

Only one Jira connection per host is supported, including a non-default port.
Installations under different context paths on the same host cannot have separate
connections. Paths and projects do not participate in lookup.

The example uses the configured URLs directly. Its base URL must end with a
slash so a relative REST path keeps the Cloud gateway's Cloud ID or the Data
Center context path. Connections accept roots with or without a trailing slash
and return them unchanged; this is a prerequisite for this example only. A
leading slash in the request path would discard the configured prefix.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readJiraProfile(
  connections: ConnectionsService,
  siteUrl: string,
): Promise<unknown> {
  const connection = await connections.find({
    type: 'jira',
    query: { url: siteUrl },
    authMethods: ['apiToken', 'pat'],
  });
  const root = connection.apiBaseUrl ?? connection.baseUrl;
  const version = connection.deployment === 'cloud' ? '3' : '2';
  // The example base URL ends with / so new URL() preserves the context path.
  const url = new URL(`rest/api/${version}/myself`, root);
  const auth = connection.auth;
  const authorization =
    auth.method === 'apiToken'
      ? `Basic ${Buffer.from(`${auth.email}:${auth.token}`).toString('base64')}`
      : `Bearer ${auth.token}`;
  const response = await fetch(url, {
    headers: { Authorization: authorization, Accept: 'application/json' },
    redirect: 'error',
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

Pass a site URL such as `https://example.atlassian.net/browse/EXAMPLE-1`, even
when the resolved API root uses another host. The helper appends the platform
REST path once: Cloud uses version 3 and Data Center uses version 2. Other Jira
APIs may use different paths or authentication.

Cloud requests use Basic authentication with the email and raw API token; Data
Center requests use the raw PAT as a Bearer token. The helper checks HTTP status
before reading JSON. The caller handles lookup failures and Jira response
errors; see [lookup error handling](../03-consuming-connections.md#handle-lookup-errors).
Resolving a connection does not contact Jira or check that credentials work.

Keep requests on the configured API root, reject redirects to another host and
[keep connection data on the backend](../03-consuming-connections.md#keep-connection-data-on-the-backend).

Return to the [built-in connection type index](../04-built-in-connection-types.md).
