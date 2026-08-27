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

_Plugin scoping_ applies connection-level and authentication-level
`match.plugins` rules to the calling plugin's service instance. Credentials
excluded by a rule never reach the plugin.

This scoping supports cases such as:

- Giving an ingestion plugin a read-only token while another plugin uses a
  different credential.
- Hiding a sensitive connection from plugins that do not need it.
- Sharing an unrestricted connection across all plugins while overriding one
  authentication entry for a named plugin.

Connection scoping is configuration-level isolation. It does not replace the
Backstage permission framework or the external system's own authorization.

## What happens during `find`

A lookup follows this order:

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

## Credential APIs

A _credential API_ turns static authentication configuration into a usable
dynamic credential when a method requires exchange, refresh, or caching.
Connections return configuration data as it appears after schema validation.

Connection authentication values are static configuration or bootstrap
material. They are not guaranteed to remain valid credentials. The connection
service does not track expiration, refresh credentials, or reload a replacement
value when it changes outside the running backend.

For a token method, the returned value can be directly usable when the lookup
completes, but the connection service does not guarantee that it remains valid.
For an application, role, profile, or managed identity method, the returned
fields are inputs to a credential API.

For example, a GitHub `app` entry contains the application ID and private key.
It is not a GitHub installation token. A GitHub credential provider must use
those fields to obtain and cache an installation token.

Keep this boundary in mind when designing consumers:

- Use connections to locate an endpoint and select static authentication
  configuration.
- Use a type-specific credential provider to exchange, refresh, or cache
  dynamic credentials.
- Treat a directly configured token as static. If it expires or is replaced,
  update the configuration and restart the backend, unless a credential API or
  custom connection service provides a dynamic lifecycle.
- Use a client factory to construct a service-specific API client.
- Never send connection authentication values to the frontend or include them
  in logs.

Next, see [Configure and manage connections](./configuring-connections.md) or
[Consume connections](./consuming-connections.md).
