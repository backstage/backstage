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

import { fireEvent, waitFor, screen } from '@testing-library/react';
import { EntitySearchBar } from './EntitySearchBar';
import { EntityKindFilter, EntityTextFilter } from '../../filters';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp } from '@backstage/test-utils';

describe('EntitySearchBar', () => {
  it('should display search value and execute set callback', async () => {
    const updateFilters = jest.fn();

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: {
            text: 'hello',
          },
        }}
      >
        <EntitySearchBar />
      </MockEntityListContextProvider>,
    );

    const searchInput = screen.getByDisplayValue('hello');
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'world' } });
    await waitFor(() => expect(updateFilters.mock.calls.length).toBe(1));
    expect(updateFilters).toHaveBeenCalledWith({
      text: new EntityTextFilter('world'),
    });

    fireEvent.change(searchInput, { target: { value: '' } });
    await waitFor(() => expect(updateFilters.mock.calls.length).toBe(2));
    expect(updateFilters).toHaveBeenCalledWith({
      text: undefined,
    });
  });

  it('should use static array of search fields for all kinds', async () => {
    const updateFilters = jest.fn();
    const staticFields = ['metadata.name', 'spec.type'];

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: {},
          textFilterFields: staticFields,
          paginationMode: 'cursor',
          filters: {
            kind: new EntityKindFilter('component', 'Component'),
          },
        }}
      >
        <EntitySearchBar />
      </MockEntityListContextProvider>,
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => expect(updateFilters).toHaveBeenCalled());
    expect(updateFilters).toHaveBeenCalledWith({
      text: new EntityTextFilter('test', staticFields),
    });
  });

  it('should use per-kind search fields based on current kind', async () => {
    const updateFilters = jest.fn();
    const perKindFields = {
      component: ['metadata.name', 'spec.type'],
      user: ['metadata.name', 'spec.profile.displayName'],
    };

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: {},
          textFilterFields: perKindFields,
          paginationMode: 'cursor',
          filters: {
            kind: new EntityKindFilter('user', 'User'),
          },
        }}
      >
        <EntitySearchBar />
      </MockEntityListContextProvider>,
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'john' } });

    await waitFor(() => expect(updateFilters).toHaveBeenCalled());
    expect(updateFilters).toHaveBeenCalledWith({
      text: new EntityTextFilter('john', perKindFields.user),
    });
  });

  it('should fallback to undefined when kind not found in per-kind config', async () => {
    const updateFilters = jest.fn();
    const perKindFields = {
      component: ['metadata.name', 'spec.type'],
    };

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: {},
          textFilterFields: perKindFields,
          paginationMode: 'cursor',
          filters: {
            kind: new EntityKindFilter('api', 'API'),
          },
        }}
      >
        <EntitySearchBar />
      </MockEntityListContextProvider>,
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => expect(updateFilters).toHaveBeenCalled());
    // Should use undefined (defaults) since 'api' is not in the config
    expect(updateFilters).toHaveBeenCalledWith({
      text: new EntityTextFilter('test', undefined),
    });
  });
});
