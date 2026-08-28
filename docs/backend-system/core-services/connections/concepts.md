---
id: concepts
title: Connection concepts
description: The concepts and selection model behind Backstage connections
---

Connections separate static external-service configuration from the code that
uses it. This page is the glossary for the connections framework. It defines
each part of the model, then follows a lookup from configuration to the value
returned to a plugin.

## Connection type

A _connection type_ is the shared contract for one kind of external system.
It defines:

- A unique type key, such as `github` or `aws`.
- A display title.
- Whether configuration can contain one instance or many instances.
- A lookup strategy, which determines the query accepted by
  `ConnectionsService.find`.
- A schema for fields shared by every authentication method.
- One or more authentication method definitions.
- Optional authentication selection and whole-connection validation logic.

For example, the `github` type is a multi-instance, host-based type. Its
connection fields include `host`, `apiBaseUrl`, and `rawBaseUrl`. Its
authentication methods are `none`, `token`, and `app`.

The exported `ConnectionType` descriptor contains runtime metadata such as
`lookupStrategy`, `configSchema`, and `authMethods`. The query and returned
authentication shapes are inferred through its generic definition; they are
not runtime properties named `query` or `auth` on the descriptor.

## Configured connection

A _configured connection_ is one entry in the root `connections` array. It
combines fields owned by the framework with fields defined by its connection
type:

```yaml
connections:
  - type: github
    title: GitHub production
    host: github.com
    auth:
      - method: token
        token: ${GITHUB_TOKEN}
```

The framework owns these connection-level fields:

| Field   | Required | Purpose                                                 |
| ------- | -------- | ------------------------------------------------------- |
| `type`  | Yes      | Selects a built-in connection type.                     |
| `title` | No       | Gives the connection a human-readable name.             |
| `auth`  | Yes      | Contains one or more configured authentication entries. |
| `match` | No       | Restricts the complete connection to named plugin IDs.  |

All other fields come from the selected type's connection schema. For a
host-based type, this normally includes `host` and may include API or content
base URLs.

## Cardinality

_Cardinality_ controls how many configured connections can exist for a type.
Most connection types have `multiton` cardinality, which allows more than one
configured instance with a unique identity. A `singleton` type allows one
entry of that type.

The built-in `aws` type is a singleton because its authentication entries
represent multiple AWS accounts within one connection.

## Authentication method

An _authentication method_ defines one supported way to authenticate. The
definition has a method key, a display title, and a schema for method-specific
fields. For example, the GitHub `token` method requires `token`, while the
GitHub `app` method requires application credentials.

## Authentication entry

An _authentication entry_ is the configured instance of one method:

```yaml
auth:
  - method: token
    title: Read-only catalog token
    token: ${GITHUB_CATALOG_TOKEN}
    match:
      plugins:
        - catalog
```

Every connection must contain at least one authentication entry. If a type
supports unauthenticated access, configure its `none` method explicitly. An
empty `auth` array does not mean unauthenticated access.

The optional authentication `title` defaults to the method's display title.
The optional `match` rule restricts that entry to particular plugins.

## Lookup strategies

A _lookup strategy_ defines how the service derives a connection identity from
a lookup query. It also determines the query shape accepted by
`ConnectionsService.find`.

The built-in strategies are:

| Strategy | Query                                  | Selection behavior                                                                              |
| -------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `host`   | `{ url: string }`                      | Parses the URL and selects the connection whose `host` matches the URL host.                    |
| `aws`    | `{ accountId?: string; arn?: string }` | Uses the singleton AWS connection and lets the AWS type select an account authentication entry. |

## Lookup queries

A _lookup query_ describes the resource that a plugin wants to access. Its
shape comes from the connection type's lookup strategy. Host-based types use a
resource URL, while the AWS type accepts an account number or Amazon Resource
Name (ARN).

The query is part of the lookup request. It is not stored as a field on a
configured connection or exposed as a runtime property of `ConnectionType`.

## Connection declaration

A _connection declaration_ records that a backend plugin or module intends to
look up a connection type. Declarations are made during the plugin or module's
`register` callback, before initialization dependencies are registered.

The runtime rejects lookups for undeclared types. A module declares its own
connections even when its parent plugin has already declared the same type.
Declarations can also carry a description and required-status metadata for
diagnostics and tooling.

Declarations describe intended access. They do not select a configured
connection and do not contain credentials.

