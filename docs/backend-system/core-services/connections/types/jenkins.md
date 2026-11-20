---
id: jenkins
title: Jenkins connections
description: Configure and consume Jenkins connections
---

Use a `jenkins` connection to access a controller with an API token or explicit anonymous access.

## Configuring

```yaml title="app-config.yaml"
connections:
  - type: jenkins
    baseUrl: https://ci.example.com/jenkins/
    auth:
      - method: apiToken
        username: backstage-bot
        apiToken: ${JENKINS_API_TOKEN}
```

Include the controller's [context path](https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/#context-path)
in `baseUrl`. Optional `apiBaseUrl` is a separate controller root for backend
requests, with the same path convention. It stays unset when omitted; consumers
use `baseUrl`. Both HTTP and HTTPS are accepted. Use HTTPS across untrusted
networks to protect credentials.

The `apiToken` method requires a nonempty username without colons and a nonempty
API token. Send them as HTTP Basic credentials; this is not a Bearer token.
The `none` method allows explicitly configured anonymous reads where Jenkins
permissions permit them. API-token-authenticated requests do not require a crumb
on supported Jenkins versions; other authentication methods and CSRF workflows
are outside this connection type. See [authenticating scripted clients](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/).

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

export async function readJenkinsJob(
  connections: ConnectionsService,
  controllerUrl: string,
) {
  const connection = await connections.find({
    type: 'jenkins',
    query: { url: controllerUrl },
    authMethods: ['apiToken', 'none'],
  });
  const headers: Record<string, string> = {};
  if (connection.auth.method === 'apiToken') {
    headers.Authorization = `Basic ${Buffer.from(
      `${connection.auth.username}:${connection.auth.apiToken}`,
    ).toString('base64')}`;
  }
  const url = new URL(
    'job/example/api/json',
    connection.apiBaseUrl ?? connection.baseUrl,
  );
  const response = await fetch(url, { redirect: 'error', headers });
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
