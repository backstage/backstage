/*
 * Copyright 2023 The Backstage Authors
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

import { Search } from 'lucide-react';

import {
  CatalogIcon,
  Content,
  DocsIcon,
  Header,
  Page,
  useSidebarPinState,
} from '@backstage/core-components';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import {
  createFrontendPlugin,
  ApiBlueprint,
  createExtensionInput,
  PageBlueprint,
  NavItemBlueprint,
  configApiRef,
} from '@backstage/frontend-plugin-api';
import type { IconComponent } from '@backstage/frontend-plugin-api';

import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';

import {
  DefaultResultListItem,
  SearchBar,
  SearchFilter,
  SearchPagination,
  SearchResult as SearchResults,
  SearchResultPager,
  useSearch,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { SearchResult } from '@backstage/plugin-search-common';
import { searchApiRef } from '@backstage/plugin-search-react';
import {
  SearchResultListItemBlueprint,
  SearchFilterResultTypeBlueprint,
  SearchFilterBlueprint,
} from '@backstage/plugin-search-react/alpha';

import { rootRouteRef } from './plugin';
import { SearchClient } from './apis';
import { SearchType } from './components/SearchType';
import { UrlUpdater } from './components/SearchPage/SearchPage';

/** Map MUI-style fontSize values to Lucide pixel sizes */
const ICON_SIZE_MAP: Record<string, number> = {
  small: 20,
  medium: 24,
  large: 35,
  inherit: 24,
};

/**
 * Wrapper bridging lucide-react's ForwardRefExoticComponent to Backstage's
 * IconComponent type which expects ComponentType<{ fontSize?: ... }>.
 */
const SearchIcon: IconComponent = ({ fontSize = 'medium', ...rest }) => (
  <Search size={ICON_SIZE_MAP[fontSize] ?? 24} {...rest} />
);

/** @alpha */
export const searchApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: searchApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new SearchClient({ discoveryApi, fetchApi }),
    }),
});

/** @alpha */
export const searchPage = PageBlueprint.makeWithOverrides({
  config: {
    schema: {
      noTrack: z => z.boolean().default(false),
    },
  },
  inputs: {
    items: createExtensionInput([SearchResultListItemBlueprint.dataRefs.item]),
    resultTypes: createExtensionInput([
      SearchFilterResultTypeBlueprint.dataRefs.resultType,
    ]),
    searchFilters: createExtensionInput([
      SearchFilterBlueprint.dataRefs.searchFilters,
    ]),
  },
  factory(originalFactory, { config, inputs }) {
    return originalFactory({
      path: '/search',
      routeRef: rootRouteRef,
      loader: async () => {
        const getResultItemComponent = (result: SearchResult) => {
          const value = inputs.items.find(item =>
            item
              ?.get(SearchResultListItemBlueprint.dataRefs.item)
              .predicate?.(result),
          );
          return (
            value?.get(SearchResultListItemBlueprint.dataRefs.item).component ??
            DefaultResultListItem
          );
        };

        const resultTypes = inputs.resultTypes.map(item =>
          item.get(SearchFilterResultTypeBlueprint.dataRefs.resultType),
        );

        const additionalSearchFilters = inputs.searchFilters.map(
          item =>
            item.get(SearchFilterBlueprint.dataRefs.searchFilters).component,
        );

        const Component = () => {
          const { isMobile } = useSidebarPinState();
          const { types } = useSearch();
          const catalogApi = useApi(catalogApiRef);
          const configApi = useApi(configApiRef);

          return (
            <Page themeId="home">
              {!isMobile && <Header title="Search" />}
              <Content>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <SearchBar debounceTime={100} />
                  </div>
                  {!isMobile && (
                    <div className="col-span-3">
                      <SearchType.Accordion
                        name="Result Type"
                        defaultValue={configApi.getOptionalString(
                          'search.defaultType',
                        )}
                        showCounts
                        types={[
                          {
                            value: 'software-catalog',
                            name: 'Software Catalog',
                            icon: <CatalogIcon />,
                          },
                          {
                            value: 'techdocs',
                            name: 'Documentation',
                            icon: <DocsIcon />,
                          },
                        ].concat(resultTypes)}
                      />
                      <div className="rounded-lg border border-border bg-card p-4 mt-4">
                        {types.includes('techdocs') && (
                          <SearchFilter.Select
                            className="[&+&]:mt-5"
                            label="Entity"
                            name="name"
                            values={async () => {
                              // Return a list of entities which are documented.
                              const { items } = await catalogApi.getEntities({
                                fields: ['metadata.name'],
                                filter: {
                                  'metadata.annotations.backstage.io/techdocs-ref':
                                    CATALOG_FILTER_EXISTS,
                                },
                              });

                              const names = items.map(
                                entity => entity.metadata.name,
                              );
                              names.sort();
                              return names;
                            }}
                          />
                        )}
                        <SearchFilter.Select
                          className="[&+&]:mt-5"
                          label="Kind"
                          name="kind"
                          values={[
                            'API',
                            'Component',
                            'Domain',
                            'Group',
                            'Location',
                            'Resource',
                            'System',
                            'Template',
                            'User',
                          ]}
                        />
                        <SearchFilter.Checkbox
                          className="[&+&]:mt-5"
                          label="Lifecycle"
                          name="lifecycle"
                          values={['experimental', 'production']}
                        />
                        {additionalSearchFilters.map(SearchFilterComponent => (
                          <SearchFilterComponent className="[&+&]:mt-5" />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={!isMobile ? 'col-span-9' : 'col-span-12'}>
                    <SearchPagination />
                    <SearchResults>
                      {({ results }) => (
                        <>
                          {results.map((result, index) => {
                            const { noTrack } = config;
                            const { document, ...rest } = result;
                            const SearchResultListItem =
                              getResultItemComponent(result);
                            return (
                              <SearchResultListItem
                                {...rest}
                                key={index}
                                result={document}
                                noTrack={noTrack}
                              />
                            );
                          })}
                        </>
                      )}
                    </SearchResults>
                    <SearchResultPager />
                  </div>
                </div>
              </Content>
            </Page>
          );
        };

        return (
          <SearchContextProvider>
            <UrlUpdater />
            <Component />
          </SearchContextProvider>
        );
      },
    });
  },
});

/** @alpha */
export const searchNavItem = NavItemBlueprint.make({
  params: {
    routeRef: rootRouteRef,
    title: 'Search',
    icon: SearchIcon,
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'search',
  title: 'Search',
  icon: <SearchIcon />,
  info: { packageJson: () => import('../package.json') },
  extensions: [searchApi, searchPage, searchNavItem],
  routes: {
    root: rootRouteRef,
  },
});

/** @alpha */
export { searchTranslationRef } from './translation';
