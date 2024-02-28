---
id: configuring-extensions
title: Configuring Extensions in the App
sidebar_label: Configuring Extensions
# prettier-ignore
description: Documentation for how to configure extensions in a Backstage app
---

All extensions in a Backstage app can be configured through static configuration. This configuration is all done under a the `app.extensions` configuration key. For more general information on how to write configuration for Backstage, see the section on [writing configuration](../../conf/writing.md).

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
extensions:
  - <id>: <true/false>
```

You can override the implementation of an extension by ID, in this case the value is a string:

```yaml
extensions:
  - <id>: ‘<implementation-reference>’
```

You can **create a new extension instance with a generated ID** by including an input name in the key:

```yaml
extensions:
  - <parent-id>/<parent-input>:
      extension: <implementation-reference>
      config: <configuration-object>
```

This syntax is only for use in the app configuration itself, every extension provided by default from a plugin must have an explicit ID. For example, the following two configurations are equivalent, except that the former does not have an explicit instance ID:

```yaml
extensions:
  # Generated ID
  - core.router/routes:
      extension: '@backstage/plugin-tech-radar#TechRadarPage'
  # Explicit ID
  - tech-radar.page:
      at: core.router/routes
      extension: '@backstage/plugin-tech-radar#TechRadarPage'
```

Lastly, if you do not need to provide additional configuration, you can combine the key input format with the implementation value format as a shorthand for creating a new extension instance with a generated ID and no configuration:

```yaml
extensions:
  - <parent-id>/<parent-input>: ‘<implementation-reference>’
```

For example:

```yaml
extensions:
  - core.router/routes: '@backstage/plugin-tech-radar#TechRadarPage'
```
