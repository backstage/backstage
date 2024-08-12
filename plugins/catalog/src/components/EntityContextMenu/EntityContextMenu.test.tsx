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

import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  MockPermissionApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import SearchIcon from '@material-ui/icons/Search';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { EntityContextMenu } from './EntityContextMenu';
import { rootRouteRef, unregisterRedirectRouteRef } from '../../routes';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { Route, Routes } from 'react-router-dom';

const mockPermissionApi = new MockPermissionApi();

function render(children: React.ReactNode) {
  return renderInTestApp(
    <TestApiProvider
      apis={[
        [catalogApiRef, {}], // UnregisterEntityDialog uses catalogApi
        [permissionApiRef, mockPermissionApi],
      ]}
    >
      <EntityProvider
        entity={{ apiVersion: 'a', kind: 'b', metadata: { name: 'c' } }}
        children={children}
      />
    </TestApiProvider>,
    {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name': entityRouteRef,
        '/catalog': rootRouteRef,
      },
    },
  );
}

describe('ComponentContextMenu', () => {
  it('should display UnregisterEntityDialog on button click', async () => {
    await render(<EntityContextMenu />);

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const unregister = await screen.findByText('Unregister entity');
    expect(unregister).toBeInTheDocument();
    fireEvent.click(unregister);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('check Unregister entity button is disabled', async () => {
    await render(
      <EntityContextMenu
        UNSTABLE_contextMenuOptions={{ disableUnregister: 'disable' }}
      />,
    );

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const unregister = screen.getByText('Unregister entity');
    expect(unregister).toBeInTheDocument();

    const unregisterSpanItem = screen.getByText(/Unregister entity/);
    const unregisterMenuListItem =
      unregisterSpanItem?.parentElement?.parentElement;
    expect(unregisterMenuListItem).toHaveAttribute('aria-disabled');
  });

  it('should display InspectEntityDialog on button click', async () => {
    await render(<EntityContextMenu />);

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const unregister = await screen.findByText('Inspect entity');
    expect(unregister).toBeInTheDocument();
    fireEvent.click(unregister);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('supports extra items', async () => {
    const extra = {
      title: 'HELLO',
      Icon: SearchIcon,
      onClick: jest.fn(),
    };

    await render(
      <EntityContextMenu UNSTABLE_extraContextMenuItems={[extra]} />,
    );

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const item = await screen.findByText('HELLO');
    expect(item).toBeInTheDocument();
    fireEvent.click(item);

    expect(extra.onClick).toHaveBeenCalled();
  });
});

describe('EntityLayout - CleanUpAfterRemoval', () => {
  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'n',
      namespace: 'ns',
    },
    spec: {
      owner: 'tools',
      type: 'service',
    },
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
          <EntityContextMenu />
        </EntityProvider>
        <Routes>
          <Route path="/" element={<p>root-page</p>} />
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
          <EntityContextMenu />
        </EntityProvider>
        <Routes>
          <Route path="/" element={<p>root-page</p>} />
          <Route path="/catalog" element={<p>catalog-page</p>} />
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
