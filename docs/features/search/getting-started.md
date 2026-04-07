---
id: getting-started
title: Getting Started with Search
description: How to set up and install Backstage Search
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./getting-started--old.md)
instead.
::::

Search functions as a plugin to Backstage, so you will need to use Backstage to
use Search.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

## Adding Search to the Frontend

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage/plugin-search @backstage/plugin-search-react
```

Once installed, the search plugin is automatically available in your app through
the default feature discovery. It provides a search page at `/search`, a search
navigation item in the sidebar, and a search modal accessible from the sidebar.
For more details and alternative installation methods, see
[installing plugins](../../frontend-system/building-apps/05-installing-plugins.md).

### Configuring the search page

The search page can be configured through `app-config.yaml`. For example, to
disable search result tracking:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:search:
        config:
          noTrack: true
```

### Search result list items

The search page automatically discovers and uses search result list item
extensions provided by installed plugins. For example, the catalog plugin
provides a `CatalogSearchResultListItem` and the TechDocs plugin provides a
`TechDocsSearchResultListItem`. These are automatically registered when the
respective plugins are installed.

You can also install additional search result list item extensions using the
`SearchResultListItemBlueprint` from `@backstage/plugin-search-react/alpha`.

### Search filters

Similarly, search filter extensions are automatically discovered. You can add
custom filters using the `SearchFilterBlueprint` or
`SearchFilterResultTypeBlueprint` from `@backstage/plugin-search-react/alpha`.

## Adding Search to the Backend

Add the following plugins into your backend app:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend @backstage/plugin-search-backend-module-pg @backstage/plugin-search-backend-module-catalog @backstage/plugin-search-backend-module-techdocs
```

Then add the following lines:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));
/* highlight-add-end */

backend.start();
```

With the above setup Search will use the [Lunr](https://github.com/olivernn/lunr.js) in-memory Search Engine but if your have Postgres setup as your database then it will use Postgres as your Search Engine. Learn more in the [Search Engines](./search-engines.md) documentation.

The above also sets up two Collators for you - Catalog and TechDocs - which will index content from these two locations so that you can easily search them. Learn more in the [Collators documentation](./collators.md).

## Customizing Search

### Frontend

The search plugin provides extension points for customizing the search
experience through blueprints. You can add custom search result list items,
filters, and result type filters.

For example, to create a custom search result list item, use the
`SearchResultListItemBlueprint` from `@backstage/plugin-search-react/alpha`:

```tsx
import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';

export const MySearchResultListItem = SearchResultListItemBlueprint.make({
  name: 'my-result-item',
  params: {
    predicate: result => result.type === 'my-custom-type',
    component: async () => {
      const { MyResultItem } = await import('./components/MyResultItem');
      return MyResultItem;
    },
  },
});
```

Install this in your app by wrapping it in a frontend module and passing it to `createApp`:

```tsx title="packages/app/src/search/searchModule.ts"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { MySearchResultListItem } from './MySearchResultListItem';

export const searchCustomizations = createFrontendModule({
  pluginId: 'search',
  extensions: [MySearchResultListItem],
});
```

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { searchCustomizations } from './search/searchModule';

const app = createApp({
  features: [searchCustomizations],
});

export default app.createRoot();
```

> For more advanced customization of the Search frontend, also see how to guides such as [How to implement your own Search API](./how-to-guides.md#how-to-implement-your-own-search-api) and [How to customize search results highlighting styling](./how-to-guides.md#how-to-customize-search-results-highlighting-styling)

### Backend

Backstage Search isn't a search engine itself, rather, it provides an interface
between your Backstage instance and a
[Search Engine](./concepts.md#search-engines) of your choice. Currently, we only
support two engines, an in-memory search Engine called Lunr and Elasticsearch.
See [Search Engines](./search-engines.md) documentation for more information how
to configure these in your Backstage instance.

Backstage Search can be used to power search of anything! Plugins like the
Catalog offer default [collators](./concepts.md#collators) (e.g.
[DefaultCatalogCollator](https://github.com/backstage/backstage/blob/df12cc25aa4934a98bc42ed03c07f64a1a0a9d72/plugins/catalog-backend/src/search/DefaultCatalogCollator.ts))
which are responsible for providing documents
[to be indexed](./concepts.md#documents-and-indices). You can register any
number of collators with the `IndexBuilder` like this:

```typescript
const indexBuilder = new IndexBuilder({ logger: env.logger, searchEngine });

const every10MinutesSchedule = env.scheduler.createScheduledTaskRunner({
  frequency: { minutes: 10 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 3 },
});

const everyHourSchedule = env.scheduler.createScheduledTaskRunner({
  frequency: { hours: 1 },
  timeout: { minutes: 90 },
  initialDelay: { seconds: 3 },
});

indexBuilder.addCollator({
  schedule: every10MinutesSchedule,
  factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
    discovery: env.discovery,
    tokenManager: env.tokenManager,
  }),
});

indexBuilder.addCollator({
  schedule: everyHourSchedule,
  factory: new MyCustomCollatorFactory(),
});
```

Backstage Search builds and maintains its index
[on a schedule](./concepts.md#the-scheduler). You can change how often the
indexes are rebuilt for a given type of document. You may want to do this if
your documents are updated more or less frequently. You can do so by configuring
a scheduled `SchedulerServiceTaskRunner` to pass into the `schedule` value, like this:

```typescript {3}
const every10MinutesSchedule = env.scheduler.createScheduledTaskRunner({
  frequency: { minutes: 10 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 3 },
});

indexBuilder.addCollator({
  schedule: every10MinutesSchedule,
  factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
    discovery: env.discovery,
    tokenManager: env.tokenManager,
  }),
});
```

:::note Note

if you are using the in-memory Lunr search engine, you probably want to
implement a non-distributed `SchedulerServiceTaskRunner` like the following to ensure consistency
if you're running multiple search backend nodes (alternatively, you can configure
the search plugin to use a non-distributed database such as
[SQLite](../../tutorials/configuring-plugin-databases.md#postgresql-and-sqlite-3)):

:::

```typescript
import {
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskInvocationDefinition,
} from '@backstage/backend-plugin-api';

const schedule: SchedulerServiceTaskRunner = {
  run: async (task: SchedulerServiceTaskInvocationDefinition) => {
    const startRefresh = async () => {
      while (!task.signal?.aborted) {
        try {
          await task.fn(task.signal);
        } catch {
          // ignore intentionally
        }

        await new Promise(resolve => setTimeout(resolve, 600 * 1000));
      }
    };
    startRefresh();
  },
};

indexBuilder.addCollator({
  schedule,
  factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
    discovery: env.discovery,
    tokenManager: env.tokenManager,
  }),
});
```

> For more advanced customization of the Search backend, also see how to guides such as [How to customize fields in the Software Catalog or TechDocs index](./how-to-guides.md#how-to-customize-fields-in-the-software-catalog-or-techdocs-index)
