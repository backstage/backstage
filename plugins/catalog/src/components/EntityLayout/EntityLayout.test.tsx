/*
 * Copyright 2020 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import {
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import {
  AsyncEntityProvider,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  MockPermissionApi,
  renderInTestApp,
  TestApiProvider,
  TestApiRegistry,
} from '@backstage/test-utils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { EntityLayout } from './EntityLayout';
import { rootRouteRef, unregisterRedirectRouteRef } from '../../routes';
import { Route, Routes } from 'react-router-dom';

describe('EntityLayout', () => {
  const mockEntity = {
    kind: 'MyKind',
    metadata: {
      name: 'my-entity',
    },
  } as Entity;

  const mockApis = TestApiRegistry.from(
    [catalogApiRef, {} as CatalogApi],
    [alertApiRef, {} as AlertApi],
    [starredEntitiesApiRef, new MockStarredEntitiesApi()],
    [permissionApiRef, new MockPermissionApi()],
  );

  it('renders simplest case', async () => {
    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityProvider entity={mockEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('my-entity')).toBeInTheDocument();
    expect(screen.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(screen.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('renders the entity title if defined', async () => {
    const mockEntityWithTitle = {
      kind: 'MyKind',
      metadata: {
        name: 'my-entity',
        namespace: 'default',
        title: 'My Entity',
      },
    } as Entity;

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityProvider entity={mockEntityWithTitle}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('My Entity')).toBeInTheDocument();
    expect(screen.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(screen.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('renders default error message when entity is not found', async () => {
    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <AsyncEntityProvider loading={false}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </AsyncEntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('Warning: Entity not found')).toBeInTheDocument();
    expect(screen.queryByText('my-entity')).not.toBeInTheDocument();
    expect(screen.queryByText('tabbed-test-title')).not.toBeInTheDocument();
    expect(screen.queryByText('tabbed-test-content')).not.toBeInTheDocument();
  });

  it('renders custom message when entity is not found', async () => {
    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <AsyncEntityProvider loading={false}>
          <EntityLayout
            NotFoundComponent={<div>Oppps.. Your entity was not found</div>}
          >
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </AsyncEntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(
      screen.getByText('Oppps.. Your entity was not found'),
    ).toBeInTheDocument();
    expect(screen.queryByText('my-entity')).not.toBeInTheDocument();
    expect(screen.queryByText('tabbed-test-title')).not.toBeInTheDocument();
    expect(screen.queryByText('tabbed-test-content')).not.toBeInTheDocument();
  });

  it('navigates when user clicks different tab', async () => {
    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityProvider entity={mockEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
            <EntityLayout.Route
              path="/some-other-path"
              title="tabbed-test-title-2"
            >
              <div>tabbed-test-content-2</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    const secondTab = screen.queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(screen.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(screen.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(screen.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(screen.getByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  it('should conditionally render tabs', async () => {
    const shouldRenderTab = (e: Entity) => e.metadata.name === 'my-entity';
    const shouldNotRenderTab = (e: Entity) => e.metadata.name === 'some-entity';

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityProvider entity={mockEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
            <EntityLayout.Route
              path="/some-other-path"
              title="tabbed-test-title-2"
              if={shouldNotRenderTab}
            >
              <div>tabbed-test-content-2</div>
            </EntityLayout.Route>
            <EntityLayout.Route
              path="/some-other-other-path"
              title="tabbed-test-title-3"
              if={shouldRenderTab}
            >
              <div>tabbed-test-content-3</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(screen.queryByText('tabbed-test-title-2')).not.toBeInTheDocument();
    expect(screen.getByText('tabbed-test-title-3')).toBeInTheDocument();
  });

  it('renders the owner links inside `p` tags', async () => {
    const mockTargetRef = 'my:target/ref';
    const ownerEntity = {
      ...mockEntity,
      relations: [{ type: 'ownedBy', targetRef: mockTargetRef }],
    };
    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityProvider entity={ownerEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    const ownerLink = screen.getByText(mockTargetRef).closest('a');
    expect(ownerLink).toBeInTheDocument();
    expect(ownerLink?.tagName).toBe('A');
    const linkParent = ownerLink?.parentElement;
    expect(linkParent).toBeInTheDocument();
    expect(linkParent?.tagName).toBe('P');
  });
});

describe('EntityLayout - CleanUpAfterRemoval', () => {
  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'n',
      namespace: 'ns',
      annotations: {
        [ANNOTATION_ORIGIN_LOCATION]: 'url:http://example.com',
      },
    },
    spec: {
      owner: 'tools',
      type: 'service',
    },
    relations: [
      {
        type: RELATION_OWNED_BY,
        targetRef: 'group:default/tools',
      },
    ],
  };
  const getLocationByRef: jest.MockedFunction<CatalogApi['getLocationByRef']> =
    jest.fn();
  const getEntities: jest.MockedFunction<CatalogApi['getEntities']> = jest.fn();
  const removeEntityByUid: jest.MockedFunction<
    CatalogApi['removeEntityByUid']
  > = jest.fn();
  const getEntityFacets: jest.MockedFunction<CatalogApi['getEntityFacets']> =
    jest.fn();
  getLocationByRef.mockResolvedValue(undefined);
  getEntities.mockResolvedValue({ items: [{ ...entity }] });
  getEntityFacets.mockResolvedValue({
    facets: {
      'relations.ownedBy': [{ count: 1, value: 'group:default/tools' }],
    },
  });

  const alertApi: AlertApi = {
    post() {
      return undefined;
    },
    alert$() {
      throw new Error('not implemented');
    },
  };

  it('redirects to externalRouteRef when unregisterRedirectRouteRef is bound', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            catalogApiRef,
            {
              getLocationByRef,
              getEntities,
              removeEntityByUid,
              getEntityFacets,
            },
          ],
          [alertApiRef, alertApi],
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          [permissionApiRef, new MockPermissionApi()],
        ]}
      >
        <EntityProvider entity={entity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
        <Routes>
          <Route path="/catalog" element={<p>catalog-page</p>} />
          <Route path="/testRoute" element={<p>external-page</p>} />
        </Routes>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
          '/testRoute': unregisterRedirectRouteRef,
        },
      },
    );

    const menuButton = screen.queryAllByTestId('menu-button')[0];
    fireEvent.click(menuButton);
    const listItemUnregister = screen.queryAllByRole('menuitem', {
      name: /Unregister entity/i,
    })[0];
    fireEvent.click(listItemUnregister);
    await waitFor(() => {
      const deleteEntityButton = screen.getByRole('button', {
        name: /Delete Entity/i,
      });
      act(() => {
        fireEvent.click(deleteEntityButton);
      });
    });

    await waitFor(() => {
      expect(screen.getByText('external-page')).toBeInTheDocument();
    });
  });

  it('redirects to rootRouteRef when unregisterRedirectRouteRef is not bound', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            catalogApiRef,
            {
              getLocationByRef,
              getEntities,
              removeEntityByUid,
              getEntityFacets,
            },
          ],
          [alertApiRef, alertApi],
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          [permissionApiRef, new MockPermissionApi()],
        ]}
      >
        <EntityProvider entity={entity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
        <Routes>
          <Route path="/catalog" element={<p>catalog-page</p>} />
          <Route path="/testRoute" element={<p>external-page</p>} />
        </Routes>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    const menuButton = screen.queryAllByTestId('menu-button')[0];
    fireEvent.click(menuButton);
    const listItemUnregister = screen.queryAllByRole('menuitem', {
      name: /Unregister entity/i,
    })[0];
    fireEvent.click(listItemUnregister);
    await waitFor(() => {
      const deleteEntityButton = screen.getByRole('button', {
        name: /Delete Entity/i,
      });
      act(() => {
        fireEvent.click(deleteEntityButton);
      });
    });

    await waitFor(() => {
      expect(screen.getByText('catalog-page')).toBeInTheDocument();
    });
  });
});
