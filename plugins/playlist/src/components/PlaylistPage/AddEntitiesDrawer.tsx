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

import {
  Entity,
  getCompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import {
  SearchBar,
  SearchContextProvider,
  SearchFilter,
  SearchResult,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import {
  Box,
  Button,
  Chip,
  createStyles,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect, useMemo } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      padding: theme.spacing(2.5),
    },
    searchBarContainer: {
      borderRadius: 30,
      display: 'flex',
      height: '2.4em',
    },
    gridContainer: {
      height: '100%',
    },
    searchResults: {
      overflow: 'auto',
    },
    itemContainer: {
      flexWrap: 'wrap',
      paddingRight: '75px',
    },
    itemText: {
      width: '100%',
      wordBreak: 'break-word',
      marginBottom: '1rem',
    },
  }),
);

const RestrictCatalogIndexResults = () => {
  const { setTypes } = useSearch();
  useEffect(() => setTypes(['software-catalog']), [setTypes]);
  return null;
};

export type AddEntitiesDrawerProps = {
  currentEntities: Entity[];
  open: boolean;
  onAdd: (entityRef: string) => void;
  onClose: () => void;
};

export const AddEntitiesDrawer = ({
  currentEntities,
  open,
  onAdd,
  onClose,
}: AddEntitiesDrawerProps) => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const entityRoute = useRouteRef(entityRouteRef);
  const entityLocationRegex = useMemo(() => {
    const forwardSlashRegex = new RegExp('/', 'g');
    const locationRegex = entityRoute({
      namespace: '(?<namespace>.+?)',
      kind: '(?<kind>.+?)',
      name: '(?<name>.+?)',
    }).replace(forwardSlashRegex, '\\/');

    return new RegExp(`${locationRegex}$`);
  }, [entityRoute]);

  const currentEntityLocations = useMemo(
    () =>
      currentEntities.map(entity =>
        entityRoute(getCompoundEntityRef(entity)).toLocaleLowerCase('en-US'),
      ),
    [currentEntities, entityRoute],
  );

  const getEntityKinds = async () => {
    return (
      await catalogApi.getEntityFacets({ facets: ['kind'] })
    ).facets.kind.map(f => f.value);
  };

  const addEntity = useCallback(
    entityResult => {
      // TODO (kuangp): this parsing of the location is not great. Ideally `CatalogEntityDocument`
      // contains the `metadata.name` field so we can derive the full ref and we only fall back to
      // parsing location if it's missing (ie. for older versions)
      const { groups } = entityResult.location.match(entityLocationRegex);
      if (groups) {
        onAdd(stringifyEntityRef(groups));
      } else {
        // eslint-disable-next-line no-console
        console.error(
          `Failed to parse entity ref from entity location: ${entityResult.location}`,
        );
      }
    },
    [entityLocationRegex, onAdd],
  );

  return (
    <Drawer
      classes={{
        paper: classes.paper,
      }}
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <SearchContextProvider>
        <RestrictCatalogIndexResults />
        <Grid container direction="column" className={classes.gridContainer}>
          <Grid item>
            <Typography variant="h5">
              Let's find something for your playlist
            </Typography>
          </Grid>
          <Grid item>
            <Paper className={classes.searchBarContainer}>
              <SearchBar />
            </Paper>
          </Grid>
          <Grid item>
            <SearchFilter.Select
              label="Kind"
              name="kind"
              values={getEntityKinds}
            />
          </Grid>
          <Grid item xs className={classes.searchResults}>
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ document }) => (
                    <React.Fragment key={document.location}>
                      <ListItem alignItems="flex-start">
                        <div className={classes.itemContainer}>
                          <ListItemText
                            className={classes.itemText}
                            primaryTypographyProps={{ variant: 'h6' }}
                            primary={document.title}
                            secondary={document.text}
                          />
                          <ListItemSecondaryAction>
                            <Button
                              color="primary"
                              size="small"
                              variant="outlined"
                              data-testid="entity-drawer-add-button"
                              disabled={currentEntityLocations.includes(
                                document.location.toLocaleLowerCase('en-US'),
                              )}
                              onClick={() => addEntity(document)}
                            >
                              {currentEntityLocations.includes(
                                document.location.toLocaleLowerCase('en-US'),
                              )
                                ? 'Added'
                                : 'Add'}
                            </Button>
                          </ListItemSecondaryAction>
                          <Box>
                            {(document as CatalogEntityDocument).kind && (
                              <Chip
                                label={`Kind: ${
                                  (document as CatalogEntityDocument).kind
                                }`}
                                size="small"
                              />
                            )}
                            {(document as CatalogEntityDocument).type && (
                              <Chip
                                label={`Type: ${
                                  (document as CatalogEntityDocument).type
                                }`}
                                size="small"
                              />
                            )}
                          </Box>
                        </div>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </SearchResult>
            <SearchResultPager />
          </Grid>
        </Grid>
      </SearchContextProvider>
    </Drawer>
  );
};
