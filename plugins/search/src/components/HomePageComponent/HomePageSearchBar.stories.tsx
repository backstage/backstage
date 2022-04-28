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

import { rootRouteRef, HomePageSearchBar } from '../../plugin';
import { searchApiRef } from '@backstage/plugin-search-react';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Grid, makeStyles } from '@material-ui/core';
import React, { ComponentType } from 'react';

export default {
  title: 'Plugins/Home/Components/SearchBar',
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <>
          <TestApiProvider
            apis={[
              [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
            ]}
          >
            <Story />
          </TestApiProvider>
        </>,
        {
          mountedRoutes: { '/hello-search': rootRouteRef },
        },
      ),
  ],
};

export const Default = () => {
  return (
    <Grid container justifyContent="center" spacing={6}>
      <Grid container item xs={12} alignItems="center" direction="row">
        <HomePageSearchBar placeholder="Search" />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  searchBar: {
    display: 'flex',
    maxWidth: '60vw',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: '8px 0',
    borderRadius: '50px',
    margin: 'auto',
  },
}));

export const CustomStyles = () => {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center" spacing={6}>
      <Grid container item xs={12} alignItems="center" direction="row">
        <HomePageSearchBar
          classes={{ root: classes.searchBar }}
          placeholder="Search"
        />
      </Grid>
    </Grid>
  );
};
