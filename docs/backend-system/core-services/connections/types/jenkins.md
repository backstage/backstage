---
id: jenkins
title: Jenkins connections
description: Configure and consume Jenkins connections
---

Use the `jenkins` connection type to configure access to a Jenkins controller.
You can configure multiple controllers
([multiton cardinality](../01-concepts.md#cardinality)), each matched by its host
using the `host` [lookup strategy](../01-concepts.md#lookup-strategies).

## Configure Jenkins

Replace the dummy credentials in this example with environment variables such as
`${JENKINS_USERNAME}` and `${JENKINS_API_TOKEN}` to keep credentials out of the
configuration file.

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

Use HTTPS for remote controllers to protect credentials in transit. Set the base
URL to the controller's root, without a job path or `/api/json`, so plugins can
build URLs for different jobs. Include any
[context path](https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/#context-path),
such as `/jenkins`. Dropping that prefix sends requests to the wrong path.

The base URL must not contain credentials, a query or a fragment, including a
bare `?` or `#` suffix. Percent-encoded path characters are accepted. URLs with
and without a trailing slash are accepted and preserved.

## Authentication methods

| Method     | Field      | Type     | Required | Description                                         |
| ---------- | ---------- | -------- | -------- | --------------------------------------------------- |
| `apiToken` | `username` | `string` | Yes      | Non-empty Jenkins username, without a colon.        |
| `apiToken` | `apiToken` | `string` | Yes      | Non-empty API token belonging to that Jenkins user. |
| `none`     |            |          |          | Explicitly configured anonymous access.             |

Jenkins [scripted clients](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/)
use HTTP Basic authentication with a username and API token. Use the API token
as the Basic password. Bearer tokens, job-specific build trigger tokens and
account passwords are not supported by this connection type.

Send `Authorization: Basic <base64(username:apiToken)>` on the first request.
For requests that require authentication, Jenkins rejects an unauthenticated
request instead of asking the client for credentials. Usernames containing a
colon are rejected because Basic uses that character to separate the username
and token.

Configure `none` explicitly to send requests without credentials. The controller
must allow anonymous access to the requested resource. Failed authentication
does not cause the service to retry anonymously.

```yaml title="app-config.yaml"
connections:
  - type: jenkins
    host: public-ci.example.com
    baseUrl: https://public-ci.example.com/jenkins/
    auth:
      - method: none
```

## Lookup and selection

Build requests from the returned `baseUrl` so they use the configured controller
URL. The service matches `query.url` by host, including non-default ports, and
ignores the scheme and path. A URL outside `/jenkins` on the same host still
selects this connection, so check any user-supplied job URL before sending
credentials to it.

Give each controller a distinct host name or port. Configuration rejects
duplicate hosts even when the controllers have different context paths, because
host lookup cannot distinguish them.

Use [plugin-scoped entries](../01-concepts.md#plugin-scoping) to give a plugin
its own credentials. The service places those entries before unrestricted ones,
then selects the first entry visible to the plugin. Configuration order decides
between entries with the same scope.

Plugins must list the authentication methods they support. The service checks
this list after selecting an entry, so an unsupported method causes an error
even if a later entry would be supported. The service returns credentials;
the plugin makes the HTTP request and handles authentication errors.

## Consume a Jenkins connection

Pass the backend's injected `ConnectionsService` to this function. The lookup
returns `Connection<'jenkins', 'apiToken'>`, so the plugin can read the username
and API token with their types checked. The URL construction keeps the context
path for base URLs ending in either `/jenkins` or `/jenkins/`.

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
relative to controller, job and build URLs. The plugin using the connection
still needs to choose the job and folder, construct the API request and handle
the response. The Jenkins user needs permission for the requested operation.

## Existing Jenkins plugin configuration

Adding a connection does not reconfigure installed Jenkins plugins.
[`@backstage-community/plugin-jenkins-backend`](https://github.com/backstage/community-plugins/blob/main/workspaces/jenkins/plugins/jenkins-backend/README.md)
reads its own `jenkins` configuration with `baseUrl`, `username` and `apiKey`,
including named instances. The connection's `apiToken` holds the user's API
token that this plugin calls its API key. Job annotations, instance names,
project limits and request headers are still plugin settings. Named instances
and entity base URL overrides do not use this connection type's host lookup.

The community
[Jenkins scaffolder module](https://github.com/backstage/community-plugins/blob/main/workspaces/jenkins/plugins/scaffolder-backend-module-jenkins/README.md)
also reads `baseUrl`, `username` and `apiKey` for job actions. Keep the
configuration required by each installed plugin; this repository does not
automatically convert their `jenkins` configuration into connections.

Return to the [built-in connection types](../04-built-in-connection-types.md).
