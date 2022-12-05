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

import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { entityRouteRef } from '../../routes';
import { EntityRefLink } from './EntityRefLink';
import { catalogApiRef } from '../../api';
import { CatalogApi } from '@backstage/catalog-client';
import { ApiProvider } from '@backstage/core-app-api';

const catalogApi: jest.Mocked<CatalogApi> = {
  getEntityByRef: jest.fn(),
} as any;

const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

describe('<EntityRefLink />', () => {
  it('renders link for entity in default namespace', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityRefLink entityRef={entity} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders link for entity in other namespace', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityRefLink entityRef={entity} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('component:test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity and hides default kind', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityRefLink entityRef={entity} defaultKind="Component" />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity name in default namespace', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'default',
      name: 'software',
    };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityRefLink entityRef={entityName} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders link for entity name in other namespace', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityRefLink entityRef={entityName} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('component:test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity name and hides default kind', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityRefLink entityRef={entityName} defaultKind="component" />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link with custom children', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityRefLink entityRef={entityName} defaultKind="component">
          Custom Children
        </EntityRefLink>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('Custom Children')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });
});
