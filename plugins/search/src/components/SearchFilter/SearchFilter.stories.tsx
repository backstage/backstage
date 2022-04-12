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
import React, { ComponentType } from 'react';
import { SearchContextProviderForStorybook } from '@backstage/plugin-search-react';
import { SearchFilter } from './SearchFilter';

export default {
  title: 'Plugins/Search/SearchFilter',
  component: SearchFilter,
  decorators: [
    (Story: ComponentType<{}>) => (
      <SearchContextProviderForStorybook>
        <Grid container direction="row">
          <Grid item xs={4}>
            <Story />
          </Grid>
        </Grid>
      </SearchContextProviderForStorybook>
    ),
  ],
};

export const CheckBoxFilter = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Checkbox
        name="Search Checkbox Filter"
        values={['value1', 'value2']}
      />
    </Paper>
  );
};

export const SelectFilter = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Select
        label="Search Select Filter"
        name="select_filter"
        values={['value1', 'value2']}
      />
    </Paper>
  );
};

export const AsyncSelectFilter = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Select
        label="Asynchronous Values"
        name="async_values"
        values={async () => {
          const response = await fetch('https://swapi.dev/api/planets');
          const json: { results: Array<{ name: string }> } =
            await response.json();
          return json.results.map(r => r.name);
        }}
      />
    </Paper>
  );
};

export const Autocomplete = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Autocomplete
        name="autocomplete"
        label="Single-Select Autocomplete Filter"
        values={['value1', 'value2']}
      />
    </Paper>
  );
};

export const MultiSelectAutocomplete = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Autocomplete
        multiple
        name="autocomplete"
        label="Multi-Select Autocomplete Filter"
        values={['value1', 'value2']}
      />
    </Paper>
  );
};

export const AsyncMultiSelectAutocomplete = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Autocomplete
        multiple
        name="starwarsPerson"
        label="Starwars Character"
        values={async partial => {
          if (partial === '') return [];
          const response = await fetch(
            `https://swapi.dev/api/people?search=${encodeURIComponent(
              partial,
            )}`,
          );
          const json: { results: Array<{ name: string }> } =
            await response.json();
          return json.results.map(r => r.name);
        }}
      />
    </Paper>
  );
};
