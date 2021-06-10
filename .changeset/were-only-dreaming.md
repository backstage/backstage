---
'@backstage/create-app': patch
---

Added "out-of-the-box" alpha-milestone search features to scaffolded Backstage apps.

To apply this change to an existing app, do the following...

First, navigate to your backend package and install the two new search backend
packages:

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

In your frontend app package, create a new `searchPage` component at, for
example, `packages/app/src/components/search/SearchPage.tsx` with contents like
the following:

```tsx
import React from 'react';
import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';

import { Content, Header, Lifecycle, Page } from '@backstage/core';
import { CatalogResultListItem } from '@backstage/plugin-catalog';
import {
  SearchBar,
  SearchFilter,
  SearchResult,
  DefaultResultListItem,
} from '@backstage/plugin-search';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
}));

const SearchPage = () => {
  const classes = useStyles();

  return (
    <Page themeId="home">
      <Header title="Search" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.bar}>
              <SearchBar debounceTime={100} />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.filters}>
              <SearchFilter.Select
                className={classes.filter}
                name="kind"
                values={['Component', 'Template']}
              />
              <SearchFilter.Checkbox
                className={classes.filter}
                name="lifecycle"
                values={['experimental', 'production']}
              />
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ type, document }) => {
                    switch (type) {
                      case 'software-catalog':
                        return (
                          <CatalogResultListItem
                            key={document.location}
                            result={document}
                          />
                        );
                      default:
                        return (
                          <DefaultResultListItem
                            key={document.location}
                            result={document}
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
};

export const searchPage = <SearchPage />;
```

Then in `App.tsx`, import this new `searchPage` component, and set it as a
child of the existing `<SearchPage />` route so that it looks like this:

```diff
+import { searchPage } from './components/search/SearchPage';
// ...
-<Route path="/search" element={<SearchPage />} />
+<Route path="/search" element={<SearchPage />}>
+  {searchPage}
+</Route>;
```
