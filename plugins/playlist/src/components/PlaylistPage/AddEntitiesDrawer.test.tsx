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

import {
  CatalogApi,
  catalogApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { SearchApi, searchApiRef } from '@backstage/plugin-search-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent, getByText } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';

import { AddEntitiesDrawer } from './AddEntitiesDrawer';

describe('AddEntitiesDrawer', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntityFacets: jest.fn().mockImplementation(async () => ({
      facets: {
        kind: [{ value: 'component' }],
      },
    })),
  };

  const mockOnAdd = jest.fn();
  const sampleCurrentEntities = [
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'system',
      metadata: { namespace: 'default', name: 'test-ent' },
    },
  ];

  const mockSearchResults = [
    {
      type: 'software-catalog',
      document: {
        title: 'Test Ent',
        text: 'This is test ent',
        location: '/catalog/default/system/test-ent',
        kind: 'system',
      },
    },
    {
      type: 'software-catalog',
      document: {
        title: 'Test Ent 2',
        text: 'This is test ent 2',
        location: '/catalog/foo/component/test-ent2',
        kind: 'component',
        type: 'library',
      },
    },
    {
      type: 'software-catalog',
      document: {
        title: 'Test Ent 3',
        text: 'This is test ent 3',
        location: '/catalog/bar/api/test-ent3',
        kind: 'api',
        type: 'openapi',
      },
    },
  ];

  const searchApi: Partial<SearchApi> = {
    query: jest
      .fn()
      .mockImplementation(async () => ({ results: mockSearchResults })),
  };

  const element = (
    <TestApiProvider
      apis={[
        [catalogApiRef, catalogApi],
        [searchApiRef, searchApi],
      ]}
    >
      <AddEntitiesDrawer
        open
        onAdd={mockOnAdd}
        onClose={jest.fn()}
        currentEntities={sampleCurrentEntities}
      />
    </TestApiProvider>
  );

  const render = async () =>
    renderInTestApp(element, {
      mountedRoutes: { '/catalog/:namespace/:kind/:name': entityRouteRef },
    });

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it('should render available entities correctly', async () => {
    const rendered = await render();
    expect(searchApi.query).toHaveBeenLastCalledWith({
      filters: {},
      term: '',
      types: ['software-catalog'],
    });

    expect(rendered.getByText('Test Ent')).toBeInTheDocument();
    expect(rendered.getByText('This is test ent')).toBeInTheDocument();
    expect(rendered.getByText('Kind: system')).toBeInTheDocument();

    expect(rendered.getByText('Test Ent 2')).toBeInTheDocument();
    expect(rendered.getByText('This is test ent 2')).toBeInTheDocument();
    expect(rendered.getByText('Kind: component')).toBeInTheDocument();
    expect(rendered.getByText('Type: library')).toBeInTheDocument();

    expect(rendered.getByText('Test Ent 3')).toBeInTheDocument();
    expect(rendered.getByText('This is test ent 3')).toBeInTheDocument();
    expect(rendered.getByText('Kind: api')).toBeInTheDocument();
    expect(rendered.getByText('Type: openapi')).toBeInTheDocument();
  });

  it('should disable options that are already added', async () => {
    const rendered = await render();

    const addButtons = rendered.getAllByTestId('entity-drawer-add-button');
    expect(addButtons.length).toEqual(3);

    expect(getByText(addButtons[0], 'Added')).toBeInTheDocument();
    expect(addButtons[0]).toBeDisabled();

    expect(getByText(addButtons[1], 'Add')).toBeInTheDocument();
    expect(addButtons[1]).not.toBeDisabled();

    expect(getByText(addButtons[2], 'Add')).toBeInTheDocument();
    expect(addButtons[2]).not.toBeDisabled();
  });

  it('should add entities correctly', async () => {
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getAllByTestId('entity-drawer-add-button')[1]);
    });

    expect(mockOnAdd).toHaveBeenCalledWith('component:foo/test-ent2');
  });
});
