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

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import SearchToolbar from './SearchToolbar';
import {
  DefaultEntityFilters,
  EntityTextFilter,
  MockEntityListContextProvider,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'react-app',
      tags: ['react', 'experimental'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'gRPC service',
      tags: ['gRPC', 'java'],
    },
  },
];

describe('SearchToolbar', () => {
  it('should display search value and execute set callback', async () => {
    const updateFilters = jest.fn();

    const filters: DefaultEntityFilters = {
      text: new EntityTextFilter('hello'),
    };

    const { getByDisplayValue } = render(
      <MockEntityListContextProvider
        value={{ entities, updateFilters, filters }}
      >
        <SearchToolbar />
      </MockEntityListContextProvider>,
    );

    const searchInput = getByDisplayValue('hello');
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'world' } });
    expect(updateFilters).toHaveBeenCalledWith({
      text: new EntityTextFilter('world'),
    });

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(updateFilters).toHaveBeenCalledWith({
      text: undefined,
    });
  });
});
