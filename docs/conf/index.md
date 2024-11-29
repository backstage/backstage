---
id: index
title: Static Configuration in Backstage
description: Documentation on Static Configuration in Backstage
---

## Summary

Backstage ships with a flexible configuration system that provides a simple way
to configure Backstage apps and plugins for both local development and
production deployments. It helps get you up and running fast while adapting
Backstage for your specific environment. It also serves as a tool for plugin
authors to use to make it simple to pick up and install a plugin, while still
allowing for customization.

## Supplying Configuration

Configuration is stored in YAML files where the defaults are `app-config.yaml`
and `app-config.local.yaml` for local overrides. Other sets of files can by
loaded by passing `--config <path>` flags. The configuration files themselves
contain plain YAML, but with support for loading in data and secrets from
various sources using for example `$env` and `$file` keys.

It is also possible to supply configuration through environment variables, for
example `APP_CONFIG_app_baseUrl=https://staging.example.com`. However these
should be used sparingly, usually just for temporary overrides during
development or small tweaks to be able to reuse deployment artifacts in
different environments.

The configuration is shared between the frontend and backend, meaning that
values that are common between the two only need to be defined once. Such as the
`backend.baseUrl`.

For more details, see [Writing Configuration](./writing.md).

## Configuration Schema

The configuration is validated using JSON Schema definitions. Each plugin and
package can provide pieces of the configuration schema, which are stitched
together to form a complete schema during validation. The configuration schema
is also used to select what configuration is available in the frontend using a
custom `visibility` keyword, as configuration is by default only available in
the backend.

You can validate your configuration against the schema using
`backstage-cli config:check`, and define a schema for your own plugin either
using JSON Schema or TypeScript. For more information, see
[Defining Configuration](./defining.md).

## Reading Configuration

As a plugin developer, you likely end up wanting to define configuration that
you want users of your plugin to supply, as well as reading that configuration
in frontend and backend plugins. For more details, see
[Reading Configuration](./reading.md) and
[Defining Configuration](./defining.md).

## Further Reading

More details are provided in dedicated sections of the documentation.

- [Reading Configuration](./reading.md): How to read configuration in your
  plugin.
- [Writing Configuration](./writing.md): How to provide configuration for your
  Backstage deployment.
- [Defining Configuration](./defining.md): How to define a configuration schema
  for users of your plugin or package.
