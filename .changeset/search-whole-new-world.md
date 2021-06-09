---
'@backstage/plugin-search': minor
---

This release represents a move out of a pre-alpha phase of the Backstage Search
plugin, into an alpha phase. With this release, you gain more control over the
layout of your search page on the frontend, as well as the ability to extend
search on the backend to encompass everything Backstage users may want to find.

If you are updating to this version of `@backstage/plugin-search` from a prior
release, you will need to make the following modifications to your App:

In your app package, create a new `searchPage` component at, for example,
`packages/app/src/components/search/SearchPage.tsx` with contents like the
following:

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

```tsx
import { searchPage } from './components/search/SearchPage';
// ...
<Route path="/search" element={<SearchPage />}>
  {searchPage}
</Route>;
```

You will also need to update your backend. For details, check the changeset for
`v0.2.0` of `@backstage/plugin-search-backend`.
