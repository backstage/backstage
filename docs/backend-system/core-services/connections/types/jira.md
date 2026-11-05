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
| `deployment` | `'cloud' \| 'datacenter'` | Yes      | Selects the supported credential contract.                                                                                          |
| `baseUrl`    | `string`                  | Yes      | Absolute HTTP(S) site root, including any Data Center context path, such as `https://jira.example.com/jira`.                        |
| `apiBaseUrl` | `string`                  | No       | Absolute HTTP(S) API root when different from the site root. Scoped Cloud tokens use `https://api.atlassian.com/ex/jira/<cloudId>`. |

Both roots exclude `/rest` and API version paths. Trailing slashes are allowed.
Credentials and literal query (`?`) or fragment (`#`) delimiters in these URLs
are rejected, including empty suffixes. Percent-encoded path characters are
allowed. API
consumers append `rest/api/3/...` for Cloud or `rest/api/2/...` for Data Center,
preserving the configured prefix. API version selection remains the consumer's
responsibility; other Jira APIs can use different REST paths.

## Authentication methods

| Method     | Fields           | Deployment  | Consumer behavior                                                        |
| ---------- | ---------------- | ----------- | ------------------------------------------------------------------------ |
| `apiToken` | `email`, `token` | Cloud       | Send `Authorization: Basic <base64(email:token)>`.                       |
| `pat`      | `token`          | Data Center | Send `Authorization: Bearer <token>`.                                    |
| `none`     | None             | Either      | Send no authorization header. Only use operations permitted anonymously. |

Store raw tokens, without an authorization scheme or base64 encoding. Emails
must be valid email addresses; tokens must be nonempty and contain no whitespace.
Token length and prefix are not constrained. The schema checks configuration,
not remote token validity, permissions, expiration, or required scopes.

[Jira Cloud basic authentication](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/)
uses an Atlassian account email and API token, not an account password.
[Scoped Cloud API tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
require the API gateway root containing the site's Cloud ID; tokens without
scopes use the site root. Configure `apiBaseUrl` accordingly. The connection cannot infer
whether a token has scopes from its value.

[Data Center personal access tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)
are separate credentials sent as Bearer tokens and require a deployment that
supports and enables them. They are not interchangeable with Cloud API tokens.
The schema rejects `pat` for Cloud and `apiToken` for Data Center.

Anonymous access must be explicitly configured with `method: none` and is
limited by the installation's permissions and each endpoint's support for
anonymous requests. There is no automatic anonymous fallback. Username/password,
OAuth authorization flows, token refresh, and signed-in user authentication are
not provided by this connection type. Consumers needing those mechanisms require
follow-up support.

## Lookup and selection

Supply a URL on the Jira **site** host, such as
`https://example.atlassian.net/browse/EXAMPLE-1`. The service matches its parsed
host exactly, including a non-default port, against `host`. Do not look up a
Cloud connection using its `api.atlassian.com` gateway URL: many independent
sites share that API host.

The service selects the first authentication entry visible to the calling
plugin, with [plugin-scoped entries](../01-concepts.md#plugin-scoping)
ahead of unrestricted entries. The selected method must be in the consumer's
`authMethods` list; the service does not retry with another method. This type has
no additional authentication priority rules.

Only one Jira connection per host is supported. Two Data Center installations
under different context paths on the same host cannot have separate connections.
Lookup matches neither paths nor projects and is not a path authorization check.
Consumers should construct API requests from the resolved root rather than
forwarding credentials to arbitrary URLs from a lookup query or following
redirects to another host.

## Consume a Jira connection

This backend plugin example declares the connection and constructs a request
using the returned static credentials. The relative REST path preserves both
`/ex/jira/<cloudId>` and Data Center context prefixes. The example calls an
authenticated endpoint, so it intentionally accepts only `apiToken` and `pat`.

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

The connection service returns credentials without contacting Jira or preparing
HTTP headers. Consumers handle API errors and must support the selected
authentication method.

## Consumer adoption

The first concrete backend adoption candidate is
[`@axis-backstage/plugin-jira-dashboard-backend`](https://github.com/AxisCommunications/backstage-plugins/blob/main/plugins/jira-dashboard-backend/README.md).
It currently reads `jiraDashboard` configuration, accepts a complete authorization
header in `token`, and supports separate site and scoped-token API URLs. Adoption
requires declaring and resolving `jira` connections, constructing headers from
raw credentials, and adapting its API-version-inclusive URLs to these roots.
Its project annotations, instance names, API version, caches, and JQL remain
plugin settings. A shared connection does not migrate those settings.

[`@roadiehq/backstage-plugin-jira`](https://github.com/RoadieHQ/roadie-backstage-plugins/blob/main/plugins/frontend/backstage-plugin-jira/README.md)
uses a backend proxy with an authorization header. It needs a backend consumer
before it can use this service; credentials must remain in the backend. Activity
streams and other non-platform APIs also need endpoint-specific authentication
and gateway compatibility checks during adoption.

These external plugins are not migrated by adding this type. There is no legacy
`integrations.jira` configuration in this repository to convert.

Return to the [built-in connection type index](../04-built-in-connection-types.md).
