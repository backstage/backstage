/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentType, useState } from 'react';

import { Grid, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { createRouteRef } from '@backstage/core-plugin-api';
import { CatalogIcon, Link } from '@backstage/core-components';
import { SearchQuery, SearchResultSet } from '@backstage/plugin-search-common';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';

import { SearchResultList } from './SearchResultList';
import { DefaultResultListItem } from '../DefaultResultListItem';

const routeRef = createRouteRef({
  id: 'storybook.search.results.list.route',
});

const searchApiMock = new MockSearchApi({
  results: [
    {
      type: 'techdocs',
      document: {
        location: 'search/search-result1',
        title: 'Search Result 1',
        text: 'Some text from the search result 1',
      },
    },
    {
      type: 'custom',
      document: {
        location: 'search/search-result2',
        title: 'Search Result 2',
        text: 'Some text from the search result 2',
      },
    },
  ],
});

export default {
  title: 'Plugins/Search/SearchResultList',
  component: SearchResultList,
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Story />
            </Grid>
          </Grid>
        </TestApiProvider>,
        { mountedRoutes: { '/': routeRef } },
      ),
  ],
};

export const Default = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return <SearchResultList query={query} />;
};

export const Loading = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return (
    <TestApiProvider
      apis={[
        [searchApiRef, { query: () => new Promise<SearchResultSet>(() => {}) }],
      ]}
    >
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};

export const WithError = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return (
    <TestApiProvider
      apis={[
        [
          searchApiRef,
          {
            query: () =>
              new Promise<SearchResultSet>(() => {
                throw new Error();
              }),
          },
        ],
      ]}
    >
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};

export const WithDefaultNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};

export const WithCustomNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList
        query={query}
        noResultsComponent={<ListItemText primary="No results were found" />}
      />
    </TestApiProvider>
  );
};

const CustomResultListItem = (props: any) => {
  const { icon, result } = props;

  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start" divider>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText
          primary={result.title}
          primaryTypographyProps={{ variant: 'h6' }}
          secondary={result.text}
        />
      </ListItem>
    </Link>
  );
};

export const WithCustomResultItem = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom'],
  });

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
