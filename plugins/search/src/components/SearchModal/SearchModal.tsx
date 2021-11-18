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
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  Paper,
} from '@material-ui/core';
import { Launch } from '@material-ui/icons/';
import { makeStyles } from '@material-ui/core/styles';
import { SearchBarBase } from '../SearchBar';
import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResult } from '../SearchResult';
import { SearchContextProvider, useSearch } from '../SearchContext';
import { SearchResultPager } from '../SearchResultPager';
import { useRouteRef } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import { rootRouteRef } from '../../plugin';

import { useDebounce } from 'react-use';

export interface SearchModalProps {
  open?: boolean;
  toggleModal: () => void;
}

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: 30,
    display: 'flex',
    height: '2.4em',
  },
  input: {
    flex: 1,
  },
  // Reduces default height of the modal, keeping a gap of 128px between the top and bottom of the page.
  paperFullWidth: { height: 'calc(100% - 128px)' },
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: '0.5em' },
}));

export const Modal = ({ open = true, toggleModal }: SearchModalProps) => {
  const getSearchLink = useRouteRef(rootRouteRef);
  const classes = useStyles();

  const { term, setTerm } = useSearch();
  const [value, setValue] = useState<string>(term);

  useEffect(() => {
    setValue(prevValue => (prevValue !== term ? term : prevValue));
  }, [term]);

  useDebounce(() => setTerm(value), 500, [value]);

  const handleQuery = (newValue: string) => {
    setValue(newValue);
  };

  const handleClear = () => setValue('');

  const handleResultClick = () => {
    toggleModal();
    handleClear();
  };

  const handleKeyPress = () => {
    handleResultClick();
  };

  return (
    <Dialog
      classes={{
        paperFullWidth: classes.paperFullWidth,
      }}
      onClose={toggleModal}
      aria-labelledby="search-modal-title"
      open={open}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        <Paper className={classes.container}>
          <SearchBarBase
            className={classes.input}
            value={value}
            onChange={handleQuery}
            onClear={handleClear}
          />
        </Paper>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Link
              onClick={toggleModal}
              to={`${getSearchLink()}?query=${value}`}
            >
              <span className={classes.viewResultsLink}>View Full Results</span>
              <Launch color="primary" />
            </Link>
          </Grid>
        </Grid>
        <Divider />
        <SearchResult>
          {({ results }) => (
            <List>
              {results.map(({ document }) => (
                <div
                  role="button"
                  tabIndex={0}
                  key={`${document.location}-btn`}
                  onClick={handleResultClick}
                  onKeyPress={handleKeyPress}
                >
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                </div>
              ))}
            </List>
          )}
        </SearchResult>
      </DialogContent>
      <DialogActions className={classes.dialogActionsContainer}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchResultPager />
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export const SearchModal = ({ open = true, toggleModal }: SearchModalProps) => {
  return (
    <SearchContextProvider>
      <Modal open={open} toggleModal={toggleModal} />
    </SearchContextProvider>
  );
};
