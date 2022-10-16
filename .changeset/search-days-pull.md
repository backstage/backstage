---
'@backstage/plugin-search-react': minor
---

A `<SearchPagination />` component was created for limiting the number of results shown per search page. Use this new component to give users options to select how many search results they want to display per page. The default options are 10, 25, 50, 100.

See examples below:

_Basic_

```jsx
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Page, Header, Content, Lifecycle } from '@backstage/core-components';
import {
  SearchBarBase,
  SearchPaginationBase,
  SearchResultList,
} from '@backstage/plugin-search-react';

const SearchPage = () => {
  const [term, setTerm] = useState('');
  const [pageLimit, setPageLimit] = useState(25);
  const [pageCursor, setPageCursor] = useState<string>();

  return (
    <Page themeId="home">
      <Header title="Search" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchBarBase value={term} onChange={setTerm} />
          </Grid>
          <Grid item xs={12}>
            <SearchPaginationBase
              limit={pageLimit}
              onLimitChange={setPageLimit}
              cursor={pageCursor}
              onCursorChange={setPageCursor}
            />
          </Grid>
          <Grid item xs={12}>
            <SearchResultList query={{ term, pageLimit }} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
```

_With context_

```jsx
import React from 'react';
import { Grid } from '@material-ui/core';
import { Page, Header, Content, Lifecycle } from '@backstage/core-components';
import {
  SearchBar,
  SearchResult,
  SearchPagination,
  SearchResultListLayout,
  SearchContextProvider,
  DefaultResultListItem,
} from '@backstage/plugin-search-react';

const SearchPage = () => (
  <SearchContextProvider>
    <Page themeId="home">
      <Header title="Search" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchBar />
          </Grid>
          <Grid item xs={12}>
            <SearchPagination />
          </Grid>
          <Grid item xs={12}>
            <SearchResult>
              {({ results }) => (
                <SearchResultListLayout
                  resultItems={results}
                  renderResultItem={({ document }) => (
                    <DefaultResultListItem
                      key={document.location}
                      result={document}
                    />
                  )}
                />
              )}
            </SearchResult>
          </Grid>
        </Grid>
      </Content>
    </Page>
  </SearchContextProvider>
);
```
