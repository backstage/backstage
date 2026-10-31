/*
 * Copyright 2026 The Backstage Authors
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

import { screen } from '@testing-library/react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { mockApis } from '@backstage/frontend-test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import { alertApiRef } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import {
  AsyncEntityProvider,
  catalogApiRef,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { iconsApiRef } from '@backstage/frontend-plugin-api';
import { defaultEntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { rootRouteRef } from '../../../routes';
import { EntityLayout } from './EntityLayout';

const componentEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    namespace: 'default',
    name: 'artist-lookup',
    title: 'Artist Lookup',
  },
  spec: { type: 'service' },
};

const mockIconsApi = {
  icon: () => null,
  getIcon: () => () => null,
  listIconKeys: () => [],
};

describe('alpha/EntityLayout', () => {
  const apis = TestApiRegistry.from(
    [catalogApiRef, catalogApiMock({ entities: [componentEntity] })],
    [alertApiRef, mockApis.alert()],
    [starredEntitiesApiRef, new MockStarredEntitiesApi()],
    [permissionApiRef, mockApis.permission()],
    [iconsApiRef, mockIconsApi],
  );

  it('renders NotFoundErrorPage when entity is not found', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <AsyncEntityProvider loading={false}>
          <EntityLayout
            routes={[
              {
                path: '/overview',
                title: 'Overview',
                children: <div>Overview content</div>,
              },
            ]}
            groupDefinitions={defaultEntityContentGroupDefinitions}
          />
        </AsyncEntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/catalog': rootRouteRef,
        },
        components: {
          NotFoundErrorPage: () => <div>Custom 404 Page</div>,
        },
      },
    );

    expect(screen.getByText('Custom 404 Page')).toBeInTheDocument();
  });

  it('renders custom NotFoundComponent when provided and entity is not found', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <AsyncEntityProvider loading={false}>
          <EntityLayout
            NotFoundComponent={<div>Custom Entity Missing</div>}
            routes={[
              {
                path: '/overview',
                title: 'Overview',
                children: <div>Overview content</div>,
              },
            ]}
            groupDefinitions={defaultEntityContentGroupDefinitions}
          />
        </AsyncEntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/catalog': rootRouteRef,
        },
        components: {
          NotFoundErrorPage: () => <div>Custom 404 Page</div>,
        },
      },
    );

    expect(screen.getByText('Custom Entity Missing')).toBeInTheDocument();
    expect(screen.queryByText('Custom 404 Page')).not.toBeInTheDocument();
  });

  it('renders entity content when entity is present', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <AsyncEntityProvider entity={componentEntity} loading={false}>
          <EntityLayout
            routes={[
              {
                path: '/',
                title: 'Overview',
                children: <div>Overview content</div>,
              },
            ]}
            groupDefinitions={defaultEntityContentGroupDefinitions}
          />
        </AsyncEntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('Overview content')).toBeInTheDocument();
  });
});
