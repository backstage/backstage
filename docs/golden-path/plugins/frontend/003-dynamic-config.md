---
id: dynamic-config
sidebar_label: 003 - Dynamic Config
title: 003 - Dynamic Config
description: How to use dynamic configuration to control frontend plugin components
---

Your plugin was generated for the frontend system, which is config-first.
That means you can control frontend components through `app-config.yaml`
without changing any code.

## Disabling an extension

Every extension in the frontend system can be toggled on or off through
configuration. To disable the todo page entirely, add the following to your
`app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - 'page:todo': false
```

Start the app and try navigating to `/todo` — you get a "page not found"
response. Remove the line (or set it to `true`) to bring it back.

## Configuring an extension

Every extension blueprint supports its own set of configuration options that
adopters can set through `app-config.yaml`. `PageBlueprint` supports `path`
and `title` out of the box. To change the page title, add the following:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:todo:
        config:
          title: My Custom Todo List
```

Restart the app and you should see "My Custom Todo List" as the page title.
No code changes needed — the `PageBlueprint` reads the `title` config and
passes it to the page header automatically.

## Adding custom configuration

When the built-in config options are not enough, you can define your own
config schema. Values are validated automatically and passed to your
extension factory so that your components never need to read raw
configuration directly.

For example, let's add a configurable subtitle. In `plugin.tsx`, switch
from `PageBlueprint.make` to `PageBlueprint.makeWithOverrides` and declare
a config schema:

```tsx
export const page = PageBlueprint.makeWithOverrides({
  config: {
    schema: {
      subtitle: z => z.string().optional(),
    },
  },
  factory(origFactory, { config }) {
    return origFactory({
      path: '/todo',
      routeRef: rootRouteRef,
      loader: () =>
        import('./components/TodoPage').then(m => (
          <m.TodoPage subtitle={config.subtitle} />
        )),
    });
  },
});
```

Then update `TodoPage` to accept the new prop and render it:

```tsx
export function TodoPage({ subtitle }: { subtitle?: string }) {
  // ... existing component code
  return (
    <Container>
      {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
      {/* rest of the page */}
    </Container>
  );
}
```

Adopters can now set the subtitle in their `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:todo:
        config:
          subtitle: Things to get done today
```

The value flows from configuration, through the schema validation, into the
factory function, and finally into the component as a prop — no `configApiRef`
needed.

## Why does this work?

The frontend system treats configuration as a first-class concept.
Each extension is registered with the app under a unique ID (for example,
`page:todo`). The app reads the `app.extensions` section of the configuration
to decide which extensions to enable, disable, or reconfigure.

Extension blueprints declare a `config.schema` using
[Zod](https://zod.dev/) validators. When the app starts, the framework
parses and validates the configuration against the schema, then passes the
result to the extension's factory function. This means your components
receive typed, validated values instead of reading raw configuration
strings at runtime.

This config-first approach means that adopters of your plugin can customize
its behavior without forking the code — they only need to adjust their
configuration files.
