---
id: jenkins
title: Jenkins connections
description: Configure and consume Jenkins connections
---

Use a `jenkins` connection to read a controller's API with a user API token
or anonymous access.

## Configuring

### Configure a Jenkins API token

Create an API token for a Jenkins user with permission to read the jobs your
plugin needs. Follow Jenkins' guide to
[authenticating scripted clients](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/),
then configure the username, token and controller address.

Use `apiToken` with a nonempty username and API token. The username cannot contain
colons because requests send `username:apiToken` with HTTP Basic authentication.
For public reads, configure `none` only when the controller permits anonymous
access. API tokens do not require a crumb on supported Jenkins versions; this
connection does not manage other authentication or CSRF workflows.

```yaml title="app-config.yaml"
connections:
  - type: jenkins
    baseUrl: https://ci.example.com/jenkins/
    auth:
      - method: apiToken
        username: backstage-bot
        apiToken: ${JENKINS_API_TOKEN}
```

### Choose the controller address

Include the controller's
[context path](https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/#context-path)
in `baseUrl`, such as `https://ci.example.com/jenkins/`. If your backend uses an
internal address, set `apiBaseUrl` to that controller root, including its context
path. Leave job routes and `api/json` out of both roots. Without an override,
the consumer uses `baseUrl`.

Both roots accept HTTP and HTTPS without credentials, queries or fragments.
Use HTTPS when sending credentials across untrusted networks. The connection
keeps paths and encoded characters and adds a trailing slash, allowing the
consumer to append a job route without losing `/jenkins/`.

The host and non-default port of `baseUrl` identify the controller during lookup.
The API override is only a request address. Controllers under different paths on
one host cannot have separate connections; use
[plugin scoping](../01-concepts.md#plugin-scoping) when plugins need different
credentials for one controller.

## Consuming

### Read a job

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and look up the controller URL. This example supports both `apiToken` and `none`:
it sends Basic credentials only when the selected method is `apiToken`.

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

With this configuration, the example reads
`https://ci.example.com/jenkins/job/example/api/json`. Keep the job route relative
to preserve the controller's context path.

Jenkins decides whether the selected user or anonymous caller can read the job.
Check failed responses before reading JSON and reject redirects when sending
credentials, as the example does. See the shared
[credential-handling guidance](../03-consuming-connections.md#keep-connection-data-on-the-backend)
for keeping the API token in your backend.
