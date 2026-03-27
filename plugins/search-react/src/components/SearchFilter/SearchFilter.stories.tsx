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

import { ComponentType, PropsWithChildren } from 'react';

import { TestApiProvider } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';
import { SearchFilter } from './SearchFilter';

export default {
  title: 'Plugins/Search/SearchFilter',
  component: SearchFilter,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) => (
      <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
        <SearchContextProvider>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Story />
            </div>
          </div>
        </SearchContextProvider>
      </TestApiProvider>
    ),
  ],
  tags: ['!manifest'],
};

export const CheckBoxFilter = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
      <SearchFilter.Checkbox
        name="Search Checkbox Filter"
        values={['value1', 'value2']}
      />
    </div>
  );
};

export const SelectFilter = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
      <SearchFilter.Select
        label="Search Select Filter"
        name="select_filter"
        values={['value1', 'value2']}
      />
    </div>
  );
};

export const AsyncSelectFilter = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
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
    </div>
  );
};

export const Autocomplete = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
      <SearchFilter.Autocomplete
        name="autocomplete"
        label="Single-Select Autocomplete Filter"
        values={['value1', 'value2']}
      />
    </div>
  );
};

export const MultiSelectAutocomplete = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
      <SearchFilter.Autocomplete
        multiple
        name="autocomplete"
        label="Multi-Select Autocomplete Filter"
        values={['value1', 'value2']}
      />
    </div>
  );
};

export const AsyncMultiSelectAutocomplete = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
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
    </div>
  );
};
