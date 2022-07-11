/*
 * Copyright 2021 The Backstage Authors
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

import {
  CatalogIcon,
  Content,
  DocsIcon,
  Header,
  Lifecycle,
  Page,
  useSidebarPinState,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { SearchType } from '@backstage/plugin-search';
import {
  DefaultResultListItem,
  SearchBar,
  SearchFilter,
  SearchResult,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
import { Grid, List, makeStyles, Paper, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
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
}));

const SearchPage = () => {
  const classes = useStyles();
  const { isMobile } = useSidebarPinState();
  const { types } = useSearch();
  const catalogApi = useApi(catalogApiRef);

  return (
    <Page themeId="home">
      {!isMobile && <Header title="Search" subtitle={<Lifecycle alpha />} />}
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.bar}>
              <SearchBar debounceTime={100} />
            </Paper>
          </Grid>
          {!isMobile && (
            <Grid item xs={3}>
              <SearchType.Accordion
                name="Result Type"
                defaultValue="software-catalog"
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

                      const names = items.map(entity => entity.metadata.name);
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
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ type, document, highlight, rank }) => {
                    switch (type) {
                      case 'software-catalog':
                        return (
                          <CatalogSearchResultListItem
                            icon={<CatalogIcon />}
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                      case 'techdocs':
                        return (
                          <TechDocsSearchResultListItem
                            icon={<DocsIcon />}
                            key={document.location}
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
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                    }
                  })}
                </List>
              )}
            </SearchResult>
            <SearchResultPager />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const searchPage = <SearchPage />;
