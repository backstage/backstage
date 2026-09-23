---
title: Connection Service
status: implementable
authors:
  - '@Rugvip'
owners:
  - '@backstage/maintainers'
project-areas:
  - framework
creation-date: 2026-03-30
---

# BEP: Connection Service

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
  - [Configuration Format](#configuration-format)
  - [Connection Service](#connection-service)
  - [Querying Connections](#querying-connections)
  - [Defining Connection Types](#defining-connection-types)
  - [Connection Type Evolution](#connection-type-evolution)
  - [Custom Connection Types](#custom-connection-types)
- [Design Details](#design-details)
  - [Credential APIs on Top of Connections](#credential-apis-on-top-of-connections)
  - [Backward Compatibility](#backward-compatibility)
- [Alternatives](#alternatives)
  - [Connection-Driven Proxy Endpoints](#connection-driven-proxy-endpoints)

## Summary

Today, every Backstage plugin that talks to an external service defines its own configuration for hosts, credentials, and endpoints. There is no shared system for this, which leads to duplicated configuration, no cross-plugin reuse, and no single place for adopters to see or manage their external connections. The existing `integrations` config covers a handful of SCM providers but leaves the rest of the ecosystem to solve this independently.

This BEP proposes a **Connection Service** - a centralized registry where all external service connections are defined, configured, and queried. Connection types are maintained collaboratively in a single `@backstage/connections-node` package, giving the ecosystem a shared foundation to build on rather than each plugin reinventing its own connection configuration. The framework proactively adds connection types for common services, and plugin authors consume them through a simple query API.

The key trade-off is simplicity: connections are pure static data - hosts, API endpoints, and authentication material as it appears in config. There are no API clients, no token exchange, no credential caching. Existing credential providers like `DefaultGithubCredentialsProvider` and `DefaultAzureDevOpsCredentialsProvider` continue to exist as a separate layer, but consume connections as their data source instead of parsing config independently. This keeps the connection service minimal and focused on the one thing every plugin needs - knowing where an external service lives and what credentials are available - while letting specialized credential APIs handle the dynamic parts on top.

## Motivation

**Per-plugin connection configuration.** Backstage plugins that connect to external services each define their own configuration for hosts, credentials, and endpoints. A Jira plugin has `jira.host` and `jira.token`, a PagerDuty plugin has `pagerduty.apiUrl` and `pagerduty.eventsBaseUrl`, a Jenkins plugin has its own block, and so on. When multiple plugins need to talk to the same external service, each one requires its own configuration entry, duplicating the same host and credential information across plugin config schemas. There is no shared connection registry that plugins can draw from, no way for an adopter to see all configured external connections in one place, and no opportunity for connection reuse across plugins that talk to the same service.

**Limited scope of existing integrations.** The existing `integrations` configuration and `ScmIntegrations` API partially address this for a handful of SCM and storage providers, but the vast majority of external service connections in the ecosystem are outside its scope. The problems with the current system go beyond coverage:

**No clear layering between config and credentials.** Credential providers like `DefaultGithubCredentialsProvider` and `DefaultAzureDevOpsCredentialsProvider` handle dynamic operations like token exchange and caching, but they must independently parse the same config that `ScmIntegrations` reads. There is no shared data layer they can build on - each one re-reads config and constructs its own view of what connections exist. A clean separation where static connection data lives in one place and credential providers simply consume it would simplify both sides.

**Primitive lookup.** The current `byHost` lookup is insufficient for real-world scenarios. When multiple GitHub Apps are configured for different organizations on the same host, or when different credentials should be used for different paths on the same GitLab instance, host-based matching alone cannot express the routing.

**No path for evolution.** When an external service makes breaking changes to its API or authentication, there is no mechanism to roll out a new connection format alongside the old one.

### Goals

- Replace the scattered, per-plugin pattern of configuring external service connections with a single centralized system that all plugins share.
- Provide a clean separation between static connection data (hosts, endpoints, credentials) and dynamic credential resolution (token exchange, refresh, caching).
- Enable connection lookup that goes beyond host matching, supporting selection by URL, type, and additional context.
- Consolidate all built-in connection type definitions in one place to provide a predictable evolution path and consistent experience across the ecosystem.
- Allow adopters to extend the system with custom connection types for their internal services.

### Non-Goals

- This BEP does not define type-specific credential APIs (e.g. GitHub App token exchange, Azure OAuth flows). Existing credential providers continue to exist as a separate layer that consumes connections as their data source. Their design is outside the scope of this proposal.
- This BEP does not cover content-level operations like URL resolution or edit URL generation. Those are higher-level concerns that build on top of connections.
- This BEP does not propose changes to the URL reader service, though it will be updated to consume connections.
- This BEP does not cover user-level authentication or access delegation.
- The connection service is backend-only. Frontend access to connections is not part of this proposal, though the [Connection-Driven Proxy Endpoints](#connection-driven-proxy-endpoints) alternative explores how connections could be surfaced to the frontend in the future.
- Connection types are not extensible by ecosystem plugins. New connection types can only be added to `@backstage/connections-node` or by adopters in their own app. This ensures a single canonical set of definitions with a predictable evolution path.

## Proposal

### Configuration Format

Connections are configured as a flat array under `backend.connections` in `app-config.yaml`. The `backend` namespace is the natural home since connections are a backend concern, and avoids adding another top-level configuration key. Plugins should always consume connections through the connection service rather than reading the config directly. To enforce this, the framework may introduce restrictions in the config reading service that prevent plugins from accessing `backend.connections` directly, ensuring that all connection access goes through the connection service and its validation, matching, and scoping logic.

Each entry has a `type` field that identifies the kind of external service and an optional `title` field for human identification:

```yaml
backend:
  connections:
    - type: github
      title: GitHub Production
      host: github.com
      apiBaseUrl: https://api.github.com
      rawBaseUrl: https://raw.githubusercontent.com
      auth:
        - method: token
          token: ${GITHUB_TOKEN}
        - method: app
          appId: 12345
          privateKey: ${GH_APP_PRIVATE_KEY}
          clientId: ${GH_APP_CLIENT_ID}
          clientSecret: ${GH_APP_CLIENT_SECRET}
          allowedOwners:
            - my-org
            - partner-org
        - method: app
          appId: 67890
          privateKey: ${GH_APP_2_KEY}
          clientId: ${GH_APP_2_CLIENT_ID}
          clientSecret: ${GH_APP_2_CLIENT_SECRET}
          allowedOwners:
            - internal-org
    - type: github
      title: GitHub Enterprise
      host: ghe.example.com
      apiBaseUrl: https://ghe.example.com/api/v3
      auth:
        - method: token
          token: ${GHE_TOKEN}
    - type: gitlab
      title: Gitlab Production
      host: gitlab.com
      auth:
        - method: token
          token: ${GITLAB_TOKEN}
    - type: azure
      title: Azure Prod
      host: dev.azure.com
      auth:
        - method: pat
          personalAccessToken: ${AZURE_TOKEN}
```

Each connection entry has a `type`, base fields like `host`, and an `auth` array listing one or more authentication methods. Each auth entry has a `method` discriminator and method-specific fields. When a plugin queries for a connection, the service selects both the best connection and the best auth method, so the consumer receives a single connection with a single selected auth object.

**Connection titles.** The optional `title` field provides a human-readable identifier for a connection. It is not used for matching or selection — connections are still resolved by `type` and URL — but it serves two purposes: it makes the config easier to scan when an adopter has many connections of the same type, and it gives connection management interfaces a label to display instead of a raw host string. The `title` field is reserved by the framework alongside `type`, `auth`, and `match`, so connection type schemas cannot use it.

**Auth method matching.** Each auth entry can optionally include a `match` block that controls when the entry is eligible for selection. The `match` key is reserved by the framework, and auth method schemas cannot use it. Currently `match` supports `plugins`, which restricts the auth entry to specific plugin IDs:

```yaml
backend:
  connections:
    - type: github
      host: github.com
      auth:
        # Only the catalog plugin can select this auth method
        - method: token
          token: ${GITHUB_CATALOG_TOKEN}
          match:
            plugins: [catalog]
        # All other plugins use the app
        - method: app
          appId: 12345
          privateKey: ${GH_APP_KEY}
          clientId: ${GH_APP_CLIENT_ID}
          clientSecret: ${GH_APP_CLIENT_SECRET}
```

When the service selects an auth method, entries whose `match` criteria exclude the requesting plugin are removed from consideration. Auth methods without a `match` block are always eligible. Among eligible entries, those with a `match` that explicitly includes the requesting plugin are preferred over unmatched ones. This allows adopters to give different plugins different credentials or permission levels for the same connection without duplicating the connection entry or writing any code.

The `match` block is designed to evolve. Future selection criteria can be added alongside `plugins` without changing auth method schemas or the overall config structure.

**Config merging.** Arrays in Backstage's config system are replaced wholesale when merging across config sources, they do not merge element-by-element. This means that if `backend.connections` is defined in multiple config files, the last source wins. In practice this is acceptable because different environments (local dev, staging, production) typically define entirely different sets of connections. For the case where base config and secrets need to be split, the recommended approach is to use environment variable substitution within a single config file, or to use the `$include` directive.

### Connection Service

A new core service, `coreServices.connections`, provides access to connections. The service is scoped per-plugin so that auth method selection can apply `match` criteria based on the requesting plugin's identity.

The service can be overridden at the app level to customize connection resolution, add custom connection types, or integrate with external configuration sources.

#### Connection Declarations

Before a plugin or module can access connections at runtime, it must declare which connection types it consumes. This is done by calling `env.registerConnection` for each type during the `register` phase:

```typescript
export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github-provider',
  register(env) {
    env.registerConnection({
      type: 'github',
      required: true,
      description: 'We need this to be able to display your stuff',
    });

    env.registerInit({
      deps: { connections: coreServices.connections },
      async init({ connections }) {
        const result = connections.find({
          type: 'github',
          authMethods: ['token', 'app'],
          url: 'https://github.com/my-org/my-repo',
        });

        if (result.connection) {
          const { apiBaseUrl, auth } = result.connection;
          // auth is narrowed to the declared authMethods
        }
      },
    });
  },
});
```

The `type` field is required. All other fields are optional metadata about the declaration:

- **`required`** - Whether this connection is required for the module to function. When `true`, the framework can surface clear warnings or errors when no matching connection is configured. Defaults to `false`.
- **`description`** - A human-readable description of what the connection is used for, surfaced in documentation.

The framework enforces declarations at two levels:

- **Startup validation.** If a module depends on `coreServices.connections` but did not call `env.registerConnection`, the framework throws at startup before any init code runs.
- **Runtime validation.** If a module calls `find` with a type that was not declared, the service throws immediately.

Each module declares its own connection requirements independently. The plugin's total set of declared types is the union of all its modules' declarations. This means a catalog plugin with a GitHub provider module and a GitLab provider module each declare only the types they need:

```typescript
// catalog-backend-module-github
register(env) {
  env.registerConnection({ type: 'github' });
  // ...
}

// catalog-backend-module-gitlab
register(env) {
  env.registerConnection({ type: 'gitlab' });
  // ...
}
```

**Offline discoverability.** The `register` function is synchronous and side-effect-free, it runs before any async init logic. Tooling can load a module and execute `register` with a recording mock to extract declared connection types without running the plugin's actual implementation. Build tooling can also extract the declarations statically from source.

### Querying Connections

The connection service exposes a single query method with a required `type` field, which is validated against the module's declared types.

**`find` - best match:**

Returns the single best-matching connection for the given criteria. The caller must declare which auth methods it supports via the required `authMethods` parameter:

```typescript
const result = connections.find({
  type: 'github',
  authMethods: ['token', 'app'],
  url: 'https://github.com/my-org/my-repo',
});
// result.connection type is derived from the 'github' schema
// result.connection.auth is narrowed to the declared authMethods
```

The `find` method selects both the connection and the auth method in one step. The connection type's `match` function picks the right connection from all candidates (typically by host), and its `matchAuth` function picks the right auth method, for example the GitHub App whose `allowedOwners` includes the URL's organization.

**Static selection.** A key constraint of `find` is that the connection and auth method are selected entirely from static configuration data. No API calls are made to external services during selection. This means the information available in the connection and auth method config must be sufficient to determine the best match. For example, when multiple GitHub Apps are configured, the `allowedOwners` field on each app auth entry is what `find` uses to pick the right one for a given URL. If the ownership information needed to select the correct app isn't available in the static config, `find` cannot make the right choice. This is a deliberate trade-off: selection is fast, predictable, and has no external dependencies, but it requires that adopters configure enough metadata for the selection logic to work.

**Auth method enforcement.** The `authMethods` parameter is not a filter, it is a declaration of what the caller can handle. If the best-matching auth method for a connection is one the caller did not list, `find` throws an error rather than silently skipping it. This ensures that when a new auth method is configured, consumers that encounter it are forced to explicitly add support rather than silently losing access to the connection:

```typescript
// If the best match for this URL is a 'fine-grained-pat' auth entry
// but the caller only listed ['token', 'app'], find() throws:
//   "Connection 'github' at 'github.com' matched auth method
//    'fine-grained-pat' which is not in the caller's supported
//    authMethods: ['token', 'app']"
```

If no connection matches the type and URL at all, `find` returns `undefined` as usual. The error only occurs when a connection exists but the caller cannot handle its auth method.

**Always-optional results:**

The `find` method never throws for a missing connection. It returns a `ConnectionResult` with `connection` set to `undefined`:

```typescript
const result = connections.find({
  type: 'github',
  authMethods: ['token', 'app'],
  url: 'https://unknown-host.example.com/path',
});

if (!result.connection) {
  logger.info('No GitHub connection configured, skipping sync');
  return;
}
```

### Defining Connection Types

All built-in connection types are defined centrally in a single `@backstage/connections-node` package. This package owns the type definitions, output interfaces, and the internal machinery for parsing and validating connection config. Ecosystem plugins cannot define new connection types, they can only consume the output types exported from this package.

The following illustrates a possible internal API for defining connection types using `createConnectionType`. This is an internal API within the connections package and can evolve independently over time. The package may also provide additional internal helpers to simplify common patterns. The only part of this that is public-facing is the output types that consumers work with and the ability for adopters to pass custom type definitions to the connection service factory override.

The `createConnectionType` helper captures the full definition: base config validation, auth methods, output shape, and URL matching. It uses Zod schemas as the source of truth for both base fields and auth methods, and produces a `ConnectionType` object that the registry uses internally.

**What each piece does:**

- **`type`** - the discriminator string used in config and queries. The framework adds `type` to the output automatically.
- **`title`** - an optional human-readable identifier. The framework adds `title` to the schema automatically; it is not part of the `configSchema` authored by connection type definitions.
- **`configSchema`** - a Zod schema for the base connection fields shared across all auth methods (e.g. `host`, `apiBaseUrl`). The pre-transform shape defines the config input; `.transform()` derives computed defaults. The `host` field is required on input but is not included in the output type, it is used internally for matching only. Consumers should use base URL fields like `apiBaseUrl` instead.
- **`authMethods`** - an array of auth method definitions, each with a `method` string discriminator and its own `configSchema` (Zod).
- **`match(connections, query)`** - optional, at the connection level. Receives all connections of this type and the query from `find()`, and returns a single connection or `undefined`. When omitted, the default implementation selects by matching the query URL's host against the connection's `host` field. This is a simple selection function, not a scoring function.
- **`matchAuth(authMethods, query)`** - at the auth method level (defined per-type, not per-method). Receives all eligible auth methods for the selected connection and the query, and returns a single auth method or `undefined`. Required when the type defines more than one auth method. When omitted (single auth method types), the default returns the first eligible method. The connections package can provide shared match implementations for common patterns.

**Guidance: always include base URLs.** Since `host` is not exposed on the output type, connection type definitions must include one or more base URL fields (e.g. `apiBaseUrl`, `rawBaseUrl`) so that consumers have a way to construct HTTP requests. Deriving sensible defaults from the `host` via `.transform()` makes it zero-configuration for the common case while allowing adopters to override any base URL, for example to route traffic through a reverse proxy or an internal gateway. The specific base URL fields vary by connection type, but every type should provide at least one.

#### Full Example: GitHub Connection Type

```typescript
import { createConnectionType, hostMatch } from '@backstage/connections-node';
import { z } from 'zod';

export const githubConnectionType = createConnectionType({
  type: 'github',

  configSchema: z
    .object({
      host: z.string(),
      apiBaseUrl: z.string().optional(),
      rawBaseUrl: z.string().optional(),
    })
    .transform(input => {
      const isPublic = input.host === 'github.com';
      return {
        apiBaseUrl:
          input.apiBaseUrl ??
          (isPublic
            ? 'https://api.github.com'
            : `https://${input.host}/api/v3`),
        rawBaseUrl:
          input.rawBaseUrl ??
          (isPublic
            ? 'https://raw.githubusercontent.com'
            : `https://${input.host}/raw`),
      };
    }),

  // Select the best connection from all github connections.
  // hostMatch is a shared helper provided by the connections package.
  match: hostMatch(),

  // Priority: app with matching owners > any app > token > none
  matchAuth(authMethods, query) {
    const url = query.url && new URL(query.url);
    const owner = url?.pathname.split('/')[1];

    const appWithOwner =
      owner &&
      authMethods.find(
        auth => auth.method === 'app' && auth.allowedOwners?.includes(owner),
      );
    if (appWithOwner) {
      return appWithOwner;
    }

    return (
      authMethods.find(auth => auth.method === 'app') ??
      authMethods.find(auth => auth.method === 'token') ??
      authMethods.find(auth => auth.method === 'none')
    );
  },

  authMethods: [
    {
      method: 'none',
      configSchema: z.object({}),
    },
    {
      method: 'token',
      configSchema: z.object({
        token: z.string(),
      }),
    },
    {
      method: 'app',
      configSchema: z
        .object({
          appId: z.union([z.number(), z.string()]),
          privateKey: z.string(),
          clientId: z.string(),
          clientSecret: z.string(),
          webhookSecret: z.string().optional(),
          allowedOwners: z.array(z.string()).optional(),
        })
        .transform(app => ({
          ...app,
          appId: typeof app.appId === 'string' ? Number(app.appId) : app.appId,
        })),
    },
  ],
});
```

All connection type definitions are collected into a single registry type. Helper types can be used to select slices from this registry, for example extracting the connection or auth method shape for a specific type. There are no individually exported types like `GithubConnection` or `GithubAppAuth`.

The base `configSchema` handles fields shared across all auth methods (`host`, `apiBaseUrl`, `rawBaseUrl`) with `.transform()` filling in defaults. Note that `host` is consumed in the transform to derive base URLs but is not included in the output. Each auth method defines its own schema independently, validated and transformed in isolation.

When `find` is called, the `match` function receives all github connections and the query, and selects one (here using the `hostMatch()` helper which matches by the internal `host` field). Then `matchAuth` receives all eligible auth methods for the selected connection and picks one, following a priority chain: an app whose `allowedOwners` includes the URL's organization, then any app, then a token, then unauthenticated (`none`). This allows a connection to be configured with just a `none` entry for public API access, upgraded to a token or app when credentials are available. The result returned to the caller includes the base connection fields and a single `auth` object, the selected method.

The `hostMatch()` helper is a shared implementation provided by the connections package for the common pattern of selecting a connection by matching the query URL's host. Connection types with more complex matching needs can implement `match` directly.

### Connection Type Evolution

Since all connection types are defined centrally and auth methods are first-class primitives, there are clean paths for evolving connection types over time.

**Adding a new auth method.** New auth methods can be added to an existing connection type. The definition change is purely additive, existing auth methods are unchanged:

```typescript
// Adding fine-grained PAT support to the GitHub connection type:
authMethods: [
  // ... existing token and app methods unchanged ...
  {
    method: 'fine-grained-pat',
    configSchema: z.object({
      token: z.string(),
      repositories: z.array(z.string()),
    }),
  },
],

// The matchAuth function is updated to handle the new method:
matchAuth(authMethods, query) {
  // ... existing logic, plus matching fine-grained-pat by repository list
},
```

Existing consumers that call `find` with `authMethods: ['token', 'app']` are unaffected as long as the connections they encounter don't resolve to the new method. If an adopter configures `fine-grained-pat` as the auth method for a connection that an existing consumer queries, `find` throws, forcing the consumer to either add `'fine-grained-pat'` to their `authMethods` list and handle it, or for the adopter to also configure a `token` or `app` entry that the consumer supports. This ensures new auth methods are never silently ignored.

**Adding base fields.** New optional fields can be added to the base `configSchema` without affecting existing configs or consumers.

**New type for fundamentally different variants.** When a service evolves in a way that requires a fundamentally different base shape or consumer interaction pattern, it is better to introduce a new type:

```yaml
backend:
  connections:
    - type: github
      host: github.com
      auth:
        - method: token
          token: ${GITHUB_TOKEN}

    # Hypothetical new API version with different base fields
    - type: github-v2
      host: github.com
      apiVersion: '2024-01-01'
      auth:
        - method: installation-token
          installationToken: ${GITHUB_V2_TOKEN}
```

Plugins that need the new API register `github-v2`. Plugins that work with both register both. The old `github` type is never broken.

**Choosing between the two.** Adding auth methods is the default path for new authentication mechanisms, the base connection shape stays the same and consumers handle the auth variant they need. A new top-level type is only needed when the base fields or the fundamental interaction model changes. Since all types are centrally defined, the Backstage maintainers can make this judgment call.

### Custom Connection Types

All built-in connection types are defined in `@backstage/connections-node` and shipped with the framework. Ecosystem plugins cannot define new connection types, they can only consume existing ones.

Adopters can define custom connection types for their own organization's internal services. The connection service provides a mechanism for registering additional type definitions at the backend level, using the same `createConnectionType` API used for built-in types. This is limited to a single point of control at the app level, there is no plugin-level extension mechanism for adding new types.

## Design Details

### Credential APIs on Top of Connections

Connections are intentionally limited to static configuration data. Dynamic credential resolution (token exchange, caching, refresh, SDK credential chains) is handled by separate type-specific APIs built on top of connections. This mirrors the existing pattern where `DefaultGithubCredentialsProvider`, `DefaultAzureDevOpsCredentialsProvider`, and `DefaultAwsCredentialsManager` already exist as distinct APIs separate from `ScmIntegrations`.

With the connection service in place, these credential APIs would read from `coreServices.connections` instead of `ScmIntegrations.fromConfig(config)`. They could be wired as independent service refs with default factories, making each one separately overridable. For example, a GitHub credentials service would use `connections.find({ type: 'github', authMethods: ['token', 'app'], url })` to get the best connection and auth method, then handle token exchange for `app` auth methods (installation token negotiation) or pass through the token directly for `token` auth methods, caching tokens with appropriate expiry.

The design of these credential APIs is outside the scope of this BEP and will be addressed separately.

### Backward Compatibility

The old `integrations` configuration is still supported during a deprecation period. The connection service reads from `backend.connections` when present, falling back to `integrations` when `backend.connections` is absent.

```yaml
# Old format (deprecated, still supported)
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}

# New format
backend:
  connections:
    - type: github
      host: github.com
      auth:
        - method: token
          token: ${GITHUB_TOKEN}
```

Since the two formats use different config paths, they never conflict. When `integrations` is detected without a corresponding `backend.connections` key, a deprecation warning is logged at startup.

The existing `ScmIntegrations` and `ScmIntegrationRegistry` types are preserved as deprecated wrappers that delegate to `ConnectionsService`.

## Alternatives

The following are alternative designs that were considered and potential future extensions that are outside the scope of the current proposal but worth capturing for reference.

### Named Entries Instead of Array

Using an object with named keys instead of an array:

```yaml
backend:
  connections:
    github:
      public:
        host: github.com
        token: ${GITHUB_TOKEN}
```

Better config merging across sources since objects merge deeply while arrays replace. But adds structural complexity, and in practice different environments define entirely different sets of connections, making the merging benefit less important than the simplicity of a flat list.

### Per-Provider Service Refs for Connections

One connection service per type (`coreServices.githubConnections`, etc.). Better type safety but leads to service ref proliferation and makes generic code harder to write. The single `coreServices.connections` with a typed `find` method provides sufficient type safety through the `type` option, while `registerConnection` provides the declaration guarantee.

### Permission Declarations on Connection Registrations

The `env.registerConnection` options object could be extended with a `permissions` field, an informational list of permissions or scopes the module needs from the connection:

```typescript
env.registerConnection({
  type: 'github',
  required: true,
  description: 'Used to discover and ingest repository data',
  permissions: ['repo:read', 'actions:read'],
});
```

This would help administrators understand what level of access each module expects and could be surfaced in connection management interfaces. Left out of the initial proposal to keep the declaration lightweight, but could be added as a backward-compatible extension if there is demand for permission-aware connection governance.

### `findAll` Method

A `findAll` method that returns all matching connections and auth methods for a given type, rather than just the best match:

```typescript
const results = connections.findAll({
  type: 'github',
  authMethods: ['token', 'app'],
  url: 'https://github.com/my-org/my-repo',
});

for (const { connection } of results) {
  // Try each matching connection/auth until one works
}
```

This would remove the requirement that static configuration data alone must be sufficient to select the correct connection and auth method. Instead of `find` making a single best-match decision based on `allowedOwners` and other static metadata, `findAll` would return all candidates and let the caller (or a credential layer on top) try each one. For example, a GitHub credential service could iterate through matching app auth entries, attempt an installation token exchange for each, and use the first one that succeeds, without requiring adopters to configure `allowedOwners` or other selection hints.

However, no current requirement is believed to need this, and every known use case works with the single best-match that `find` provides. Leaving `findAll` out of the initial API keeps the surface minimal and preserves maximum freedom to evolve the internal representation, matching behavior, and auth selection model without being constrained by a listing contract. It also keeps the common path simple: callers get one connection and one auth method, no iteration or fallback logic needed. If a concrete need arises, `findAll` can be added as a backward-compatible extension.

### Connection-Driven Proxy Endpoints

Today, many frontend plugins instruct adopters to configure proxy endpoints manually to reach external services:

```yaml
proxy:
  endpoints:
    /circleci/api:
      target: https://circleci.com/api/v1.1
      headers:
        Circle-Token: ${CIRCLECI_TOKEN}
```

This duplicates exactly the information that already lives in a connection: the base URL, the credential, and how to inject it into HTTP requests. A natural future extension would be to let connection types declare how their auth methods map to proxy headers, so that a proxy layer can consume connections directly instead of requiring separate configuration.

Each auth method definition could include an optional `proxy` section describing how to translate the auth into HTTP headers:

```typescript
export const circleCiConnectionType = createConnectionType({
  type: 'circleci',
  configSchema: z
    .object({
      host: z.string().default('circleci.com'),
      apiBaseUrl: z.string().optional(),
    })
    .transform(input => ({
      apiBaseUrl: input.apiBaseUrl ?? `https://${input.host}/api/v1.1`,
    })),
  match: hostMatch(),
  authMethods: [
    {
      method: 'token',
      configSchema: z.object({ token: z.string() }),
      proxy: {
        headers: auth => ({ 'Circle-Token': auth.token }),
      },
    },
  ],
});
```

A proxy service or plugin could then use the connection service to look up a connection, check whether its auth method has a `proxy` declaration, and if so forward requests to the connection's base URL with the appropriate headers injected. Not all auth methods can be proxied with static header injection - GitHub Apps, for example, require dynamic installation token exchange first. Auth methods that lack a `proxy` section would need the credential layer to resolve a usable token before proxying.

On the frontend side, plugins would not interact with connections directly. Instead, a connection proxy API would return the same connection shape as the backend, but without the `auth` field, and with the base URL fields rewritten to point through the proxy:

```typescript
// Frontend plugin code
const connectionProxy = useApi(connectionProxyApiRef);
const connection = await connectionProxy.find({
  type: 'github',
  url: 'https://github.com/my-org/my-repo',
});

if (connection) {
  // connection.apiBaseUrl points through the proxy,
  // e.g. /api/proxy/connections/github/abc123
  const response = await fetch(`${connection.apiBaseUrl}/repos/my-org/my-repo`);
}
```

The frontend plugin gets back the familiar connection fields (`apiBaseUrl`, `rawBaseUrl`, etc.) and uses them the same way backend code would, but the URLs transparently route through the backend proxy which handles auth injection. The plugin never sees credentials.

This would eliminate the "add this to your proxy config" instructions that many plugins require today, and remove the duplication between proxy endpoint configuration and connection configuration. The exact integration with the existing proxy plugin and the credential layer needs further design, so this is left as a future extension.

### User-Level Auth and Access Delegation

Connections as proposed are service-level configuration - how the backend authenticates to external services. A related but distinct concern is acting on behalf of a signed-in user: OAuth token exchange, user-scoped access tokens, and forwarding user identity. Today this is handled by Backstage auth providers, which are configured separately from integrations.

The two systems share underlying configuration. For example, a GitHub App's client ID and client secret live in a connection, and the same credentials are used for user-facing OAuth flows. This overlap suggests that connections could be extended to also serve as the configuration source for auth providers and access delegation, unifying the two into a single place where all external service credentials are managed.

This is intentionally left out of the current proposal to keep the scope focused on service-level connections. The interaction between connections and auth providers can be explored as a backward-compatible extension once the connection service is established.
