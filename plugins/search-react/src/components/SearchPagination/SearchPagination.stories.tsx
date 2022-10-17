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
import { Grid } from '@material-ui/core';

import { TestApiProvider } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchPagination } from './SearchPagination';

export default {
  title: 'Plugins/Search/SearchPagination',
  component: SearchPagination,
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
  return <SearchPagination />;
};

export const CustomPageLimitLabel = () => {
  return <SearchPagination limitLabel="Rows per page:" />;
};

export const CustomPageLimitText = () => {
  return (
    <SearchPagination
      limitText={({ from, to }) => `${from}-${to} of more than ${to}`}
    />
  );
};

export const CustomPageLimitOptions = () => {
  return <SearchPagination limitOptions={[5, 10, 20]} />;
};
