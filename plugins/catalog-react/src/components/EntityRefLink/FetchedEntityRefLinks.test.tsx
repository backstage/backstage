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
import { FetchedEntityRefLinks } from './FetchedEntityRefLinks';
import { entityRouteRef } from '../../routes';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import React from 'react';
import { JsonObject } from '@backstage/types';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';

describe('<FetchedEntityRefLinks />', () => {
  const getTitle = (e: Entity): string =>
    (e.spec?.profile!! as JsonObject).displayName!!.toString()!!;

  const mockedGetEntityByRef: jest.MockedFn<CatalogApi['getEntityByRef']> =
    jest.fn();

  const entities = [
    {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'tool',
      },
      spec: {},
    },
    {
      apiVersion: 'v1',
      kind: 'API',
      metadata: {
        name: 'implementation',
      },
      spec: {},
    },
    {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'interface',
      },
      spec: {},
    },
    {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {},
    },
    {
      apiVersion: 'v1',
      kind: 'API',
      metadata: {
        name: 'interface',
      },
      spec: {},
    },
  ];

  it('should fetch entities and render the custom display text', async () => {
    const entityRefs = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'software',
      },
      {
        kind: 'API',
        namespace: 'default',
        name: 'interface',
      },
    ];

    const catalogApi: Partial<CatalogApi> = {
      getEntities: () =>
        Promise.resolve({
          items: entityRefs.map(ref => ({
            apiVersion: 'backstage.io/v1alpha1',
            kind: ref.kind,
            metadata: {
              name: ref.name,
              namespace: ref.namespace,
            },
            spec: {
              profile: {
                displayName: ref.name.toLocaleUpperCase('en-US'),
              },
              type: 'organization',
            },
          })),
        }),
      getEntityByRef: mockedGetEntityByRef,
    };

    mockedGetEntityByRef
      .mockResolvedValueOnce(entities[3])
      .mockResolvedValueOnce(entities[4]);
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <FetchedEntityRefLinks entityRefs={entityRefs} getTitle={getTitle} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('SOFTWARE')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );

    expect(screen.getByText('INTERFACE')).toHaveAttribute(
      'href',
      '/catalog/default/api/interface',
    );
  });

  it('should use entities as they are provided and render the custom display text', async () => {
    const entityRefs = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'tool',
      },
      {
        kind: 'API',
        namespace: 'default',
        name: 'implementation',
      },
    ].map(ref => ({
      apiVersion: 'backstage.io/v1alpha1',
      kind: ref.kind,
      metadata: {
        name: ref.name,
        namespace: ref.namespace,
      },
      spec: {
        profile: {
          displayName: ref.name.toLocaleUpperCase('en-US'),
        },
        type: 'organization',
      },
    }));

    const catalogApi: Partial<CatalogApi> = {
      getEntityByRef: mockedGetEntityByRef,
    };

    mockedGetEntityByRef
      .mockResolvedValueOnce(entities[0])
      .mockResolvedValueOnce(entities[1]);
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <FetchedEntityRefLinks entityRefs={entityRefs} getTitle={getTitle} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('TOOL')).toHaveAttribute(
      'href',
      '/catalog/default/component/tool',
    );

    expect(screen.getByText('IMPLEMENTATION')).toHaveAttribute(
      'href',
      '/catalog/default/api/implementation',
    );
  });

  it('should handle heterogeneous array of values to render the custom display text', async () => {
    const entityRefs = [
      ...[
        {
          kind: 'Component',
          namespace: 'default',
          name: 'tool',
        },
        {
          kind: 'API',
          namespace: 'default',
          name: 'implementation',
        },
      ].map(ref => ({
        apiVersion: 'backstage.io/v1alpha1',
        kind: ref.kind,
        metadata: {
          name: ref.name,
          namespace: ref.namespace,
        },
        spec: {
          profile: {
            displayName: ref.name.toLocaleUpperCase('en-US'),
          },
          type: 'organization',
        },
      })),
      {
        kind: 'Component',
        namespace: 'default',
        name: 'interface',
      },
    ];

    const catalogApi: Partial<CatalogApi> = {
      getEntities: () =>
        Promise.resolve({
          items: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'interface',
                namespace: 'default',
              },
              spec: {
                profile: {
                  displayName: 'INTERFACE',
                },
                type: 'organization',
              },
            },
          ],
        }),
      getEntityByRef: mockedGetEntityByRef,
    };

    mockedGetEntityByRef
      .mockResolvedValueOnce(entities[0])
      .mockResolvedValueOnce(entities[1])
      .mockResolvedValueOnce(entities[2]);
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <FetchedEntityRefLinks entityRefs={entityRefs} getTitle={getTitle} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('TOOL')).toHaveAttribute(
      'href',
      '/catalog/default/component/tool',
    );

    expect(screen.getByText('IMPLEMENTATION')).toHaveAttribute(
      'href',
      '/catalog/default/api/implementation',
    );

    expect(screen.getByText('INTERFACE')).toHaveAttribute(
      'href',
      '/catalog/default/component/interface',
    );
  });
});
