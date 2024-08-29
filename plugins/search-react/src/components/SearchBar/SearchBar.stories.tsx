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

import React, { ComponentType, PropsWithChildren } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchBar } from './SearchBar';

export default {
  title: 'Plugins/Search/SearchBar',
  component: SearchBar,
  loaders: [
    async () => ({ component: (await import('./SearchBar')).SearchBar }),
  ],
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
          <SearchContextProvider>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Story />
              </Grid>
            </Grid>
          </SearchContextProvider>
        </TestApiProvider>,
      ),
  ],
};

export const Default = () => {
  return <SearchBar />;
};

export const CustomPlaceholder = () => {
  return <SearchBar placeholder="This is a custom placeholder" />;
};

export const CustomLabel = () => {
  return <SearchBar label="This is a custom label" />;
};

export const Focused = () => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
};

export const WithoutClearButton = () => {
  return <SearchBar clearButton={false} />;
};

const useStyles = makeStyles(theme => ({
  searchBarRoot: {
    padding: '8px 16px',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: '50px',
  },
  searchBarOutline: {
    borderStyle: 'none',
  },
}));

export const CustomStyles = () => {
  const classes = useStyles();
  return (
    <SearchBar
      InputProps={{
        classes: {
          root: classes.searchBarRoot,
          notchedOutline: classes.searchBarOutline,
        },
      }}
    />
  );
};
