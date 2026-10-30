---
id: configuring-extensions
title: Configuring Extensions in the App
sidebar_label: Configuring Extensions
description: Documentation for how to configure extensions in a Backstage app
---

All extensions in a Backstage app can be configured through static configuration. Use `app.extension` to configure extensions without changing their order, and
`app.extensions` when you also want to control their order. For more general information on how to write configuration for Backstage, see the section on [writing configuration](../../conf/writing.md).

## Extension Configuration Schema

This section focuses on the format of the `app.extensions` configuration and the various shorthands that are available.

The most complete and verbose format for configuring an individual extensions is as follows:

```yaml
app:
  extensions:
    - <id>:
        attachTo:
          id: <parent-id>
          input: <input-name>
        disabled: <true/false>
        config: <extension-specific-config->
```

All of the top-level fields are optional: `attachTo`, `disabled`, and `config`. Every extension implementation must provide defaults for all of these fields that will be used if they are not provided in the configuration.

The `disabled` field also accepts the strings 'true' and 'false', since environment variable substitution in configuration always produces a string rather than a real boolean.

Note that `app.extensions` is always an array rather than an object. For example, the following is invalid:

```yaml title="INVALID"
app:
  extensions:
    <id>: # Invalid, this should be an array item, `app.extensions` is now an object
      config: ...
```

In addition to this schema, there are a number of shorthands available:

Rather than a full object, you can specify just the ID of the extension as a string. This is equivalent to setting `disabled` to `false`:

```yaml
app:
  extensions:
    - ‘<id>’
```

You can enable/disable individual extension by ID, in this case the value is a boolean:

```yaml
app:
  extensions:
    - <id>: <true/false>
```

This also accepts the strings 'true' and 'false', so the value can come from an environment variable, e.g. `- <id>: ${SOME_EXTENSION_ENABLED}`.

## Override settings without changing order

The `app.extension` object maps extension IDs to settings. Each entry supports
`attachTo`, `disabled`, and `config`, as well as the boolean and boolean string
shorthands described above. For example, a map entry with key `page:catalog` and value `false` disables
the catalog page.

Settings in `app.extension` take precedence over matching settings in
`app.extensions`. Objects merge recursively, while arrays and primitive values
replace the corresponding values. Unspecified settings retain their values from
`app.extensions`, or the extension defaults when no list entry exists. A partial
`attachTo` override can change just the parent ID or input name.

Configuration files are merged before these overrides are applied. Setting a
map field to `null` removes that field from the map, allowing the corresponding
setting from `app.extensions` or the extension default to apply.

Use `app.extensions` to order extensions and `app.extension` to override settings:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:catalog:
        config:
          path: /catalog
    - page:scaffolder
  extension:
    page:catalog:
      config:
        title: Software catalog
```

The catalog page keeps its configured path and appears before the scaffolder
page. The map's property order never affects extension or contribution ordering.
Extensions configured only in the map keep their registered position after
extensions ordered by the list. Configuring an extension does not install its
plugin or make an unavailable extension available. Unknown IDs produce the same
diagnostics as unknown IDs in `app.extensions`. A settings object does not enable
a disabled extension unless you explicitly set `disabled: false`.

## Layer local configuration

Configuration arrays replace arrays from lower-priority files. Overriding one
entry in `app.extensions` in a local file therefore replaces the entire shared
list. The `app.extension` object supports normal
[configuration merging](../../conf/writing.md).

For example, add this local configuration alongside the shared configuration
above:

```yaml title="app-config.local.yaml"
app:
  extension:
    page:catalog:
      config:
        title: Local catalog
    page:scaffolder:
      disabled: true
```

The catalog page uses the local title and keeps `/catalog` as its path. The
scaffolder page is disabled, and the shared extension order is preserved. Other
shared map entries and unspecified settings are retained. To enable the scaffolder
page again, set `disabled: false` in a higher-priority configuration file.
