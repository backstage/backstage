---
id: consuming-connections
title: Consume connections
description: Declare and look up connections from a Backstage backend plugin
---

A backend plugin consumes a connection by adding a
[connection declaration](./concepts.md#connection-declaration), requesting the
plugin-scoped [connection service](./concepts.md#connection-service), and
calling `ConnectionsService.find` with a
[lookup query](./concepts.md#lookup-queries) and the
[authentication methods](./concepts.md#authentication-method) it understands.

:::caution[Runtime API boundary]
The public `@backstage/connections` package contains the shared service
contract, connection types, and type helpers. The service reference and
declaration helper remain in the private, inlined `@backstage/connections-node`
package. The complete wiring example on this page applies to framework code in
the Backstage repository while this experimental boundary is being completed.
External plugin packages should not depend on `@backstage/connections-node`.
:::

## Declare a connection dependency

Framework plugins and modules declare each type during `register`, before
calling `registerInit`. See the
[connection declaration concept](./concepts.md#connection-declaration) for why
the declaration is separate from lookup:

```ts
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import {
  connectionsServiceRef,
  declareConnection,
} from '@backstage/connections-node';

export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(reg) {
    declareConnection(reg, {
      type: 'github',
      description: 'Reads repository metadata from GitHub',
    });

    reg.registerInit({
      deps: {
        connections: connectionsServiceRef,
      },
      async init({ connections }) {
        // Use connections here.
      },
    });
  },
});
```

A declaration applies to one plugin or module registration. If a module uses
GitHub and its parent plugin also uses GitHub, both registrations declare the
`github` type.

The runtime rejects undeclared lookups. This keeps connection use visible in
plugin metadata and prevents a plugin from asking for arbitrary configured
credential types.

## Look up a host-based connection

Host-based types accept a query containing a URL. The service parses the URL
and selects the connection with a matching `host`:

```ts
const connection = await connections.find({
  type: 'github',
  query: {
    url: 'https://github.com/backstage/backstage',
  },
  authMethods: ['token'],
});

connection.host; // string
connection.auth.method; // 'token'
connection.auth.token; // string
```

The literal `type` and `authMethods` values drive TypeScript inference. In this
example, the result is a GitHub connection and `connection.auth` is narrowed to
the token authentication shape.

:::caution[Authentication values can expire]
`ConnectionsService.find` returns static configuration or bootstrap material.
It does not check whether a returned token remains valid, track expiration, or
refresh it. Use a separate credential provider when the authentication method
has a dynamic lifecycle. See the connection service
[limitations](./concepts.md#limitations).
:::

`authMethods` is a non-empty list of
[authentication methods](./concepts.md#authentication-method) the consumer is
implemented to handle. It is not a fallback preference list. The connection
type selects an [authentication entry](./concepts.md#authentication-entry)
first, and the service then verifies that the selected method is supported by
the consumer.

## Handle more than one authentication method

List every method the code can process, then narrow the returned discriminated
union using `connection.auth.method`:

```ts
const connection = await connections.find({
  type: 'github',
  query: { url: repositoryUrl },
  authMethods: ['token', 'app'],
});

switch (connection.auth.method) {
  case 'token':
    return createClientWithToken({
      host: connection.host,
      token: connection.auth.token,
    });
  case 'app':
    return createClientWithGitHubApp({
      host: connection.host,
      appId: connection.auth.appId,
      privateKey: connection.auth.privateKey,
      clientId: connection.auth.clientId,
      clientSecret: connection.auth.clientSecret,
    });
}
```

The application fields are static credentials, not an installation token. The
`createClientWithGitHubApp` layer is separate from the connection service and
is responsible for token exchange and caching.

## Look up an AWS account

The `aws` type accepts an account number, an ARN, or both:

```ts
const connection = await connections.find({
  type: 'aws',
  query: {
    arn: 'arn:aws:iam::123456789012:role/BackstageReadRole',
  },
  authMethods: ['account'],
});

connection.auth.method; // 'account'
connection.auth.accountId; // string | undefined
connection.auth.roleName; // string | undefined
```

The AWS connection type derives the account number from the ARN and selects an
exact account entry when one exists. Otherwise, it returns the entry marked
`mainAccount`, when configured.

## Type functions that accept connections

Use the public contracts from `@backstage/connections` when a helper, client
factory, or credential provider accepts the service or a resolved connection:

```ts
import type { Connection, ConnectionsService } from '@backstage/connections';

export async function findGitHubToken(
  connections: ConnectionsService,
  repositoryUrl: string,
): Promise<Connection<'github', 'token'>> {
  return connections.find({
    type: 'github',
    query: { url: repositoryUrl },
    authMethods: ['token'],
  });
}
```

Useful public helpers include:

| Type                               | Purpose                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `ConnectionsService`               | Types the plugin-scoped lookup service.                                                    |
| `Connection<TType, TAuthMethod>`   | Types a resolved connection and optionally narrows its selected authentication method.     |
| `ConnectionTypeKey`                | Union of built-in type keys.                                                               |
| `ConnectionAuthMethodKey<TType>`   | Union of authentication methods for one type.                                              |
| `LookupConnectionType<T>`          | Resolves a type key to its connection type descriptor.                                     |
| `ConnectionAuthValue<TAuthConfig>` | Adds the framework-provided authentication title to an authentication configuration shape. |

Prefer these shared types over copying provider-specific connection shapes
into plugin packages.

## Handle lookup errors

`find` rejects when it cannot return a usable connection. Handle only the
outcomes your plugin can recover from:

```ts
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';

try {
  const connection = await connections.find({
    type: 'gitlab',
    query: { url: repositoryUrl },
    authMethods: ['token'],
  });
  return createGitLabClient(connection);
} catch (error) {
  if (error instanceof NotFoundError) {
    logger.info(`No GitLab connection matches ${repositoryUrl}`);
    return undefined;
  }
  if (error instanceof NotAllowedError) {
    throw new InputError(
      'The GitLab connection does not provide an authentication method this plugin supports',
    );
  }
  throw error;
}
```

Do not catch an undeclared-connection error as a normal absence. Add the
missing declaration to the plugin or module registration.

## Keep connection data on the backend

Resolved connections can contain secrets. Treat the returned object as
sensitive, even when the selected method is `none`:

- Do not log complete connections or authentication values.
- Do not return connection objects through backend HTTP routes.
- Do not expose the service directly to frontend plugins.
- Pass only the minimum fields required by a client or credential provider.
- Let the external system enforce the permissions attached to each credential.

For configuration and scoping examples, see
[Configure and manage connections](./configuring-connections.md).
