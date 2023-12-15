---
id: configuring
title: Configuring Utility APIs
sidebar_label: Configuring
# prettier-ignore
description: Configuring, extending, and overriding utility APIs
---

Utility APIs are extensions and can therefore optionally be amended with configurability, as well as inputs that other extensions attach themselves to. This section describes how to add those capabilities to your own utility APIs, and how to make use of them as a consumer of such utility APIs.

## Adding configurability

Here we will describe how to amend a utility API with the capability of being configured in app-config. You do this by giving a config schema to your API extension factory function.

Let's make the required additions to [our original work example](./02-creating.md) API.

```tsx title="in @internal/plugin-example"
import {
  createApiExtension,
  createApiFactory,
  createPlugin,
  /* highlight-add-next-line */
  createSchemaFromZod,
  storageApiRef,
  StorageApi,
} from '@backstage/frontend-plugin-api';
import { WorkApi, workApiRef } from '@internal/plugin-example-react';

/* highlight-add-start */
interface WorkApiConfig {
  goSlow: boolean;
}
/* highlight-add-end */

const workApi = createApiExtension({
  /* highlight-add-start */
  api: workApiRef,
  configSchema: createSchemaFromZod(z =>
    z.object({
      goSlow: z.boolean().default(false),
    }),
  ),
  /* highlight-add-end */
  /* highlight-remove-next-line */
  factory: createApiFactory({
  /* highlight-add-next-line */
  factory: ({ config }) => createApiFactory({
    api: workApiRef,
    deps: { storageApi: storageApiRef },
    factory: ({ storageApi }) => {
      /* highlight-add-start */
      if (config.goSlow) {
        /* ... */
      }
      /* highlight-add-end */
    },
  }),
});
```

We wanted users to be able to configure a `goSlow` parameter for our API instances. So we added another interface type for holding our various options, and passed in a `configSchema` to `createApiExtension` which matches that interface. This example builds it using [the zod library](https://zod.dev/). The actual config values will then be passed in to the `factory` which is now a callback, wherein we can do what we wish with them. When changing to the callback form, we also had to add a top level `api: workApiRef` under `createApiExtension`.

Note that while we use the word "config" here, it's _not_ the same thing as the `configApi` which gives you access to the full app-config. The config discussed here is instead the particular configuration settings given to your utility API instance. This is discussed more [in the section below](#configuring).

Note also that the config schema contained a default value fo the `goSlow` field. This is an important consideration. You want users of your API to be able to make maximum use of it, without having to dive deep into how to configure it. For that reason you generally want to provide as many sane defaults as possible, while letting users override them rarely but with purpose, only when called for. If you have a config schema without defaults, the framework will refuse to instantiate the utility API on startup unless the user had configured those values explicitly. Since it had a default value, the TypeScript code and interfaces also don't have to defensively allow `undefined` - we know that it'll have either the default value or an overridden value when we start consuming the config data.

## Configuring

> TODO

## Adding extension inputs

> TODO

## Adding data to extension inputs

> TODO

## Replacing a utility API implementation

> TODO
