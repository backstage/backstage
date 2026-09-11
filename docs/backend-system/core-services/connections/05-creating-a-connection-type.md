---
id: creating-a-connection-type
title: Create or modify a connection type
description: Add and evolve canonical connection types in the Backstage framework
---

A [connection type](./concepts.md#connection-type) is the canonical contract
between Backstage configuration and every plugin that consumes one kind of
external system. A type defines the connection fields,
[authentication methods](./concepts.md#authentication-method),
[lookup query](./concepts.md#lookup-queries), validation, and authentication
selection behavior.

:::caution[Framework contribution path]
Adopter-defined connection type registration is not exposed as a public API.
`createConnectionType` and the registry are internal to the Backstage
framework. This guide describes how to contribute a canonical built-in type to
the Backstage repository. Do not import internal source modules into an
external plugin or app package.
:::

## Decide whether you need a new type

Create a type when multiple plugins can share the same definition of an
external system. A useful type has a stable connection identity, a clear set
of static endpoint fields, and authentication methods that consumers can
handle consistently.

Do not add a type to:

- Construct or cache an API client.
- Exchange static application credentials for short-lived credentials.
- Represent signed-in user authentication.
- Store plugin-specific settings unrelated to reaching the external system.
- Duplicate an existing type because one consumer uses a different client
  library.

Add an authentication method to an existing type when only the authentication
mechanism changes. Add a separate type when the endpoint shape, lookup model,
or consumer contract is fundamentally different.

## Define the contract

Before writing code, decide:

| Decision                                           | Questions                                                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Type key                                           | Is the lowercase key unique and recognizable in configuration?                                             |
| Title                                              | What human-readable name should tooling display?                                                           |
| [Cardinality](./concepts.md#cardinality)           | Can an adopter configure one instance or multiple independently addressable instances?                     |
| [Lookup strategy](./concepts.md#lookup-strategies) | Can a resource URL identify the connection by host, or does the system need an existing non-host strategy? |
| Connection fields                                  | Which endpoint and static settings are shared by every authentication method?                              |
| Authentication methods                             | Which static credential shapes can consumers explicitly support?                                           |
| Selection                                          | If several entries are eligible, which one should be returned for a query?                                 |
| Validation                                         | Which rules span multiple fields or authentication entries?                                                |

The built-in implementation supports `host` and `aws`
[lookup strategies](./concepts.md#lookup-strategies). A new strategy is a wider
framework change because both the common configuration pipeline and Node.js
lookup implementation must understand its query and identity.

## Add the connection type definition

Create a file in `packages/connections/src/schema`. New TypeScript files must
include the repository's Apache 2.0 header.

This example defines a host-based type with token and unauthenticated methods:

```ts title="packages/connections/src/schema/acme.ts"
import { z } from 'zod/v4';
import { createConnectionType } from '../system/createConnectionType';

/** @public */
export const AcmeConnectionType = createConnectionType({
  type: 'acme',
  title: 'Acme',
  configSchema: z.object({
    host: z.string(),
    apiBaseUrl: z.string().optional(),
  }),
  authMethods: [
    {
      method: 'none',
      title: 'None',
      configSchema: z.object({}),
    },
    {
      method: 'token',
      title: 'Token',
      configSchema: z.object({
        token: z.string(),
      }),
    },
  ],
  matchAuth(authMethods) {
    return (
      authMethods.find(auth => auth.method === 'token') ??
      authMethods.find(auth => auth.method === 'none')
    );
  },
});
```

`cardinality` defaults to `multiton`, and `lookupStrategy` defaults to `host`.
For a host-based type, include a `host` string in the connection schema so the
configuration pipeline can enforce unique identities and the service can
match `query.url`.

Each type must declare at least one authentication method. Add `none` only
when consumers can use the system without authentication. An empty method
schema still makes unauthenticated access explicit in configuration and in
consumer code.

### Avoid reserved fields

The framework owns these connection-level fields:

- `type`.
- `title`.
- `auth`.
- `match`.

Do not add them to `configSchema`.

The framework owns `method`, `title`, and `match` on each authentication entry.
Do not add them to an authentication method's `configSchema`. The type
constraints report reserved-field collisions during development.

### Keep schemas portable

Connection types use Zod internally for parsing and JSON Schema generation.
Consumers receive a `PortableSchema`, which exposes `parse` and `schema`
without requiring them to depend on the same schema library.

Use schemas for local field validation and transforms. Use the type-level
`validate` callback for rules that need the complete parsed connection or
more than one authentication entry.

For example, a type can reject duplicate account identifiers:

```ts
validate({ auth }) {
  const accountIds = auth.flatMap(entry =>
    entry.accountId ? [entry.accountId] : [],
  );
  if (new Set(accountIds).size !== accountIds.length) {
    throw new InputError('Account IDs must be unique');
  }
},
```

Throw `InputError` with a message that identifies the invalid rule. The
configuration pipeline adds the connection type and source context.

## Define authentication selection

Without `matchAuth`, the service returns the first
[authentication entry](./concepts.md#authentication-entry) visible to the
calling plugin. Entries explicitly matched to that plugin are placed before
unrestricted entries through [plugin scoping](./concepts.md#plugin-scoping).

Implement `matchAuth` when selection depends on the query or method priority.
It receives only entries visible to the calling plugin and the query inferred
from the lookup strategy. It returns one entry or `undefined`:

```ts
matchAuth(authMethods, query) {
  const organization = new URL(query.url).pathname.split('/').filter(Boolean)[0];

  return (
    authMethods.find(
      auth => auth.method === 'app' && auth.orgs?.includes(organization),
    ) ?? authMethods.find(auth => auth.method === 'token')
  );
},
```

Keep selection deterministic and document the priority. The service checks
the selected method against the consumer's `authMethods` list after selection.
It does not call `matchAuth` again to find a method the consumer supports.

## Register the type

Add the definition to the `connectionTypes` registry in
`packages/connections/src/definitions/types.ts`:

```ts
import { AcmeConnectionType } from '../schema/acme';

export const connectionTypes = createConnectionTypes({
  // Existing definitions omitted.
  acme: AcmeConnectionType,
});
```

The registry key must match the definition's `type`. Registration adds the key
to `ConnectionTypeKey` and makes query, authentication, and result inference
available through `ConnectionsService.find` and `Connection`.

Do not add separate public types such as `AcmeConnection` or
`AcmeTokenAuthentication`. Consumers can derive those shapes from the registry:

```ts
import type { Connection } from '@backstage/connections';

type AcmeTokenConnection = Connection<'acme', 'token'>;
```

## Test the type

Cover the complete contract with a focused set of tests:

- Valid and invalid connection fields.
- Every authentication method schema.
- Reserved-field and unknown-method behavior where relevant.
- `matchAuth` priority, including no-match behavior.
- Whole-connection validation rules.
- Lookup through the default service.
- Type inference for the lookup query and returned authentication value.
- JSON Schema output if generic tooling depends on a particular shape.
- Legacy integration conversion when the type replaces an existing integration.

Prefer a few tests with multiple related assertions over many single-assertion
tests.

## Evolve an existing type

Treat connection type changes as changes to both configuration and plugin
contracts.

### Add an optional connection field

An optional base field is generally additive. Document its meaning and whether
consumers must provide a fallback when it is omitted.

### Add an authentication method

A method is additive to the type union, but consumers must opt in by listing it
in `authMethods` and handling the returned variant. Review `matchAuth` before
changing its priority: selecting the new method for an existing query causes
older consumers to receive `NotAllowedError` until they support it.

### Change validation or required fields

Making a field required, removing a method, or rejecting configuration that
was previously accepted is a breaking configuration change. Follow the
repository's API review and changeset rules, and provide a clear migration.

### Add a separate type

Use a new type key when the endpoint model or lookup behavior is incompatible
with the existing contract. This lets old and new consumers migrate
independently.

## Verify the contribution

Run the targeted tests for the connection type and default service, then run
the required repository checks from the repository root:

```shell
CI=1 yarn test packages/connections/src/schema/acme.test.ts
yarn tsc
yarn lint --fix
yarn build:api-reports
```

Add or update this documentation and include a changeset for every published
package affected by the type. Review the generated API report to confirm that
the registry exposes only the intended public surface.
