---
id: configuring-extensions
title: Configuring Extensions in the App
sidebar_label: Configuring Extensions
# prettier-ignore
description: Documentation for how to configure extensions in a Backstage app
---

All extensions in a Backstage app can be configured through static configuration. This configuration is all done under the `app.extensions` configuration key. For more general information on how to write configuration for Backstage, see the section on [writing configuration](../../conf/writing.md).

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
app:
  extensions:
    - <id>: <true/false>
```
