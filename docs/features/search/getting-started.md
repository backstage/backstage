---
id: getting-started
title: Getting Started with Search
description: How to set up and install Backstage Search
---

# Getting Started

Search functions as a plugin to Backstage, so you will need to use Backstage to
use Search.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

> If you used `npx @backstage/create-app`, Search may already be present.
>
> You should skip to [`Customizing Search`](#customizing-search) below.

## Adding Search to the Frontend

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-search
```

TODO: Add frontend instructions here.

## Adding Search to the Backend

Add the following plugins into your backend app:

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
```

Create a `packages/backend/src/plugins/search.ts` file containing the following
code:

```typescript
import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

export default async function createPlugin({
  logger,
  discovery,
}: PluginEnvironment) {
  const searchEngine = new LunrSearchEngine({ logger });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  indexBuilder.addCollator({
    type: 'software-catalog',
    defaultRefreshIntervalSeconds: 600,
    collator: new DefaultCatalogCollator({ discovery }),
  });

  const { scheduler } = await indexBuilder.build();

  scheduler.start();
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    logger,
  });
}
```

Make the following modifications to your `packages/backend/src/index.ts` file:

Import the `plugins/search` file you created above:

```typescript
import search from './plugins/search';
```

Set up an environment for search:

```typescript
const searchEnv = useHotMemoize(module, () => createEnv('search'));
```

Register the search service with the router:

```typescript
apiRouter.use('/search', await search(searchEnv));
```

## Customizing Search

Backstage Search isn't a search engine itself, rather, it provides an interface
between your Backstage instance and a Search Engine of your choice. Currently,
we only support one, in-memory search Engine called Lunr. It can be instantiated
like this:

```typescript
const searchEngine = new LunrSearchEngine({ logger });
const indexBuilder = new IndexBuilder({ logger, searchEngine });
```

Backstage Search can be used to power search of anything! Plugins like the
Catalog offer default "collators" which are responsible for providing documents
to be indexed. You can register any number of collators with the `IndexBuilder`
like this:

```typescript
const indexBuilder = new IndexBuilder({ logger, searchEngine });

indexBuilder.addCollator({
  type: 'software-catalog',
  defaultRefreshIntervalSeconds: 600,
  collator: new DefaultCatalogCollator({ discovery }),
});

indexBuilder.addCollator({
  type: 'my-custom-stuff',
  defaultRefreshIntervalSeconds: 3600,
  collator: new MyCustomCollator(),
});
```

Backstage Search builds and maintains its index on a schedule. You can change
how often the indexes are rebuilt for a given type of document. You may want to
do this if your documents are updated more or less frequently. You can do so by
modifying its `defaultRefreshIntervalSeconds` value, like this:

```typescript {3}
indexBuilder.addCollator({
  type: 'software-catalog',
  defaultRefreshIntervalSeconds: 600,
  collator: new DefaultCatalogCollator({ discovery }),
});
```

---

[Primarily solves for “As an App Integrator, I should be able to install out-of
the-box Search”]

Backend: Different for new Backstage instances (created via create-app) vs.
people enabling search on existing Backstage instances (see catalog install for
example).

Frontend: Search Page Route…? Customizing result components…?

Conceptually… What’s the difference between “out-of-the-box” or “basic” and the
recommended deployment (which will come)
