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

import React, { ComponentType } from 'react';
import { Grid, makeStyles, Paper } from '@material-ui/core';

import { TestApiProvider } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchBar } from './SearchBar';

export default {
  title: 'Plugins/Search/SearchBar',
  component: SearchBar,
  decorators: [
    (Story: ComponentType<{}>) => (
      <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
        <SearchContextProvider>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Story />
            </Grid>
          </Grid>
        </SearchContextProvider>
      </TestApiProvider>
    ),
  ],
};

export const Default = () => {
  return (
    <Paper style={{ padding: '8px 0' }}>
      <SearchBar />
    </Paper>
  );
};

export const CustomPlaceholder = () => {
  return (
    <Paper style={{ padding: '8px 0' }}>
      <SearchBar placeholder="This is a custom placeholder" />
    </Paper>
  );
};

export const Focused = () => {
  return (
    <Paper style={{ padding: '8px 0' }}>
      {/* decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus */}
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <SearchBar autoFocus />
    </Paper>
  );
};

export const WithoutClearButton = () => {
  return (
    <Paper style={{ padding: '8px 0' }}>
      <SearchBar clearButton={false} />
    </Paper>
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
    <Paper className={classes.search}>
      <SearchBar />
    </Paper>
  );
};
