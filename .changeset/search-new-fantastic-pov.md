---
'@backstage/plugin-search-backend': minor
'@backstage/plugin-search-backend-node': minor
---

This release represents a move out of a pre-alpha phase of the Backstage Search
plugin, into an alpha phase. With this release, you gain more control over the
layout of your search page on the frontend, as well as the ability to extend
search on the backend to encompass everything Backstage users may want to find.

If you are updating to version `v0.4.0` of `@backstage/plugin-search` from a
prior release, you will need to make modifications to your app backend.

First, navigate to your backend package and install the two related search
backend packages:

```sh
cd packages/backend
yarn add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
```

Wire up these new packages into your app backend by first creating a new
`search.ts` file at `src/plugins/search.ts` with contents like the following:

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
  // Initialize a connection to a search engine.
  const searchEngine = new LunrSearchEngine({ logger });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  // Collators are responsible for gathering documents known to plugins. This
  // particular collator gathers entities from the software catalog.
  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: new DefaultCatalogCollator({ discovery }),
  });

  // The scheduler controls when documents are gathered from collators and sent
  // to the search engine for indexing.
  const { scheduler } = await indexBuilder.build();

  // A 3 second delay gives the backend server a chance to initialize before
  // any collators are executed, which may attempt requests against the API.
  setTimeout(() => scheduler.start(), 3000);
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    logger,
  });
}
```

Then, ensure the search plugin you configured above is initialized by modifying
your backend's `index.ts` file in the following ways:

```diff
+import search from './plugins/search';
// ...
+const searchEnv = useHotMemoize(module, () => createEnv('search'));
// ...
+apiRouter.use('/search', await search(searchEnv));
// ...
```
