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
import { CatalogIcon, DocsIcon } from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  CATALOG_FILTER_EXISTS,
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { searchPlugin, SearchType } from '@backstage/plugin-search';
import {
  SearchBar,
  SearchFilter,
  SearchResult,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
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

const rootRouteRef = searchPlugin.routes.root;

export const SearchModal = ({ toggleModal }: { toggleModal: () => void }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const catalogApi = useApi(catalogApiRef);

  const { types } = useSearch();
  const searchRootRoute = useRouteRef(rootRouteRef)();
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
            <SearchResult>
              <CatalogSearchResultListItem icon={<CatalogIcon />} />
              <TechDocsSearchResultListItem icon={<DocsIcon />} />
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
