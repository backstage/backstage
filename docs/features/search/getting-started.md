---
id: getting-started
title: Getting Started with Search
description: How to set up and install Backstage Search
---

Search functions as a plugin to Backstage, so you will need to use Backstage to
use Search.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

> If you used `npx @backstage/create-app`, and you have a search page defined in
> `packages/app/src/components/search`, skip to
> [`Customizing Search`](#customizing-search) below.

## Adding Search to the Frontend

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-search @backstage/plugin-search-react
```

Create a new `packages/app/src/components/search/SearchPage.tsx` file in your
Backstage app with the following contents:

```tsx
import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid, List, Card, CardContent } from '@material-ui/core';
import {
  SearchBar,
  SearchResult,
  DefaultResultListItem,
  SearchFilter,
} from '@backstage/plugin-search-react';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';

export const searchPage = (
  <Page themeId="home">
    <Header title="Search" />
    <Content>
      <Grid container direction="row">
        <Grid item xs={12}>
          <SearchBar />
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <SearchFilter.Select
                name="kind"
                values={['Component', 'Template']}
              />
            </CardContent>
            <CardContent>
              <SearchFilter.Checkbox
                name="lifecycle"
                values={['experimental', 'production']}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <SearchResult>
            {({ results }) => (
              <List>
                {results.map(result => {
                  switch (result.type) {
                    case 'software-catalog':
                      return (
                        <CatalogSearchResultListItem
                          key={result.document.location}
                          result={result.document}
                          highlight={result.highlight}
                        />
                      );
                    default:
                      return (
                        <DefaultResultListItem
                          key={result.document.location}
                          result={result.document}
                          highlight={result.highlight}
                        />
                      );
                  }
                })}
              </List>
            )}
          </SearchResult>
        </Grid>
      </Grid>
    </Content>
  </Page>
);
```

Bind the above Search Page to the `/search` route in your
`packages/app/src/App.tsx` file, like this:

```tsx
import { SearchPage } from '@backstage/plugin-search';
import { searchPage } from './components/search/SearchPage';

const routes = (
  <FlatRoutes>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
  </FlatRoutes>
);
```

### Using the Search Modal

In `Root.tsx`, add the `SidebarSearchModal` component:

```bash
import { SidebarSearchModal } from '@backstage/plugin-search';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarSearchModal />
      <SidebarDivider />
...
```

For more information about using `Root.tsx`, please see
[the changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md#0315).

## Adding Search to the Backend

Add the following plugins into your backend app:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
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
import { Router } from 'express';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const searchEngine = new LunrSearchEngine({
    logger: env.logger,
  });
  const indexBuilder = new IndexBuilder({
    logger: env.logger,
    searchEngine,
  });

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

  const { scheduler } = await indexBuilder.build();

  scheduler.start();
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    logger: env.logger,
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

### Frontend

The Search Plugin web library (`@backstage/plugin-search-react`) exposes several default filter types as static properties,
including `<SearchFilter.Select />` and `<SearchFilter.Checkbox />`. These allow
you to provide values relevant to your Backstage instance that, when selected,
get passed to the backend.

```tsx {2-5,8-11}
<CardContent>
  <SearchFilter.Select
    name="kind"
    values={['Component', 'Template']}
  />
</CardContent>
<CardContent>
  <SearchFilter.Checkbox
    name="lifecycle"
    values={['production', 'experimental']}
  />
</CardContent>
```

If you have advanced filter needs, you can specify your own filter component
like this (although new core filter contributions are welcome):

```tsx
import { useSearch, SearchFilter } from '@backstage/plugin-search-react';

const MyCustomFilter = () => {
  // Note: filters contain filter data from other filter components. Be sure
  // not to clobber other filters' data!
  const { filters, setFilters } = useSearch();

  return (/* ... */);
};

// Which could be rendered like this:
<SearchFilter component={MyCustomFilter} />
```

It's good practice for search results to highlight information that was used to
return it in the first place! The code below highlights how you might specify a
custom result item component, using the `<CatalogSearchResultListItem />` component as
an example:

```tsx {7-13}
<SearchResult>
  {({ results }) => (
    <List>
      {results.map(result => {
        // result.type is the index type defined by the collator.
        switch (result.type) {
          case 'software-catalog':
            return (
              <CatalogSearchResultListItem
                key={result.document.location}
                result={result.document}
                highlight={result.highlight}
              />
            );
          // ...
        }
      })}
    </List>
  )}
</SearchResult>
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
a scheduled `TaskRunner` to pass into the `schedule` value, like this:

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

Note: if you are using the in-memory Lunr search engine, you probably want to
implement a non-distributed `TaskRunner` like the following to ensure consistency
if you're running multiple search backend nodes (alternatively, you can configure
the search plugin to use a non-distributed database such as
[SQLite](../../tutorials/configuring-plugin-databases.md#postgresql-and-sqlite-3)):

```typescript
import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';

const schedule: TaskRunner = {
  run: async (task: TaskInvocationDefinition) => {
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

> For more advanced customization of the Search backend, also see how to guides such as [How to index TechDocs documents](./how-to-guides.md#how-to-index-techdocs-documents) and [How to limit what can be searched in the Software Catalog](./how-to-guides.md#how-to-limit-what-can-be-searched-in-the-software-catalog)
