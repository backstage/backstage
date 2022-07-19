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

import React from 'react';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  makeStyles,
  Paper,
  useTheme,
} from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import {
  CatalogIcon,
  DocsIcon,
  Link,
  useContent,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { searchPlugin, SearchType } from '@backstage/plugin-search';
import {
  DefaultResultListItem,
  SearchFilter,
  SearchBar,
  SearchResult,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: 30,
    display: 'flex',
    height: '2.4em',
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
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: '0.5em' },
}));

export const SearchModal = ({ toggleModal }: { toggleModal: () => void }) => {
  const getSearchLink = useRouteRef(searchPlugin.routes.root);
  const classes = useStyles();

  const catalogApi = useApi(catalogApiRef);
  const { term, types } = useSearch();
  const { focusContent } = useContent();
  const { transitions } = useTheme();

  const handleResultClick = () => {
    toggleModal();
    setTimeout(focusContent, transitions.duration.leavingScreen);
  };

  const handleKeyPress = () => {
    handleResultClick();
  };

  return (
    <>
      <DialogTitle>
        <Paper className={classes.container}>
          <SearchBar className={classes.input} />
        </Paper>
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
                <Link
                  onClick={() => {
                    toggleModal();
                    setTimeout(
                      focusContent,
                      transitions.duration.leavingScreen,
                    );
                  }}
                  to={`${getSearchLink()}?query=${term}`}
                >
                  <span className={classes.viewResultsLink}>
                    View Full Results
                  </span>
                  <LaunchIcon color="primary" />
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ type, document, highlight, rank }) => {
                    let resultItem;
                    switch (type) {
                      case 'software-catalog':
                        resultItem = (
                          <CatalogSearchResultListItem
                            icon={<CatalogIcon />}
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                        break;
                      case 'techdocs':
                        resultItem = (
                          <TechDocsSearchResultListItem
                            icon={<DocsIcon />}
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                        break;
                      default:
                        resultItem = (
                          <DefaultResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                    }
                    return (
                      <div
                        role="button"
                        tabIndex={0}
                        key={`${document.location}-btn`}
                        onClick={handleResultClick}
                        onKeyPress={handleKeyPress}
                      >
                        {resultItem}
                      </div>
                    );
                  })}
                </List>
              )}
            </SearchResult>
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
