---
'@backstage/plugin-search-react': minor
---

A `<SearchResultLimiter />` component was created for limiting the number of results shown per search page.
Use this new component to give users a combination of options to define how many search results they want to display per page.
The default options are 10, 25, 50, 100.

See examples below:

_Basic_

```jsx
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Page, Header, Content, Lifecycle } from '@backstage/core-components';
import {
  SearchBarBase,
  SearchResultLimiterBase,
  SearchResultList,
} from '@backstage/plugin-search-react';

const SearchPage = () => {
  const [term, setTerm] = useState('');
  const [pageLimit, setPageLimit] = useState(25);

  return (
    <Page themeId="home">
      <Header title="Search" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchBarBase value={term} onChange={setTerm} />
          </Grid>
          <Grid item xs={12}>
            <SearchResultLimiterBase
              value={pageLimit}
              onChange={setPageLimit}
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
  SearchResultLimiter,
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
            <SearchResultLimiter />
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
