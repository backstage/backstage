---
id: configuring
title: Configuring Utility APIs
sidebar_label: Configuring
# prettier-ignore
description: Configuring, extending, and overriding utility APIs
---

:::info
The new frontend system is in alpha and is only supported by a small number of plugins. If you want to use the new
plugin system, you must migrate your entire Backstage application or start a new application from scratch. We do not yet
recommend migrating any apps to the new system.
:::

Utility APIs are extensions and can therefore optionally be amended with configurability, as well as inputs that other extensions attach themselves to. This section describes how to make use of that as a consumer of such utility APIs.

## Configuring

To configure your Utility API extension, first you'll need to know its ID. That ID is formed from the API ref ID; check [the naming patterns docs](../architecture/50-naming-patterns.md) for details.

Our example work API from [the creating section](./02-creating.md) would have the ID `api:plugin.example.work`. You configure it and all other extensions under the `app.extensions` section of your app-config.

```yaml title="in e.g. app-config.yaml or app-config.production.yaml"
app:
  extensions:
    - api:plugin.example.work:
        config:
          goSlow: false
    -  # ... other extensions
```

It's important to note that the `extensions` are a list (mind the initial `-`), and that the `api:plugin.example.work` entry is an object such that the `config` key needs to be indented below it. If you do not get those two pieces right, the application may not start up correctly.

The extension config schema will tell you what parameters it supports. Here we override the `goSlow` extension config value, which replaces the default.

## Attaching extensions to inputs

Like with other extension types, you add input attachments to a Utility API by declaring the `attachTo` section of that attachment to point to the Utility APIs ID and input name.

Well written input-enabled extension often have extension creator functions that help you make such attachments. Those functions typically set the `attachTo` section correctly on your behalf so that you don't have to figure them out.

## Replacing a Utility API implementation

Like with other extension types, you replace Utility APIs with your own custom implementation using [extension overrides](../architecture/25-extension-overrides.md).

```tsx title="in your app"
/* highlight-add-start */
import { createFrontendModule } from '@backstage/frontend-plugin-api';

class CustomWorkImpl implements WorkApi {
  /* ... */
}

const workModule = createFrontendModule({
  pluginId: 'work',
  extensions: [
    ApiBlueprint.make({
      params: {
        factory: createApiFactory({
          api: workApiRef,
          factory: () => new CustomWorkImpl(),
        }),
      },
    }),
  ],
});
/* highlight-add-end */

// Remember to pass the overrides to your createApp
export default createApp({
  features: [
    // ... other features
    /* highlight-add-next-line */
    workModule,
  ],
});
```

In this example the overriding extension is kept minimal, but just like any other extension it can also have `deps`, configurability, and inputs. Check out [the Creating section](./02-creating.md) for more details about that.

When you create a replacement extension, in general you may want to mimic its extension config schema or input shapes where applicable. This makes it an easier thing to slot in to an app, since it'll be responding to extensibility the same way as the original one did.
