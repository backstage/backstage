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

import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityTagFilter } from '../../filters';
import { EntityTagPicker } from './EntityTagPicker';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { CatalogApi } from '@backstage/catalog-client';

const tags = ['tag1', 'tag2', 'tag3', 'tag4'];

describe('<EntityTagPicker/>', () => {
  const mockCatalogApiRef = {
    getEntityFacets: async () => ({
      facets: { 'metadata.tags': tags.map(value => ({ value })) },
    }),
  } as unknown as CatalogApi;

  it('renders all tags', async () => {
    const rendered = render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(rendered.getByText('Tags')).toBeInTheDocument());

    fireEvent.click(rendered.getByTestId('tag-picker-expand'));
    tags.forEach(tag => {
      expect(rendered.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders unique tags in alphabetical order', async () => {
    const rendered = render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(rendered.getByText('Tags')).toBeInTheDocument());

    fireEvent.click(rendered.getByTestId('tag-picker-expand'));

    expect(rendered.getAllByRole('option').map(o => o.textContent)).toEqual([
      'tag1',
      'tag2',
      'tag3',
      'tag4',
    ]);
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { tags: ['tag3'] };
    render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters,
          }}
        >
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        tags: new EntityTagFilter(['tag3']),
      }),
    );
  });

  it('adds tags to filters', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
          }}
        >
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        tags: undefined,
      }),
    );

    fireEvent.click(rendered.getByTestId('tag-picker-expand'));
    fireEvent.click(rendered.getByText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: new EntityTagFilter(['tag1']),
    });
  });

  it('removes tags from filters', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            filters: { tags: new EntityTagFilter(['tag1']) },
          }}
        >
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        tags: new EntityTagFilter(['tag1']),
      }),
    );
    fireEvent.click(rendered.getByTestId('tag-picker-expand'));
    expect(rendered.getByLabelText('tag1')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { tags: ['tag1'] },
          }}
        >
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        tags: new EntityTagFilter(['tag1']),
      }),
    );
    rendered.rerender(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRef]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { tags: ['tag2'] },
          }}
        >
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: new EntityTagFilter(['tag2']),
    });
  });
});
