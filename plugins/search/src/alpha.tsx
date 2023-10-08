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
import { searchResultItemExtensionData } from '@backstage/plugin-search-react/alpha';

import { rootRouteRef } from './plugin';
import { SearchClient } from './apis';
import { SearchType } from './components/SearchType';
import { UrlUpdater } from './components/SearchPage/SearchPage';
import { convertLegacyRouteRef } from '@backstage/core-plugin-api/alpha';

/** @internal */
const StackOverflowIcon = () => {
  return (
    <svg
      viewBox="0 0 125 125"
      width="25"
      height="25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M84.021 75.825v31H11v-31H0v42h95v-42H84.021z" fill="#BCBBBB" />
      <path
        d="M21.057 96.825H74v-10H21.057v10zm1.058-23.915l51.428 10.794 2.117-10.265L24.23 62.645 22.115 72.91zm6.773-24.656l47.618 22.222 4.445-9.524L33.33 38.73l-4.444 9.524zm13.227-23.386l40.423 33.65 6.773-8.042-40.53-33.65-6.666 8.042zM68.147 0L59.68 6.243l31.323 42.222 8.465-6.243L68.147 0z"
        fill="#F48024"
      />
    </svg>
  );
};

/** @alpha */
export const SearchApi = createApiExtension({
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
export const SearchPage = createPageExtension({
  id: 'plugin.search.page',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  configSchema: createSchemaFromZod(z =>
    z.object({
      path: z.string().default('/search'),
      noTrack: z.boolean().default(false),
    }),
  ),
  inputs: {
    items: createExtensionInput({
      item: searchResultItemExtensionData,
    }),
  },
  loader: async ({ config, inputs }) => {
    const getResultItemComponent = (result: SearchResult) => {
      const value = inputs.items.find(({ item }) => item?.predicate?.(result));
      return value?.item.component ?? DefaultResultListItem;
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
                      {
                        value: 'stack-overflow',
                        name: 'Stack Overflow',
                        icon: <StackOverflowIcon />,
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

    return (
      <SearchContextProvider>
        <UrlUpdater />
        <Component />
      </SearchContextProvider>
    );
  },
});

/** @alpha */
export const SearchNavItem = createNavItemExtension({
  id: 'plugin.search.nav.index',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  title: 'Search',
  icon: SearchIcon,
});

/** @alpha */
export default createPlugin({
  id: 'search',
  extensions: [SearchApi, SearchPage, SearchNavItem],
  routes: {
    root: convertLegacyRouteRef(rootRouteRef),
  },
});
