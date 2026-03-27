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

import { ComponentType, useState, PropsWithChildren } from 'react';

import { CatalogIcon, Link } from '@backstage/core-components';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { createPlugin, createRouteRef } from '@backstage/core-plugin-api';
import { SearchQuery, SearchResultSet } from '@backstage/plugin-search-common';

import { SearchContextProvider } from '../../context';
import { searchApiRef, MockSearchApi } from '../../api';
import { createSearchResultListItemExtension } from '../../extensions';

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
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <div className="grid gap-4">
            <div>
              <Story />
            </div>
          </div>
        </TestApiProvider>,
        { mountedRoutes: { '/': routeRef } },
      ),
  ],
  tags: ['!manifest'],
};

export const Default = () => {
  return (
    <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>
  );
};

export const WithQuery = () => {
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
        noResultsComponent={
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium">No results were found</span>
          </div>
        }
      />
    </TestApiProvider>
  );
};

const CustomResultListItem = (props: any) => {
  const { icon, result } = props;

  return (
    <Link to={result.location}>
      <li className="flex items-start py-3 border-b border-border">
        {icon && <div className="mr-4 mt-1 flex-shrink-0">{icon}</div>}
        <div className="flex flex-col min-w-0">
          <span className="text-base font-semibold">{result.title}</span>
          <span className="text-xs text-muted-foreground">{result.text}</span>
        </div>
      </li>
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

export const WithResultItemExtensions = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });
  const plugin = createPlugin({ id: 'plugin' });
  const DefaultSearchResultListItem = plugin.provide(
    createSearchResultListItemExtension({
      name: 'DefaultResultListItem',
      component: async () => DefaultResultListItem,
    }),
  );
  return (
    <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>
  );
};
