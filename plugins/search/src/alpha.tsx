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

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
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
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import {
  createFrontendPlugin,
  ApiBlueprint,
  createExtensionInput,
  PageBlueprint,
  NavItemBlueprint,
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
import {
  SearchResultListItemBlueprint,
  SearchFilterResultTypeBlueprint,
  SearchFilterBlueprint,
} from '@backstage/plugin-search-react/alpha';

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
export const searchApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: searchApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new SearchClient({ discoveryApi, fetchApi }),
    }),
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
      routeRef: convertLegacyRouteRef(rootRouteRef),
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

        const searchFilters = inputs.searchFilters.map(item => ({
          id: item.node.spec.id,
          ...item.get(SearchFilterBlueprint.dataRefs.searchFilters),
        }));

        const Component = () => {
          const classes = useSearchPageStyles();
          const { isMobile } = useSidebarPinState();
          const { types } = useSearch();

          const relevantSearchFilters = searchFilters.filter(
            ({ typeFilter }) => !typeFilter || typeFilter(types),
          );

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
                        defaultValue={resultTypes[0]?.value}
                        showCounts
                        types={resultTypes}
                      />
                      {relevantSearchFilters.length > 0 && (
                        <Paper className={classes.filters}>
                          {relevantSearchFilters.map(
                            ({ id, component: SearchFilterComponent }) => (
                              <SearchFilterComponent
                                key={id}
                                className={classes.filter}
                              />
                            ),
                          )}
                        </Paper>
                      )}
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
  },
});

const resultTypes = [
  SearchFilterResultTypeBlueprint.make({
    name: 'software-catalog',
    params: {
      value: 'software-catalog',
      name: 'Software Catalog',
      icon: <CatalogIcon />,
    },
  }),
  SearchFilterResultTypeBlueprint.make({
    name: 'techdocs',
    params: {
      value: 'techdocs',
      name: 'Documentation',
      icon: <DocsIcon />,
    },
  }),
];

const searchFilter = [
  SearchFilterBlueprint.make({
    name: 'techdocs-relevant-entities-filter',
    params: {
      typeFilter: types => types.includes('techdocs'),
      component: ({ className }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const catalogApi = useApi(catalogApiRef);
        return (
          <SearchFilter.Select
            className={className}
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

              const names = items.map(entity => entity.metadata.name);
              names.sort();
              return names;
            }}
          />
        );
      },
    },
  }),
  SearchFilterBlueprint.make({
    name: 'entity-kind-filter',
    params: {
      component: props => (
        <SearchFilter.Select
          className={props.className}
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
      ),
    },
  }),
  SearchFilterBlueprint.make({
    name: 'lifecycle-filter',
    params: {
      component: props => (
        <SearchFilter.Checkbox
          className={props.className}
          label="Lifecycle"
          name="lifecycle"
          values={['experimental', 'production']}
        />
      ),
    },
  }),
];

/** @alpha */
export const searchNavItem = NavItemBlueprint.make({
  params: {
    routeRef: convertLegacyRouteRef(rootRouteRef),
    title: 'Search',
    icon: SearchIcon,
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'search',
  info: { packageJson: () => import('../package.json') },
  extensions: [
    searchApi,
    searchPage,
    searchNavItem,
    ...resultTypes,
    ...searchFilter,
  ],
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
  }),
});

/** @alpha */
export { searchTranslationRef } from './translation';
