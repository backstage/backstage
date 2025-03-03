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

import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import React from 'react';
import {
  MockEntityListContextProvider,
  catalogApiMock,
} from '@backstage/plugin-catalog-react/testUtils';
import { EntityTagFilter } from '../../filters';
import { EntityTagPicker } from './EntityTagPicker';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';

const tags = ['tag1', 'tag2', 'tag3', 'tag4'];

describe('<EntityTagPicker/>', () => {
  const catalogApi = catalogApiMock.mock({
    getEntityFacets: async () => ({
      facets: {
        'metadata.tags': tags.map((value, idx) => ({ value, count: idx })),
      },
    }),
  });

  it('renders all tags', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('tags-picker-expand'));
    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders unique tags in alphabetical order', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityTagPicker />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('tags-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'tag1',
      'tag2',
      'tag3',
      'tag4',
    ]);
  });

  it('renders tags with counts', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityTagPicker showCounts />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('tags-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'tag1 (0)',
      'tag2 (1)',
      'tag3 (2)',
      'tag4 (3)',
    ]);
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { tags: ['tag3'] };
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
      expect(screen.getByTestId('tags-picker-expand')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('tags-picker-expand'));
    fireEvent.click(screen.getByText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: new EntityTagFilter(['tag1']),
    });
  });

  it('removes tags from filters', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
    fireEvent.click(screen.getByTestId('tags-picker-expand'));
    expect(screen.getByLabelText('tag1')).toBeChecked();

    fireEvent.click(screen.getByLabelText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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

  it('verify that user can select tags after query string has been set', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
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
      expect(screen.getByTestId('tags-picker-expand')).toBeInTheDocument(),
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('tags-picker-expand'));
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText('tag2'));
    });

    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: new EntityTagFilter(['tag1', 'tag2']),
    });
  });

  it('removes tags from filters if there are none available', async () => {
    const updateFilters = jest.fn();
    const mockCatalogApiRefNoTags = catalogApiMock.mock({
      getEntityFacets: async () => ({
        facets: {},
      }),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApiRefNoTags]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { tags: ['tag1'] },
          }}
        >
          <EntityTagPicker />
        </MockEntityListContextProvider>
        ,
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        tags: undefined,
      }),
    );
  });

  it('respects the initial filter value', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
          }}
        >
          <EntityTagPicker initialFilter={['tag3']} />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        tags: new EntityTagFilter(['tag3']),
      }),
    );
  });

  it("doesn't render when hidden", async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MockEntityListContextProvider value={{}}>
          <EntityTagPicker hidden />
        </MockEntityListContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => expect(screen.queryByText('Tags')).toBeNull());
  });
});
