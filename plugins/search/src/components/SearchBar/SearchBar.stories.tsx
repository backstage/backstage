/*
 * Copyright 2021 Spotify AB
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
import { Paper, Grid, makeStyles } from '@material-ui/core';
import { SearchBar, SearchContext } from '../index';
import { MemoryRouter } from 'react-router';

export default {
  title: 'Plugins/Search/SearchBar',
  component: SearchBar,
};

const defaultValue = {
  term: '',
  setTerm: () => {},
};

export const Default = () => {
  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper style={{ padding: '8px 0' }}>
              <SearchBar />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};

export const CustomPlaceholder = () => {
  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper style={{ padding: '8px 0' }}>
              <SearchBar placeholder="This is a custom placeholder" />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};

export const Focused = () => {
  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper style={{ padding: '8px 0' }}>
              {/* decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus */}
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <SearchBar autoFocus />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};

export const WithoutClearButton = () => {
  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper style={{ padding: '8px 0' }}>
              <SearchBar clearButton={false} />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};

const useStyles = makeStyles({
  search: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderRadius: '50px',
    margin: 'auto',
  },
});

export const CustomStyles = () => {
  const classes = useStyles();
  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.search}>
              <SearchBar />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};