## Connection service

The _connection service_ validates and selects configured connections. It is a
plugin-scoped backend service, so each plugin receives its own view of the root
connection configuration.

## Plugin scoping

_Plugin scoping_ uses `match.plugins` rules to control which connections and
credentials each plugin can see. Credentials that do not match a plugin are
not available to it.

This scoping supports cases such as:

- Giving an ingestion plugin a read-only token while another plugin uses a
  different credential.
- Hiding a sensitive connection from plugins that do not need it.
- Sharing an unrestricted connection across all plugins while overriding one
  authentication entry for a named plugin.

Connection scoping is configuration-level isolation. It does not replace the
Backstage permission framework or the external system's own authorization.

## What happens during `find`

After a plugin declares a connection type and receives its plugin-scoped
connection service, it calls `find` when it needs to access that external
system. The plugin identifies the connection type, describes the resource with
a [lookup query](#lookup-queries), and lists the
[authentication methods](#authentication-method) it knows how to handle. The
service uses those inputs to select one configured connection and one
authentication entry.

For example, a host lookup uses the URL in the query to find the connection
with the same host.

**Given this config**

```yaml title="app-config.yaml"
connections:
  - type: github
    title: GitHub.com
    host: github.com
    apiBaseUrl: https://api.github.com
    rawBaseUrl: https://raw.githubusercontent.com
    auth:
      - method: token
        title: Catalog token
        token: ${GITHUB_TOKEN}
```

**And this `find` call**

```ts
const connection = await connections.find({
  type: 'github',
  query: {
    url: 'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
  },
  authMethods: ['token'],
});
```

**We get this**

```ts
{
  type: 'github',
  title: 'GitHub.com',
  host: 'github.com',
  apiBaseUrl: 'https://api.github.com',
  rawBaseUrl: 'https://raw.githubusercontent.com',
  auth: {
    method: 'token',
    title: 'Catalog token',
    token: '<value of GITHUB_TOKEN>',
  },
}
```

The query is used for selection and is not included in the result. The
configured `auth` array is replaced by the one authentication entry selected
for this lookup.

The service produces that result in this order:

1. The runtime checks that the calling plugin or module declared the requested
   type.
1. The plugin-scoped service removes connections and authentication entries
   that target other plugins.
1. The lookup strategy derives a connection identity from the query. A host
   lookup derives the host from `query.url`.
1. The service selects the configured connection with the requested type and
   identity.
1. The connection type selects one eligible authentication entry. Most types
   use the first eligible entry. Types such as GitHub and AWS provide more
   specific selection logic.
1. The service verifies that the selected method appears in the consumer's
   non-empty `authMethods` list.
1. The service returns the connection fields with `auth` replaced by the one
   selected authentication value.

The `authMethods` list declares what the consumer can handle. It does not
filter candidates before type-specific authentication selection. If the type
selects a method that the consumer did not list, the lookup fails instead of
silently returning another credential.

## Limitations

Connections only manage static connection and authentication configuration.
The connection service validates that configuration, selects the relevant
entry, and returns its fields. It does not manage the lifecycle of the returned
authentication values.

Connection authentication values are static configuration or bootstrap
material. They are not guaranteed to remain valid credentials. In particular,
the connection service does not:

- Check whether a configured token is valid or expired.
- Exchange application, role, or identity configuration for a short-lived
  credential.
- Refresh or cache dynamic credentials.
- Reload a token when its value changes outside the running backend.

A configured token may be directly usable, but the consumer is responsible for
handling rejection or expiration. Other methods, such as an application, role,
profile, or managed identity, return the fields needed by a separate credential
provider.

For example, a GitHub `app` entry returns the application ID and private key. It
does not return a GitHub installation token. A GitHub credential provider must
use those fields to obtain, cache, and refresh an installation token.

Keep this limitation in mind when designing consumers:

- Use connections to locate an endpoint and select static authentication
  configuration.
- Pass bootstrap fields to a service-specific credential provider when token
  exchange, refresh, or caching is required.
- Treat a directly configured token as static. If it expires or is replaced,
  update the configuration and restart the backend.
- Use a client factory to construct a service-specific API client.
- Never send connection authentication values to the frontend or include them
  in logs.

Next, see [Configure and manage connections](./configuring-connections.md) or
[Consume connections](./consuming-connections.md).
