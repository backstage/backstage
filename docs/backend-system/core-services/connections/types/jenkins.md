---
id: jenkins
title: Jenkins connections
description: Configure and consume Jenkins connections
---

Use the `jenkins` connection type to configure access to a Jenkins controller.

## Configuring

### Configure access to a controller

Create an API token for the Jenkins user that will access the controller. Give
that user permission for the operations your plugins need, such as reading jobs.
See the Jenkins [scripted client authentication guide](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/)
for token setup.

Replace the dummy credentials below with environment variables such as
`${JENKINS_USERNAME}` and `${JENKINS_API_TOKEN}` to keep credentials out of the
configuration file.

```yaml title="app-config.yaml"
connections:
  - type: jenkins
    host: ci.example.com:8443
    baseUrl: https://ci.example.com:8443/jenkins/
    auth:
      - method: apiToken
        username: backstage-bot
        apiToken: dummy-api-token
```

### Controller address

| Field     | Type     | Required | Description                                                                                    |
| --------- | -------- | -------- | ---------------------------------------------------------------------------------------------- |
| `host`    | `string` | Yes      | Host used for lookup, including any non-default port. Must match the parsed host of `baseUrl`. |
| `baseUrl` | `string` | Yes      | Absolute HTTP or HTTPS controller URL, including its context path.                             |

Set both fields explicitly; the connection does not derive a URL from the host.
The hosts must match, so a public lookup host cannot be paired with an internal
API address on a different host. Each controller needs a distinct host name or
port. Duplicate hosts are rejected even when their context paths differ, because
[host lookup](../01-concepts.md#lookup-strategies) cannot distinguish them.

Use HTTPS for remote controllers to protect credentials in transit. Set the base
URL to the controller's root, without a job path or `/api/json`, so plugins can
build URLs for different jobs. Include any
[context path](https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/#context-path),
such as `/jenkins`. Dropping that prefix sends requests to the wrong path.

The base URL must not contain credentials, a query or a fragment, including a
bare `?` or `#` suffix. Percent-encoded path characters are accepted. URLs with
and without a trailing slash are accepted and preserved. The consumer example
below uses a trailing slash to keep relative paths under `/jenkins/`.

### Authentication

| Method     | Field      | Type     | Required | Description                                         |
| ---------- | ---------- | -------- | -------- | --------------------------------------------------- |
| `apiToken` | `username` | `string` | Yes      | Non-empty Jenkins username, without a colon.        |
| `apiToken` | `apiToken` | `string` | Yes      | Non-empty API token belonging to that Jenkins user. |
| `none`     |            |          |          | Explicitly configured anonymous access.             |

Use the user's API token. Bearer tokens, job-specific build trigger tokens and
account passwords are not supported by this connection type. Usernames cannot
contain a colon because HTTP Basic authentication uses it to separate the
username and token.

For a controller that allows anonymous access to the requested jobs, configure
`none` explicitly:

```yaml title="app-config.yaml"
connections:
  - type: jenkins
    host: public-ci.example.com
    baseUrl: https://public-ci.example.com/jenkins/
    auth:
      - method: none
```

Failed authentication never triggers an anonymous retry. To give different
plugins their own credentials, use [plugin scoping](../01-concepts.md#plugin-scoping).
See [authentication selection](../01-concepts.md#what-happens-during-find) for
entry ordering and the supported-method check.

## Consuming

### Read a job

Follow the [backend plugin setup guide](../03-consuming-connections.md#get-started-with-a-backend-plugin)
to declare the connection and obtain the plugin's `ConnectionsService`. Keep
resolved credentials on the backend as described in
[credential handling](../03-consuming-connections.md#keep-connection-data-on-the-backend).

The function below reads one job through the Jenkins
[remote API](https://www.jenkins.io/doc/book/using/remote-access-api/). It supports
both configured authentication methods and checks the response before reading
JSON, so a failed request reaches the caller as an error.

Jenkins requires the username and API token together as HTTP Basic credentials
on the first request. For requests that require authentication, it rejects an
unauthenticated request instead of asking the client for credentials. Use the
API token as the Basic password.

Build requests from the returned `baseUrl`. Host lookup ignores the scheme and
path, so a URL outside `/jenkins` on the same host still selects the connection.
Check any user-supplied job URL before sending credentials to it.

This example assumes the configured base URL ends in `/jenkins/` so the relative
job path stays under that prefix. Connections also accept base URLs without a
trailing slash; the service does not add one.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

async function readExampleJob(connections: ConnectionsService) {
  const connection = await connections.find({
    type: 'jenkins',
    query: { url: 'https://ci.example.com:8443/jenkins/job/example' },
    authMethods: ['apiToken', 'none'],
  });

  // The example base URL ends with / so new URL() preserves the context path.
  const url = new URL('job/example/api/json', connection.baseUrl);
  const headers = new Headers();
  if (connection.auth.method === 'apiToken') {
    const credentials = Buffer.from(
      `${connection.auth.username}:${connection.auth.apiToken}`,
      'utf8',
    ).toString('base64');
    headers.set('Authorization', `Basic ${credentials}`);
  }

  const response = await fetch(url, { headers, redirect: 'error' });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

For errors raised before an HTTP request is made, see
[lookup errors](../03-consuming-connections.md#handle-lookup-errors).

Return to the [built-in connection types](../04-built-in-connection-types.md).
