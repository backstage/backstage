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

import { ComponentType, useCallback, useState, PropsWithChildren } from 'react';

import { FileText } from 'lucide-react';

import { JsonValue } from '@backstage/types';
import {
  Link,
  DropdownMenuItem,
  ShadcnSelectItem,
} from '@backstage/core-components';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { createPlugin, createRouteRef } from '@backstage/core-plugin-api';
import { SearchQuery, SearchResultSet } from '@backstage/plugin-search-common';

import { DefaultResultListItem } from '../DefaultResultListItem';

import { SearchContextProvider } from '../../context';
import { searchApiRef, MockSearchApi } from '../../api';
import { createSearchResultListItemExtension } from '../../extensions';

import {
  SearchResultGroup,
  SearchResultGroupTextFilterField,
  SearchResultGroupSelectFilterField,
} from './SearchResultGroup';

const routeRef = createRouteRef({
  id: 'storybook.search.results.group.route',
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
  title: 'Plugins/Search/SearchResultGroup',
  component: SearchResultGroup,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, searchApiMock]]}>
          <div className="grid grid-cols-1">
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
      <SearchResultGroup
        icon={<FileText className="h-5 w-5" />}
        title="Documentation"
      />
    </SearchContextProvider>
  );
};

export const WithQuery = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return (
    <SearchResultGroup
      query={query}
      icon={<FileText className="h-5 w-5" />}
      title="Documentation"
    />
  );
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
      <SearchResultGroup
        query={query}
        icon={<FileText className="h-5 w-5" />}
        title="Documentation"
      />
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
      <SearchResultGroup
        query={query}
        icon={<FileText className="h-5 w-5" />}
        title="Documentation"
      />
    </TestApiProvider>
  );
};

export const WithCustomTitle = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom'],
  });

  return (
    <SearchResultGroup
      query={query}
      icon={<FileText className="h-5 w-5" />}
      title="Custom"
      titleProps={{ color: 'secondary' }}
    />
  );
};

export const WithCustomLink = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom'],
  });

  return (
    <SearchResultGroup
      query={query}
      icon={<FileText className="h-5 w-5" />}
      title="Custom"
      link="See all custom results"
      linkProps={{ to: '/custom' }}
    />
  );
};

export const WithFilters = () => {
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
      icon={<FileText className="h-5 w-5" />}
      title="Documentation"
      filterOptions={filterOptions}
      renderFilterOption={option => (
        <DropdownMenuItem
          key={option.value}
          onSelect={handleFilterAdd(option.value)}
        >
          {option.label}
        </DropdownMenuItem>
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
                <ShadcnSelectItem value="production">
                  Production
                </ShadcnSelectItem>
                <ShadcnSelectItem value="experimental">
                  Experimental
                </ShadcnSelectItem>
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
      }}
    />
  );
};

export const WithDefaultNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup
        query={query}
        icon={<FileText className="h-5 w-5" />}
        title="Documentation"
      />
    </TestApiProvider>
  );
};

export const WithCustomNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup
        query={query}
        icon={<FileText className="h-5 w-5" />}
        title="Documentation"
        noResultsComponent={
          <p className="px-4 py-3 text-sm text-muted-foreground">
            No results were found
          </p>
        }
      />
    </TestApiProvider>
  );
};

const CustomResultListItem = (props: any) => {
  const { icon, result } = props;

  return (
    <Link to={result.location}>
      <li className="flex items-start border-b border-border px-4 py-3">
        {icon && <span className="mr-3 mt-1 flex-shrink-0">{icon}</span>}
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{result.title}</span>
          <span className="text-sm text-muted-foreground">{result.text}</span>
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
    <SearchResultGroup
      query={query}
      icon={<FileText className="h-5 w-5" />}
      title="Custom"
      link="See all custom results"
      renderResultItem={({ document, highlight, rank }) => (
        <CustomResultListItem
          key={document.location}
          result={document}
          highlight={highlight}
          rank={rank}
        />
      )}
    />
  );
};

export const WithResultItemExtensions = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs'],
  });
  const plugin = createPlugin({ id: 'plugin' });
  const DefaultSearchResultGroupItem = plugin.provide(
    createSearchResultListItemExtension({
      name: 'DefaultResultListItem',
      component: async () => DefaultResultListItem,
    }),
  );
  return (
    <SearchResultGroup
      query={query}
      icon={<FileText className="h-5 w-5" />}
      title="Documentation"
    >
      <DefaultSearchResultGroupItem />
    </SearchResultGroup>
  );
};
