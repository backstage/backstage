---
'@backstage/plugin-search-react': minor
---

The `<SearchResult/>` component now accepts a optional `query` prop to request results from the search api:

> Note: If a query prop is not defined, the results will by default be consumed from the context.

Example:

```jsx
import React, { useState, useCallback } from 'react';

import { Grid, List, Paper } from '@material-ui/core';

import { Page, Header, Content, Lifecycle } from '@backstage/core-components';
import {
  DefaultResultListItem,
  SearchBarBase,
  SearchResult,
} from '@backstage/plugin-search-react';

const SearchPage = () => {
  const [query, setQuery] = useState({
    term: '',
    types: [],
    filters: {},
  });

  const handleChange = useCallback(
    (term: string) => {
      setQuery(prevQuery => ({ ...prevQuery, term }));
    },
    [setQuery],
  );

  return (
    <Page themeId="home">
      <Header title="Search" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper>
              <SearchBarBase debounceTime={100} onChange={handleChange} />
            </Paper>
          </Grid>
          <Grid item xs>
            <SearchResult query={query}>
              {({ results }) => (
                <List>
                  {results.map(({ document }) => (
                    <DefaultResultListItem
                      key={document.location}
                      result={document}
                    />
                  ))}
                </List>
              )}
            </SearchResult>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
```

Additionally, a search page can also be composed using these two new results layout components:

```jsx
// Example rendering results as list
<SearchResult>
  {({ results }) => (
    <SearchResultListLayout
      resultItems={results}
      renderResultItem={({ type, document }) => {
        switch (type) {
          case 'custom-result-item':
            return (
              <CustomResultListItem key={document.location} result={document} />
            );
          default:
            return (
              <DefaultResultListItem
                key={document.location}
                result={document}
              />
            );
        }
      }}
    />
  )}
</SearchResult>
```

```jsx
// Example rendering results as groups
<SearchResult>
  {({ results }) => (
    <>
      <SearchResultGroupLayout
        icon={<CustomIcon />}
        title="Custom"
        link="See all custom results"
        resultItems={results.filter(
          ({ type }) => type === 'custom-result-item',
        )}
        renderResultItem={({ document }) => (
          <CustomResultListItem key={document.location} result={document} />
        )}
      />
      <SearchResultGroupLayout
        icon={<DefaultIcon />}
        title="Default"
        resultItems={results.filter(
          ({ type }) => type !== 'custom-result-item',
        )}
        renderResultItem={({ document }) => (
          <DefaultResultListItem key={document.location} result={document} />
        )}
      />
    </>
  )}
</SearchResult>
```

A `SearchResultList` and `SearchResultGroup` components were also created for users who have search pages with multiple queries, both are specializations of `SearchResult` and also accept a `query` as a prop as well:

```jsx
// Example using the <SearchResultList />
const SearchPage = () => {
  const query = {
    term: 'example',
  };

  return (
    <SearchResultList
      query={query}
      renderResultItem={({ type, document, highlight, rank }) => {
        switch (type) {
          case 'custom':
            return (
              <CustomResultListItem
                key={document.location}
                icon={<CatalogIcon />}
                result={document}
                highlight={highlight}
                rank={rank}
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
      }}
    />
  );
};
```

```jsx
// Example using the <SearchResultGroup /> for creating a component that search and group software catalog results
import React, { useState, useCallback } from 'react';

import { MenuItem } from '@material-ui/core';

import { JsonValue } from '@backstage/types';
import { CatalogIcon } from '@backstage/core-components';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import {
  SearchResultGroup,
  SearchResultGroupTextFilterField,
  SearchResultGroupSelectFilterField,
} from @backstage/plugin-search-react;
import { SearchQuery } from '@backstage/plugin-search-common';

const CatalogResultsGroup = () => {
  const [query, setQuery] = useState<Partial<SearchQuery>>({
    types: ['software-catalog'],
  });

  const filterOptions = [
    {
      label: 'Lifecycle',
      value: 'lifecycle',
    },
    {
      label: 'Owner',
      value: 'owner',
    },
  ];

  const handleFilterAdd = useCallback(
    (key: string) => () => {
      setQuery(prevQuery => {
        const { filters: prevFilters, ...rest } = prevQuery;
        const newFilters = { ...prevFilters, [key]: undefined };
        return { ...rest, filters: newFilters };
      });
    },
    [],
  );

  const handleFilterChange = useCallback(
    (key: string) => (value: JsonValue) => {
      setQuery(prevQuery => {
        const { filters: prevFilters, ...rest } = prevQuery;
        const newFilters = { ...prevFilters, [key]: value };
        return { ...rest, filters: newFilters };
      });
    },
    [],
  );

  const handleFilterDelete = useCallback(
    (key: string) => () => {
      setQuery(prevQuery => {
        const { filters: prevFilters, ...rest } = prevQuery;
        const newFilters = { ...prevFilters };
        delete newFilters[key];
        return { ...rest, filters: newFilters };
      });
    },
    [],
  );

  return (
    <SearchResultGroup
      query={query}
      icon={<CatalogIcon />}
      title="Software Catalog"
      link="See all software catalog results"
      filterOptions={filterOptions}
      renderFilterOption={({ label, value }) => (
        <MenuItem key={value} onClick={handleFilterAdd(value)}>
          {label}
        </MenuItem>
      )}
      renderFilterField={(key: string) => {
        switch (key) {
          case 'lifecycle':
            return (
              <SearchResultGroupSelectFilterField
                key={key}
                label="Lifecycle"
                value={query.filters?.lifecycle}
                onChange={handleFilterChange('lifecycle')}
                onDelete={handleFilterDelete('lifecycle')}
              >
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="experimental">Experimental</MenuItem>
              </SearchResultGroupSelectFilterField>
            );
          case 'owner':
            return (
              <SearchResultGroupTextFilterField
                key={key}
                label="Owner"
                value={query.filters?.owner}
                onChange={handleFilterChange('owner')}
                onDelete={handleFilterDelete('owner')}
              />
            );
          default:
            return null;
        }
      }
      renderResultItem={({ document, highlight, rank }) => (
        <CatalogSearchResultListItem
          key={document.location}
          result={document}
          highlight={highlight}
          rank={rank}
        />
      )}
    />
  );
};
```
