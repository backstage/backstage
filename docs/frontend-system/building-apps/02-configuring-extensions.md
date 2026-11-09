---
id: configuring-extensions
title: Configuring Extensions in the App
sidebar_label: Configuring Extensions
description: Documentation for how to configure extensions in a Backstage app
---

Use the object form of `app.extensions` to configure extensions and order their
inputs. Settings merge across configuration files, so a local file can override
one extension without replacing the shared configuration. Object property order
does not affect extension order. For general configuration guidance, see
[writing configuration](../../conf/writing.md).

## Extension settings

The object is keyed by extension ID. Each entry accepts `attachTo`, `disabled`,
`config`, and `inputs`. All fields are optional.

```yaml title="app-config.yaml"
app:
  extensions:
    page:catalog:
      config:
        path: /catalog
        title: Software catalog
    page:scaffolder:
      disabled: true
```

Omitted settings use the extension defaults. Configuring an extension does not
install its plugin or bypass its availability conditions. A settings object does
not enable a disabled extension unless you set `disabled: false`.

You can also use boolean shorthands to enable or disable extensions:

```yaml
app:
  extensions:
    page:scaffolder: true
    entity-card:catalog/links: false
```

Both the shorthand and `disabled` accept the strings `'true'` and `'false'`, so
they can be supplied through environment variable substitution.

To change an attachment, supply both the parent ID and input name:

```yaml
app:
  extensions:
    entity-card:catalog/links:
      attachTo:
        id: entity-content:catalog/overview
        input: cards
```

## Order extension inputs

Configure `inputs.<input-name>.order` on the receiving extension. The array lists
child extension IDs in the desired order. Unlisted children follow in their
existing order. Put `'*'` in the array to place those unlisted children between
explicitly ordered entries instead.

```yaml title="app-config.yaml"
app:
  extensions:
    app/routes:
      inputs:
        routes:
          order:
            - page:catalog
            - page:scaffolder
            - '*'
    page:catalog/entity:
      inputs:
        contents:
          order:
            - entity-content:catalog/overview
            - entity-content:techdocs
            - '*'
            - entity-content:kubernetes/kubernetes
    entity-content:catalog/overview:
      inputs:
        cards:
          order:
            - entity-card:catalog/about
            - entity-card:catalog/links
```

Each input has its own order. The example orders pages, entity-page content, and
cards independently. The sidebar uses the order of discovered pages in
`app/routes.routes`.

Ordering is applied after attachments are resolved, including redirected inputs.
It never moves children between inputs, enables disabled extensions, or makes an
unavailable extension available. IDs that are absent from the input are ignored,
so the same configuration can be used with optional plugins. An empty order array
keeps the existing child order.

The catalog entity page honors explicit `inputs.contents.order` over alphabetical
content sorting within each group. Group order still follows the configured group
definitions. Without an explicit input order,
its existing sorting settings continue to apply. Other extensions may transform
or sort their inputs when presenting them; input ordering determines the sequence
delivered to their factory.

## Layer configuration files

For example, this local configuration overrides the shared catalog title and card
order without replacing settings for other extensions or inputs:

```yaml title="app-config.local.yaml"
app:
  extensions:
    page:catalog:
      config:
        title: Local catalog
    entity-content:catalog/overview:
      inputs:
        cards:
          order:
            - entity-card:catalog/about
            - '*'
            - entity-card:catalog/links
```

Objects merge recursively across files. Arrays, including an individual input's
`order`, replace their lower-priority values. Frontend configuration filtering
removes `null` values before configuration files are merged; do not rely on `null`
to clear a setting from a lower-priority file.

## Configuration errors and fallbacks

Invalid extension settings are reported through app errors. The app's error
policy determines whether an error prevents startup or is logged as a warning.
Malformed settings use `EXTENSION_CONFIG_INVALID`; unknown inputs use
`EXTENSION_CONFIGURATION_INVALID`. Both are fatal by default in
`maybeCreateErrorPage` from `@backstage/frontend-defaults`. Its `warningCodes`
option can classify them as warnings instead.

Fallbacks remain available when the app is allowed to continue:

- Invalid extension entries are ignored, retaining the extension defaults.
- Invalid input settings or order values are ignored, retaining existing order.
- Invalid entries within an order array are skipped.
- Duplicate ordering IDs and duplicate wildcards are reported, and only their first
  occurrence is used.
- Unknown input names are reported, and their settings are ignored.

## Legacy array form

The array form of `app.extensions` remains supported with its existing behavior:
listed extensions establish global order before unlisted extensions. A bare ID
or boolean `true` enables an extension, and an object entry without `disabled`
also enables it.

```yaml
app:
  extensions:
    - page:catalog
    - page:scaffolder:
        disabled: true
```

Array entries accept the same settings, including input ordering. An explicit
input order takes precedence over the array's global order for that input.

Use the object form for new configuration. When one configuration file uses an
array and another uses an object at `app.extensions`, the higher-priority value
replaces the entire lower-priority value. Migrate shared configuration to objects
to compose per-extension overrides across files.
