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

import React from 'react';

import { makeStyles, Theme, Grid, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

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
  DiscoveryApi,
  IdentityApi,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import {
  createPlugin,
  createApiExtension,
  createPageExtension,
  createExtensionInput,
  createNavItemExtension,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';

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
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react/alpha';

import { rootRouteRef } from './plugin';
import { SearchClient } from './apis';
import { SearchType } from './components/SearchType';
import { UrlUpdater } from './components/SearchPage/SearchPage';
import {
  compatWrapper,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';

/** @alpha */
export const searchApi = createApiExtension({
  factory: {
    api: searchApiRef,
    deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
    factory: ({
      identityApi,
      discoveryApi,
    }: {
      identityApi: IdentityApi;
      discoveryApi: DiscoveryApi;
    }) => new SearchClient({ discoveryApi, identityApi }),
  },
});

const useSearchPageStyles = makeStyles((theme: Theme) => ({
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
  filters: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

/** @alpha */
export const searchPage = createPageExtension({
  routeRef: convertLegacyRouteRef(rootRouteRef),
  configSchema: createSchemaFromZod(z =>
    z.object({
      path: z.string().default('/search'),
      noTrack: z.boolean().default(false),
    }),
  ),
  inputs: {
    items: createExtensionInput({
      item: createSearchResultListItemExtension.itemDataRef,
    }),
  },
  loader: async ({ config, inputs }) => {
    const getResultItemComponent = (result: SearchResult) => {
      const value = inputs.items.find(item =>
        item?.output.item.predicate?.(result),
      );
      return value?.output.item.component ?? DefaultResultListItem;
    };

    const Component = () => {
      const classes = useSearchPageStyles();
      const { isMobile } = useSidebarPinState();
      const { types } = useSearch();
      const catalogApi = useApi(catalogApiRef);

      return (
        <Page themeId="home">
          {!isMobile && <Header title="Search" />}
          <Content>
            <Grid container direction="row">
              <Grid item xs={12}>
                <SearchBar debounceTime={100} />
              </Grid>
              {!isMobile && (
                <Grid item xs={3}>
                  <SearchType.Accordion
                    name="Result Type"
                    defaultValue="software-catalog"
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
                      {
                        value: 'adr',
                        name: 'Architecture Decision Records',
                        icon: <DocsIcon />,
                      },
                    ]}
                  />
                  <Paper className={classes.filters}>
                    {types.includes('techdocs') && (
                      <SearchFilter.Select
                        className={classes.filter}
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
                      className={classes.filter}
                      label="Kind"
                      name="kind"
                      values={['Component', 'Template']}
                    />
                    <SearchFilter.Checkbox
                      className={classes.filter}
                      label="Lifecycle"
                      name="lifecycle"
                      values={['experimental', 'production']}
                    />
                  </Paper>
                </Grid>
              )}
              <Grid item xs>
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
              </Grid>
            </Grid>
          </Content>
        </Page>
      );
    };

    return compatWrapper(
      <SearchContextProvider>
        <UrlUpdater />
        <Component />
      </SearchContextProvider>,
    );
  },
});

/** @alpha */
export const searchNavItem = createNavItemExtension({
  routeRef: convertLegacyRouteRef(rootRouteRef),
  title: 'Search',
  icon: SearchIcon,
});

/** @alpha */
export default createPlugin({
  id: 'search',
  extensions: [searchApi, searchPage, searchNavItem],
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
  }),
});
