---
id: jira
title: Jira connections
description: Configure and consume Jira Cloud and Data Center connections
---

The `jira` connection type represents a Jira Cloud site or Data Center
installation. It has [multiton cardinality](../01-concepts.md#cardinality)
and uses the `host` [lookup strategy](../01-concepts.md#lookup-strategies).

## Configure Jira

This example uses dummy credentials and a dummy Cloud ID. Replace them with
values for your installation, and load real tokens through environment
substitution such as `${JIRA_API_TOKEN}`.

```yaml title="app-config.yaml"
connections:
  - type: jira
    host: example.atlassian.net
    deployment: cloud
    baseUrl: https://example.atlassian.net
    # Required when using scoped Cloud API tokens:
    apiBaseUrl: https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000
    auth:
      - method: apiToken
        email: reader@example.com
        token: dummy-cloud-api-token

  - type: jira
    host: jira.example.com:8443
    deployment: datacenter
    baseUrl: https://jira.example.com:8443/jira
    auth:
      - method: pat
        token: dummy-datacenter-personal-access-token
```

## Connection fields

| Field        | Type                      | Required | Description                                                                                                                         |
| ------------ | ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `host`       | `string`                  | Yes      | Site host, including a non-default port when present. Must equal the parsed host of `baseUrl`.                                      |
| `deployment` | `'cloud' \| 'datacenter'` | Yes      | Identifies Cloud or Data Center so validation can reject credentials meant for the other deployment.                                |
| `baseUrl`    | `string`                  | Yes      | Absolute HTTP(S) site root, including any Data Center context path, such as `https://jira.example.com/jira`.                        |
| `apiBaseUrl` | `string`                  | No       | Absolute HTTP(S) API root when different from the site root. Scoped Cloud tokens use `https://api.atlassian.com/ex/jira/<cloudId>`. |

Plugins append the REST API path to the configured root, so both roots must
exclude `/rest` and API version paths. Append `rest/api/3/...` for Cloud or
`rest/api/2/...` for Data Center while keeping the configured prefix. The plugin
chooses the API version; other Jira APIs can use different REST paths.

Trailing slashes and percent-encoded path characters are allowed. URLs with
credentials or literal query (`?`) or fragment (`#`) delimiters are rejected,
including empty suffixes. A query or fragment would change how the request path
is appended to the root.

## Authentication methods

| Method     | Fields           | Deployment  | Consumer behavior                                                        |
| ---------- | ---------------- | ----------- | ------------------------------------------------------------------------ |
| `apiToken` | `email`, `token` | Cloud       | Send `Authorization: Basic <base64(email:token)>`.                       |
| `pat`      | `token`          | Data Center | Send `Authorization: Bearer <token>`.                                    |
| `none`     | None             | Either      | Send no authorization header. Only use operations permitted anonymously. |

Store raw tokens, without an authorization scheme or base64 encoding. Emails
must be valid email addresses; tokens must be nonempty and contain no whitespace.
Token length and prefix are not constrained. Configuration validation checks the
format of these fields. It does not contact Jira to check whether a token is valid, has expired, or has the permissions and
scopes needed for a request.

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

## Lookup and selection

Supply a URL on the Jira **site** host, such as
`https://example.atlassian.net/browse/EXAMPLE-1`. The service matches its parsed
host exactly, including a non-default port, against `host`. Do not look up a
Cloud connection using its `api.atlassian.com` gateway URL: many independent
sites share that API host.

The service selects the first authentication entry visible to the calling
plugin, with [plugin-scoped entries](../01-concepts.md#plugin-scoping)
ahead of unrestricted entries. The selected method must be in the consumer's
`authMethods` list; the service does not retry with another method. Set the
entry order and plugin scoping so the selected method is one your plugin
supports. Jira connections have no other authentication priority rules.

Only one Jira connection per host is supported. Two Data Center installations
under different context paths on the same host cannot have separate connections.
Lookup does not match paths or projects, so a matching host does not restrict
which paths a plugin can request. Build requests from the resolved root to keep
credentials going to the configured endpoint. Do not forward credentials to
arbitrary URLs from a lookup query or follow redirects to another host.

## Consume a Jira connection

This backend plugin declares the connection and uses its credentials to make a
request. Use a relative REST path so the request keeps `/ex/jira/<cloudId>` or
the Data Center context prefix. The endpoint requires authentication, so the
example accepts only `apiToken` and `pat`.

```ts
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import {
  connectionsServiceRef,
  declareConnection,
} from '@backstage/backend-plugin-api/alpha';

export const examplePlugin = createBackendPlugin({
  pluginId: 'jira-example',
  register(reg) {
    declareConnection(reg, {
      type: 'jira',
      description: 'Reads Jira account information',
    });
    reg.registerInit({
      deps: { connections: connectionsServiceRef },
      async init({ connections }) {
        const connection = await connections.find({
          type: 'jira',
          query: { url: 'https://example.atlassian.net/browse/EXAMPLE-1' },
          authMethods: ['apiToken', 'pat'],
        });
        const root = connection.apiBaseUrl ?? connection.baseUrl;
        const version = connection.deployment === 'cloud' ? '3' : '2';
        const url = new URL(
          `rest/api/${version}/myself`,
          `${root.replace(/\/$/, '')}/`,
        );
        const auth = connection.auth;
        const authorization =
          auth.method === 'apiToken'
            ? `Basic ${Buffer.from(`${auth.email}:${auth.token}`).toString(
                'base64',
              )}`
            : `Bearer ${auth.token}`;
        const response = await fetch(url, {
          headers: { Authorization: authorization, Accept: 'application/json' },
          redirect: 'error',
        });
        if (!response.ok) {
          throw new Error(`Jira request failed with status ${response.status}`);
        }
      },
    });
  },
});
```

The plugin prepares the HTTP headers and handles API errors. Resolving a
connection does not contact Jira or check that the selected credentials work.

## Existing plugin configuration

[`@axis-backstage/plugin-jira-dashboard-backend`](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard-backend/README.md)
reads `jiraDashboard` configuration, accepts a complete authorization header
in `token`, and supports separate site and scoped-token API URLs. Its URLs
include the REST API version. These settings differ from `jira` connections,
which use raw credentials and roots without REST API paths. Project annotations,
instance names, API version, caches, and JQL remain plugin settings.

[`@roadiehq/backstage-plugin-jira`](https://github.com/RoadieHQ/roadie-backstage-plugins/blob/main/plugins/frontend/backstage-plugin-jira/README.md)
uses a backend proxy with an authorization header. Keep credentials in the
backend; this backend service cannot supply them to a frontend plugin. Check
authentication and gateway support separately for activity streams and other
Jira APIs before using the platform REST example with those endpoints.

Adding this connection type does not change these plugins' configuration. There
is no legacy `integrations.jira` configuration in this repository to convert.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
