---
id: connections
title: Connections (experimental)
sidebar_label: Connections (experimental)
description: Shared configuration and authentication for external services
---

A [_connection_](./connections/concepts.md#configured-connection) describes how
the Backstage backend reaches an external system and which authentication
material it can use. Connections give plugins one shared, validated source for
endpoint and credential configuration instead of requiring each plugin to
define and read its own configuration.

:::caution[Experimental]
The connections framework is experimental. Its configuration and APIs can
change while the public runtime boundary is completed.
:::

## Why connections are useful

Many backend plugins communicate with the same external systems. Without a
shared connection, each plugin can require a separate host, base URL, token,
or application credential, even when those values identify the same service.
This creates duplicated configuration and makes credential changes harder to
apply consistently.

Connections provide:

- One configuration entry that multiple backend plugins can consume.
- Validation against a shared definition for each external system.
- Typed [lookup queries](./connections/concepts.md#lookup-queries) and return
  values for plugin authors.
- Selection between multiple hosts and
  [authentication methods](./connections/concepts.md#authentication-method).
- Plugin-level controls over which connections and credentials are visible.
- A static data layer that credential providers and API clients can build on.

Connections contain static configuration. They do not create API clients,
exchange application credentials for short-lived tokens, refresh credentials,
or test whether an external system is reachable. Returned authentication values
are static configuration or bootstrap material, not a guarantee of a currently
valid credential. A plugin or a dedicated
[credential API](./connections/concepts.md#credential-apis) performs dynamic
operations after resolving a connection.

## How the pieces fit together

The framework separates the shared definition from an adopter's configuration
and a plugin's use of that configuration:

| Part                                                                       | Purpose                                                                                       | Example                                                                                  |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [Connection type](./connections/concepts.md#connection-type)               | Defines the fields, authentication methods, and lookup behavior for one kind of system.       | The `github` type accepts a host and supports `none`, `token`, and `app` authentication. |
| [Configured connection](./connections/concepts.md#configured-connection)   | Supplies one external endpoint and its authentication entries in Backstage configuration.     | A GitHub Enterprise host with a token.                                                   |
| [Connection declaration](./connections/concepts.md#connection-declaration) | Records that a plugin or module intends to use a connection type.                             | The catalog backend declares that it uses `github`.                                      |
| [Connection service](./connections/concepts.md#connection-service)         | Selects a configured connection and one eligible authentication entry for the calling plugin. | A lookup for a repository URL returns the matching GitHub host and authentication value. |
| Consumer                                                                   | Uses the returned static fields to construct a client or call a credential API.               | A GitHub client uses the returned base URL and token.                                    |

At startup, the default service loads and validates configuration. When a
plugin calls `ConnectionsService.find`, the service applies the plugin's
declarations and visibility rules, selects a connection using the lookup
query, selects one authentication entry, and returns the result.

## Documentation map

Start with the guide that matches your task:

- [Connection concepts](./connections/concepts.md) defines the model and
  explains lookup, authentication selection, plugin scoping, and the boundary
  between connections and credential APIs.
- [Configure and manage connections](./connections/configuring-connections.md)
  shows how to create, change, scope, and migrate connection configuration.
- [Consume connections](./connections/consuming-connections.md) shows how a
  backend plugin declares, looks up, narrows, and handles connections.
- [Built-in connection types](./connections/built-in-connection-types.md)
  links to the available types and their fields, authentication methods, and
  query shapes.
- [Create or modify a connection type](./connections/creating-a-connection-type.md)
  covers the framework contribution path for adding and evolving canonical
  connection types.

If you configure a Backstage instance, begin with
[Configure and manage connections](./connections/configuring-connections.md).
If you maintain a backend plugin, read
[Connection concepts](./connections/concepts.md) followed by
[Consume connections](./connections/consuming-connections.md).
