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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SearchBarBase } from '../SearchBar';
import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResult } from '../SearchResult';
import { SearchContextProvider, useSearch } from '../SearchContext';
import { SearchResultPager } from '../SearchResultPager';

import { useDebounce } from 'react-use';

interface SearchModalProps {
  open?: boolean;
  toggleModal: () => void;
}

const useStyles = makeStyles(() => ({
  container: {
    borderRadius: 30,
    display: 'flex',
    height: '2.4em',
  },
  input: {
    flex: 1,
  },
  paperFullWidth: { minHeight: 'calc(100% - 128px)' },
  dialogActionsContainer: { padding: '8px 24px' },
}));

export const Modal = ({ open = true, toggleModal }: SearchModalProps) => {
  const classes = useStyles();

  const { term, setTerm } = useSearch();
  const [value, setValue] = useState<string>(term);

  useEffect(() => {
    setValue(prevValue => (prevValue !== term ? term : prevValue));
  }, [term]);

  useDebounce(() => setTerm(value), 1000, [value]);

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
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="customized-dialog-title">
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
