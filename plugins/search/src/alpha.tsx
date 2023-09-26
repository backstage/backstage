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

import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  makeStyles,
  Theme,
  Grid,
  Box,
  Paper,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {
  CatalogIcon,
  Content,
  DocsIcon,
  Header,
  Page,
  useSidebarPinState,
} from '@backstage/core-components';
import {
  createRouteRef,
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
  createExtensionDataRef,
  createExtension,
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

import { SearchClient } from './apis';
import { SearchType } from './components/SearchType';
import { UrlUpdater } from './components/SearchPage/SearchPage';
import { SidebarSearchModal } from './components/SidebarSearchModal/SidebarSearchModal';
import { useSearchModal } from './components/SearchModal';

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

const searchRouteRef = createRouteRef({ id: 'plugin.search.page' });

/** @alpha */
export const SearchPage = createPageExtension({
  id: 'plugin.search.page',
  routeRef: searchRouteRef,
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
                  {({ results }) =>
                    results.map((result, index) => {
                      const SearchResultListItem =
                        getResultItemComponent(result);
                      return (
                        <SearchResultListItem
                          key={index}
                          rank={result.rank}
                          result={result.document}
                          noTrack={config.noTrack}
                        />
                      );
                    })
                  }
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

const searchModalExtensionData = createExtensionDataRef<JSX.Element>(
  'plugin.search.modal.element',
);

const useSearchModalStyles = makeStyles(theme => ({
  dialogTitle: {
    gap: theme.spacing(1),
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr auto',
    '&> button': {
      marginTop: theme.spacing(1),
    },
  },
  container: {
    borderRadius: 30,
    display: 'flex',
    height: '2.4em',
    padding: theme.spacing(1),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
  filters: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  input: {
    flex: 1,
  },
  button: {
    '&:hover': {
      background: 'none',
    },
  },
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: '0.5em' },
}));

/** @alpha */
export const SearchModal = createExtension({
  id: 'plugin.search.modal',
  at: 'plugin.search.nav.index/modal',
  configSchema: createSchemaFromZod(z =>
    z.object({
      noTrack: z.boolean().default(false),
    }),
  ),
  inputs: {
    items: createExtensionInput({
      item: searchResultItemExtensionData,
    }),
  },
  output: {
    element: searchModalExtensionData,
  },
  factory({ bind, config, inputs }) {
    const getResultItemComponent = (result: SearchResult) => {
      const value = inputs.items.find(({ item }) => item?.predicate?.(result));
      return value?.item.component ?? DefaultResultListItem;
    };

    const Component = () => {
      const classes = useSearchModalStyles();
      const navigate = useNavigate();
      const catalogApi = useApi(catalogApiRef);

      const { types } = useSearch();
      const { toggleModal } = useSearchModal();
      const searchRootRoute = '/search';
      const searchBarRef = useRef<HTMLInputElement | null>(null);

      useEffect(() => {
        searchBarRef?.current?.focus();
      });

      // This handler is called when "enter" is pressed
      const handleSearchBarSubmit = useCallback(() => {
        toggleModal();
        // Using ref to get the current field value without waiting for a query debounce
        const query = searchBarRef.current?.value ?? '';
        navigate(`${searchRootRoute}?query=${query}`);
      }, [navigate, toggleModal, searchRootRoute]);

      return (
        <>
          <DialogTitle>
            <Box className={classes.dialogTitle}>
              <SearchBar
                className={classes.input}
                inputProps={{ ref: searchBarRef }}
                onSubmit={handleSearchBarSubmit}
              />

              <IconButton aria-label="close" onClick={toggleModal}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container direction="column">
              <Grid item>
                <SearchType.Tabs
                  defaultValue="software-catalog"
                  types={[
                    {
                      value: 'software-catalog',
                      name: 'Software Catalog',
                    },
                    {
                      value: 'techdocs',
                      name: 'Documentation',
                    },
                    {
                      value: 'tools',
                      name: 'Tools',
                    },
                  ]}
                />
              </Grid>
              <Grid item container>
                {types.includes('techdocs') && (
                  <Grid item xs={2}>
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

                        const names = items.map(entity => entity.metadata.name);
                        names.sort();
                        return names;
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={2}>
                  <SearchFilter.Select
                    className={classes.filter}
                    label="Kind"
                    name="kind"
                    values={['Component', 'Template']}
                  />
                </Grid>
                <Grid item xs={2}>
                  <SearchFilter.Select
                    className={classes.filter}
                    label="Lifecycle"
                    name="lifecycle"
                    values={['experimental', 'production']}
                  />
                </Grid>
                <Grid
                  item
                  xs={types.includes('techdocs') ? 6 : 8}
                  container
                  direction="row-reverse"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      className={classes.button}
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleSearchBarSubmit}
                      disableRipple
                    >
                      View Full Results
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs>
                <SearchResults>
                  {({ results }) =>
                    results.map((result, index) => {
                      const SearchResultListItem =
                        getResultItemComponent(result);
                      return (
                        <SearchResultListItem
                          key={index}
                          rank={result.rank}
                          result={result.document}
                          noTrack={config.noTrack}
                        />
                      );
                    })
                  }
                </SearchResults>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className={classes.dialogActionsContainer}>
            <Grid container direction="row">
              <Grid item xs={12}>
                <SearchResultPager />
              </Grid>
            </Grid>
          </DialogActions>
        </>
      );
    };

    bind({
      element: <Component />,
    });
  },
});

/** @alpha */
export const SearchNavItem = createNavItemExtension({
  id: 'plugin.search.nav.index',
  routeRef: searchRouteRef,
  title: 'Search',
  icon: SearchIcon,
  group: async ({ inputs }) => (
    <SidebarSearchModal>{() => inputs.modal.element}</SidebarSearchModal>
  ),
  inputs: {
    modal: createExtensionInput(
      {
        element: searchModalExtensionData,
      },
      {
        singleton: true,
      },
    ),
  },
});

/** @alpha */
export default createPlugin({
  id: 'plugin.search',
  extensions: [SearchApi, SearchPage, SearchModal, SearchNavItem],
});
