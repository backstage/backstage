# Static Configuration in Backstage

## Summary

Backstage ships with a flexible configuration system that provides a simple way
to configure Backstage apps and plugins for both local development and
production deployments. It helps get you up and running fast while adapting
Backstage for your specific environment. It also serves as a tool for plugin
authors to use to make it simple to pick up and install a plugin, while still
allowing for customization.

## Supplying Configuration

Configuration is stored in `app-config.yaml` files, with support for suffixes
such as `app-config.production.yaml` to override values for specific
environments. The configuration files themselves contain plain YAML, but with
support for loading in secrets from various sources using a `$secret` key.

It is also possible to supply configuration through environment variables, for
example `APP_CONFIG_app_baseUrl=https://staging.example.com`. However these
should be used sparingly, usually just for temporary overrides during
development or small tweaks to be able to reuse deployment artifacts in
different environments.

The configuration is shared between the frontend and backend, meaning that
values that are common between the two only needs to be defined once. Such as
the `backend.baseUrl`.

For more details, see [Writing Configuration](./writing.md).

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
- [Defining Configuration](./defining.md): How to define configuration for users
  of your plugin.
