---
id: migrating
title: Migrating Utility APIs from the old frontend system
sidebar_label: Migrating
# prettier-ignore
description: Migrating Utility APIs from the old frontend system
---

If you are migrating your plugins or app over from the old frontend system, there are a few things to keep in mind in regards to utility APIs.

## Overview

- Migrate your repo overall to the latest release of Backstage
- Follow the plugin migration guide <!-- TODO: Link -->
- Change your package dependencies from `core-*-api` to `frontend-*-api`
- Change the imports in your code from `core-*-api` to `frontend-*-api`
- Keep the TypeScript interface and API ref exported as they were, except possibly reconsidering the choice of ID of the latter
- Wrap the old API factory call in an extension using `createApiExtension`
- Make sure that this extension is referenced by your migrated plugin

## Prerequisites

This guide assumes that you first [upgrade your repo](../../getting-started/keeping-backstage-updated.md) to the latest release of Backstage. This ensures that you do not have to fight several types of incompatibilities and updates at the same time.

## Dependency changes

In this article we will discuss some interfaces that you used to import from the `@backstage/core-plugin-api` package. Those are now generally moved over to `@backstage/frontend-plugin-api`, so you will want to update both your `package.json` and your source code. This applies both in your `-react` package and your main plugin package.

First `package.json`. The following commands are examples - note that they refer to `plugins/example`, which you'll have to update to the actual folder name that your package to migrate is in.

```bash title="from your repo root"
yarn --cwd plugins/example remove @backstage/core-plugin-api ;
yarn --cwd plugins/example add @backstage/frontend-plugin-api
```

Now in all of the code files in that package:

```tsx title="in your source code"
/* highlight-remove-next-line */
import { createApiRef } from '@backstage/core-plugin-api';
/* highlight-add-next-line */
import { createApiRef } from '@backstage/frontend-plugin-api';
```

These can typically be search-and-replaced wholesale - the interfaces in the new package are mostly identical to the old one. The `createApiRef` is just an example, and the same replacement makes sense for all of the other symbols from the core package as well.

## React package interface and ref changes

Let's begin with [your `-react` package](../../architecture-decisions/adr011-plugin-package-structure.md). The act of exporting TypeScript interfaces and API refs have not changed from the old system. You can typically keep those as-is. For illustrative purposes, this is an example of an interface and its API ref:

```tsx title="in @internal/plugin-example-react"
import { createApiRef } from '@backstage/frontend-plugin-api';

/**
 * Performs some work.
 * @oublic
 */
export interface WorkApi {
  doWork(): Promise<void>;
}

/**
 * The work interface for the Example plugin.
 * @public
 */
export const workApiRef = createApiRef<WorkApi>({
  id: 'plugin.example.work',
});
```

In this example, the plugin ID already follows <!-- TODO: Link --> the common naming convention. If it doesn't, you may want to consider renaming that ID at this point. Don't worry, this won't hurt consumers in the old frontend system since the ID is mostly used for debugging purposes there. In the new system, it's much more important and appears in app-config files and similar.

Note at the top of the file that it uses the updated import from `@backstage/frontend-plugin-api` that we migrated in the previous section, instead of the old `@backstage/core-plugin-api`.

## Plugin package changes

Now let's turn to the main plugin package where the plugin itself is exported. You will probably already have a `createPlugin` call in here. Before we changed the `core-plugin-api` imports it'll have looked somewhat similar to the following:

```tsx title="in @internal/plugin-example, NOTE THIS IS LEGACY CODE"
import {
  configApiRef,
  createPlugin,
  createApiFactory,
} from '@backstage/core-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';
import { WorkImpl } from './WorkImpl';

const workApi = createApiFactory({
  api: workApiRef,
  deps: { configApi: configApiRef },
  factory: ({ configApi }) => new WorkImpl({ configApi }),
});

/** @public */
export const catalogPlugin = createPlugin({
  id: 'example',
  apis: [workApi],
});
```

The major changes we'll make are

- Change the import to the new package as per the top section of this guide
- Wrap the existing API factory in a `createApiExtension`
- Change to the new version of `createPlugin` which exports this extension
- Change the plugin export to be the default instead

```tsx title="in @internal/plugin-example"
import {
  configApiRef,
  createPlugin,
  createApiFactory,
  createApiExtension,
} from '@backstage/frontend-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';
import { WorkImpl } from './WorkImpl';

const workApi = createApiExtension({
  api: workApiRef,
  factory: () =>
    // The factory itself is unchanged
    createApiFactory({
      api: workApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => new WorkImpl({ configApi }),
    }),
});

/** @public */
export default createPlugin({
  id: 'example',
  extensions: [workApi],
});
```

## Further work

Since utility APIs are now complete extensions, you may want to take a bigger look at how they used to be used, and what the new frontend system offers. You may for example consider [adding configurability or inputs](./04-configuring.md) to your API, if that makes sense for your current application.
