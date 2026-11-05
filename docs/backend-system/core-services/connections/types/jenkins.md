---
id: jenkins
title: Jenkins connections
description: Configure and consume Jenkins connections
---

The `jenkins` connection type represents a Jenkins controller. It has
[multiton cardinality](../01-concepts.md#cardinality) and uses the `host`
[lookup strategy](../01-concepts.md#lookup-strategies).

## Configure Jenkins

This example uses dummy credentials. Supply real credentials through environment
variables such as `${JENKINS_USERNAME}` and `${JENKINS_API_TOKEN}`.

```yaml title="app-config.yaml"
connections:
  - type: jenkins
    host: ci.example.com:8443
    baseUrl: https://ci.example.com:8443/jenkins
    auth:
      - method: apiToken
        username: backstage-bot
        apiToken: dummy-api-token
```

## Connection fields

| Field     | Type     | Required | Description                                                                                   |
| --------- | -------- | -------- | --------------------------------------------------------------------------------------------- |
| `host`    | `string` | Yes      | Controller URL host, including any non-default port. Must match the parsed host of `baseUrl`. |
| `baseUrl` | `string` | Yes      | Absolute HTTP or HTTPS controller URL, including its context path.                            |

Use HTTPS for remote controllers. The base URL must not contain credentials,
a query, or a fragment, including a bare `?` or `#` suffix. Percent-encoded
path characters are accepted. Both trailing-slash forms are accepted and preserved.
Do not include a job path or `/api/json` in this URL. Jenkins can run under a
[context path](https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/#context-path)
such as `/jenkins`; consumers must preserve that prefix when building API URLs.

## Authentication methods

| Method     | Field      | Type     | Required | Description                                         |
| ---------- | ---------- | -------- | -------- | --------------------------------------------------- |
| `apiToken` | `username` | `string` | Yes      | Non-empty Jenkins username, without a colon.        |
| `apiToken` | `apiToken` | `string` | Yes      | Non-empty API token belonging to that Jenkins user. |
| `none`     |            |          |          | Explicitly configured anonymous access.             |

Jenkins [scripted clients](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/)
authenticate using HTTP Basic authentication with the username and API token.
Send `Authorization: Basic <base64(username:apiToken)>` on the first request.
The API token is used as the Basic password, not as a bearer token or a
job-specific build trigger token. Account password authentication is outside
this contract. Usernames containing a colon are rejected because Basic uses
that character to separate the username and token.

`none` sends no credentials and requires anonymous permissions on the controller.
It is never a fallback after failed authentication. Configure it explicitly:

```yaml title="app-config.yaml"
connections:
  - type: jenkins
    host: public-ci.example.com
    baseUrl: https://public-ci.example.com/jenkins/
    auth:
      - method: none
```

## Lookup and selection

The service matches `query.url` by its parsed host, including non-default ports.
It does not compare schemes or paths: even a URL outside `/jenkins` on the
configured host selects this connection. Always construct requests from the
returned `baseUrl`, and validate any user-supplied job URL before sending
credentials to it.

Only one Jenkins connection per host can be configured. The configuration
pipeline rejects duplicate hosts even if their base URLs use different context
paths. Controllers on distinct host names or ports can have separate connections.
Path-based controller selection is not available.

The first authentication entry visible to the calling plugin is selected;
[plugin-scoped entries](../01-concepts.md#plugin-scoping) precede unrestricted
entries. Configuration order decides between equally scoped entries. Consumers
must list the methods they support. An unsupported selected method causes an
error; the service does not try another entry. The connection service returns
credentials without making an HTTP request or retrying authentication.

## Consume a Jenkins connection

This backend example accepts the injected `ConnectionsService`. Its return value
is inferred as `Connection<'jenkins', 'apiToken'>`. It uses the same request URL
for base URLs ending in `/jenkins` or `/jenkins/`.

```ts
import type { ConnectionsService } from '@backstage/connections';

async function readExampleJob(connections: ConnectionsService) {
  const connection = await connections.find({
    type: 'jenkins',
    query: { url: 'https://ci.example.com:8443/jenkins/job/example' },
    authMethods: ['apiToken'],
  });

  // A trailing slash and a relative path preserve the controller context path.
  const controllerUrl = `${connection.baseUrl.replace(/\/+$/, '')}/`;
  const url = new URL('job/example/api/json', controllerUrl);
  const credentials = Buffer.from(
    `${connection.auth.username}:${connection.auth.apiToken}`,
    'utf8',
  ).toString('base64');

  return fetch(url, {
    headers: { Authorization: `Basic ${credentials}` },
    redirect: 'error',
  });
}
```

Jenkins exposes its [remote API](https://www.jenkins.io/doc/book/using/remote-access-api/)
relative to controller, job, and build URLs. Job names, folder traversal, API
clients, permissions, and request handling remain consumer responsibilities.

## Consumer adoption

The first concrete consumer is
[`@backstage-community/plugin-jenkins-backend`](https://github.com/backstage/community-plugins/blob/main/workspaces/jenkins/plugins/jenkins-backend/README.md).
It currently reads its own `jenkins` configuration with `baseUrl`, `username`,
and `apiKey`, including named instances. Adoption requires injecting the
connections service, mapping `apiToken` to the client's API key, and retaining
plugin-specific job annotations, instance selection, project limits, and
request-header handling in the plugin. Named instances and entity base URL
overrides cannot be assumed to map directly to host lookup.

The community
[Jenkins scaffolder module](https://github.com/backstage/community-plugins/blob/main/workspaces/jenkins/plugins/scaffolder-backend-module-jenkins/README.md)
also reads `baseUrl`, `username`, and `apiKey` for job actions. It needs a
connection lookup and suitable job permissions before it can consume this type.
Both consumer migrations are follow-up work. Adding a connection does not
reconfigure these plugins, and no automatic conversion from their `jenkins`
configuration is provided in this repository.

Return to the [built-in connection types](../04-built-in-connection-types.md).
