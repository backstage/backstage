---
id: configuring-extensions
title: Configuring Extensions in the App
sidebar_label: Configuring Extensions
description: Documentation for how to configure extensions in a Backstage app
---

All extensions in a Backstage app can be configured through static configuration.
Use `app.extension` to configure extensions without changing their order, and
`app.extensions` when you also want to control their order. For more general
information, see [writing configuration](../../conf/writing.md).

## Extension configuration schema

The `app.extension` object maps extension IDs to settings. The full format for
configuring an individual extension is as follows:

```yaml
app:
  extension:
    <id>:
      attachTo:
        id: <parent-id>
        input: <input-name>
      disabled: <true/false>
      config: <extension-specific-config>
```

All of the top-level fields are optional: `attachTo`, `disabled`, and `config`.
Every extension implementation provides defaults that are used when settings
are not provided in configuration. When you specify `attachTo`, provide both the
parent ID and input name. A settings object does not enable a disabled extension
unless you explicitly set `disabled: false`.

The `disabled` field also accepts the strings `'true'` and `'false'`, since
environment variable substitution in configuration produces a string.

You can also enable or disable an extension using a boolean shorthand:

```yaml
app:
  extension:
    <id>: <true/false>
```

This accepts the strings `'true'` and `'false'` too, so you can use an environment
variable, for example `<id>: ${SOME_EXTENSION_ENABLED}`.

The map's property order never affects extension or contribution ordering.
Configuring an extension does not install its plugin or make an unavailable
extension available. Unknown IDs produce the same diagnostics as unknown IDs in
`app.extensions`.

## Control extension order

Use the `app.extensions` array to put extensions in a specific order. Extensions
listed in this array appear before other extensions, which keep their registered
order. Settings in `app.extension` apply without changing that order, including
for extensions that are not listed in the array.

```yaml title="app-config.yaml"
app:
  extensions:
    - page:catalog
    - page:scaffolder
  extension:
    page:catalog:
      config:
        path: /catalog
        title: Software catalog
```

The catalog page appears before the scaffolder page, regardless of the order of
entries in `app.extension`.

The array also accepts extension settings using the same object and boolean
shorthands as the map. A bare extension ID in the array is equivalent to
`disabled: false`. Use `app.extension` for settings that do not need to control
ordering.

## Settings precedence

Each field supplied in `app.extension` takes precedence over the corresponding
field in `app.extensions`. Unspecified fields retain their values from the
array, or the extension defaults if no array setting exists. In particular,
`disabled: false` overrides `disabled: true`.

The `config` objects in the two sections are **not merged**. Providing `config`
in the map replaces the entire `config` from the array, even if the map's
`config` is empty. For example:

```yaml
app:
  extensions:
    - page:catalog:
        config:
          path: /old-catalog
          title: Shared catalog
  extension:
    page:catalog:
      config:
        path: /catalog
```

The catalog page receives only `path: /catalog` as its configuration. The title
from the array is not retained. If you only supply `disabled` in the map, the
array's `config` is retained.

## Layer local configuration

Configuration arrays replace arrays from lower-priority files. Overriding one
entry in `app.extensions` in a local file therefore replaces the entire shared
list. The `app.extension` object supports normal
[configuration merging](../../conf/writing.md) across files: objects merge
recursively, while arrays and primitive values are replaced.

For example, add this local configuration alongside the shared configuration in
[Control extension order](#control-extension-order):

```yaml title="app-config.local.yaml"
app:
  extension:
    page:catalog:
      config:
        title: Local catalog
    page:scaffolder:
      disabled: true
```

The catalog page uses the local title and keeps `/catalog` as its path because
both values come from `app.extension`. The scaffolder page is disabled, and the
shared extension order is preserved. Other shared map entries and unspecified
map settings are retained. To enable the scaffolder page again, set
`disabled: false` in a higher-priority configuration file.

Configuration files are merged before the map settings are applied to
extensions. Setting a map field to `null` removes that field from the map. If you
remove the entire `config` field, the array's `config` or the extension default
applies instead. Removing a field inside the map's `config` does not restore
that field from the array's `config`.
