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

import { AlphaEntity } from '@backstage/catalog-model/alpha';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import {
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { EntityProcessingErrorsPanel } from './EntityProcessingErrorsPanel';

describe('<EntityProcessErrors />', () => {
  const catalogApi = catalogApiMock.mock();
  const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

  it('renders EntityProcessErrors if the entity has errors', async () => {
    const entity: AlphaEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },

      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      status: {
        items: [
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message:
              'InputError: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
            error: {
              name: 'InputError',
              message:
                'Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'foo',
            level: 'error',
            message: 'InputError: This should not be rendered',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message: 'InputError: Foo',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
        ],
      },
    };

    catalogApi.getEntityAncestors.mockResolvedValue({
      rootEntityRef: stringifyEntityRef(entity),
      items: [{ entity, parentEntityRefs: [] }],
    });
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <EntityProcessingErrorsPanel />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(
      screen.getByText(
        'Error: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Error: Foo')).toBeInTheDocument();
    expect(screen.queryByText('Error: This should not be rendered')).toBeNull();
    expect(
      screen.queryByText('The error below originates from'),
    ).not.toBeInTheDocument();
  });

  it('renders EntityProcessErrors if the parent entity has errors', async () => {
    const entity: AlphaEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const parent: AlphaEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'parent',
        description: 'This is the description',
      },

      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      status: {
        items: [
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message:
              'InputError: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
            error: {
              name: 'InputError',
              message:
                'Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'foo',
            level: 'error',
            message: 'InputError: This should not be rendered',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message: 'InputError: Foo',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
        ],
      },
    };
    catalogApi.getEntityAncestors.mockResolvedValue({
      rootEntityRef: stringifyEntityRef(entity),
      items: [
        { entity, parentEntityRefs: [stringifyEntityRef(parent)] },
        { entity: parent, parentEntityRefs: [] },
      ],
    });
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <EntityProcessingErrorsPanel />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(
      screen.getByText(
        'Error: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Error: Foo')).toBeInTheDocument();
    expect(screen.queryByText('Error: This should not be rendered')).toBeNull();
    expect(
      screen.getByText('The error below originates from'),
    ).toBeInTheDocument();
  });
});
