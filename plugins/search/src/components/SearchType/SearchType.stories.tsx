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

import { Grid, Paper } from '@material-ui/core';
import CatalogIcon from '@material-ui/icons/MenuBook';
import DocsIcon from '@material-ui/icons/Description';
import UsersGroupsIcon from '@material-ui/icons/Person';
import React, { ComponentType } from 'react';
import { SearchType } from './SearchType';
import { TestApiProvider } from '@backstage/test-utils';
import {
  searchApiRef,
  MockSearchApi,
  SearchContextProvider,
} from '@backstage/plugin-search-react';

export default {
  title: 'Plugins/Search/SearchType',
  component: SearchType,
  decorators: [
    (Story: ComponentType<{}>) => (
      <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
        <SearchContextProvider>
          <Grid container direction="row">
            <Grid item xs={4}>
              <Story />
            </Grid>
          </Grid>
        </SearchContextProvider>
      </TestApiProvider>
    ),
  ],
};

const values = ['value-1', 'value-2', 'value-3'];

export const Default = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>
  );
};

export const Accordion = () => {
  return (
    <SearchType.Accordion
      name="Result Types"
      defaultValue="value-1"
      types={[
        { value: 'value-1', name: 'Value One', icon: <CatalogIcon /> },
        { value: 'value-2', name: 'Value Two', icon: <DocsIcon /> },
        { value: 'value-3', name: 'Value Three', icon: <UsersGroupsIcon /> },
      ]}
    />
  );
};

export const Tabs = () => {
  return (
    <SearchType.Tabs
      defaultValue="value-1"
      types={[
        { value: 'value-1', name: 'Value One' },
        { value: 'value-2', name: 'Value Two' },
        { value: 'value-3', name: 'Value Three' },
      ]}
    />
  );
};
