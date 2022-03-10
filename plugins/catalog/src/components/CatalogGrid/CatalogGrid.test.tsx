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
  ANNOTATION_EDIT_URL,
  ANNOTATION_VIEW_URL,
  Entity,
} from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import {
  entityRouteRef,
  MockEntityListContextProvider,
  starredEntitiesApiRef,
  UserListFilter,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { CatalogGrid } from './CatalogGrid';

const entities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component1', title: 'Component One' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component2' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component3' },
  },
];

// For now just the same tests as the catalog table
describe('CatalogGrid component', () => {
  const mockApis = TestApiRegistry.from([
    starredEntitiesApiRef,
    new MockStarredEntitiesApi(),
  ]);

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render error message', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ error: new Error('error') }}>
          <CatalogGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    const errorMessage = await rendered.findByText(
      /Could not fetch catalog entities./,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display entity names or titles when loading has finished and no error occurred', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            entities,
            filters: {
              user: new UserListFilter(
                'owned',
                () => false,
                () => false,
              ),
            },
          }}
        >
          <CatalogGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(rendered.getByText(/Owned \(3\)/)).toBeInTheDocument();
    expect(rendered.getByText(/Component One/)).toBeInTheDocument();
    expect(rendered.getByText(/component2/)).toBeInTheDocument();
    expect(rendered.getByText(/component3/)).toBeInTheDocument();
  });

  it('should use specified edit URL if in annotation', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        annotations: { [ANNOTATION_EDIT_URL]: 'https://other.place' },
      },
    };

    const { getByTitle } = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const editButton = getByTitle('Edit');

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(window.open).toHaveBeenCalledWith('https://other.place', '_blank');
  });

  it('should use specified view URL if in annotation', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        annotations: { [ANNOTATION_VIEW_URL]: 'https://other.place' },
      },
    };

    const { getByTitle } = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const viewButton = getByTitle('View');

    await act(async () => {
      fireEvent.click(viewButton);
    });

    expect(window.open).toHaveBeenCalledWith('https://other.place', '_blank');
  });

  it('should show specified icon by URL if in metadata', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        icon: 'https://thishorsedoesnotexist.com/',
      },
    };

    const { getByAltText } = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const icon = getByAltText('component1 Icon');
    expect(icon.getAttribute('src')).toBe('https://thishorsedoesnotexist.com/');
  });

  it('should show tags if in metadata', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        tags: ['tag1', 'tag2'],
      },
    };

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('tag1')).toBeInTheDocument();
    expect(getByText('tag2')).toBeInTheDocument();
  });

  it('should show description if in metadata', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'component1',
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      },
    };

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider value={{ entities: [entity] }}>
          <CatalogGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(
      getByText('lorem ipsum dolor sit amet consectetur adipiscing elit'),
    ).toBeInTheDocument();
  });
});
