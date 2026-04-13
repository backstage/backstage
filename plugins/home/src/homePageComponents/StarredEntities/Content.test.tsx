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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import {
  catalogApiRef,
  entityPresentationApiRef,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { Content } from './Content';

const entities = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity-2',
      title: 'Mock Starred Entity 2!',
    },
  },
];

describe('StarredEntitiesContent', () => {
  it('should render list of starred entities', async () => {
    const mockedApi = new MockStarredEntitiesApi();
    mockedApi.toggleStarred('component:default/mock-starred-entity');
    mockedApi.toggleStarred('component:default/mock-starred-entity-2');
    mockedApi.toggleStarred('component:default/mock-starred-entity-3');

    const mockCatalogApi = catalogApiMock.mock({
      getEntitiesByRefs: jest.fn().mockImplementation(async ({ fields }) => {
        const expectedFields = [
          'kind',
          'metadata.namespace',
          'metadata.name',
          'spec.type',
          'metadata.title',
          'spec.profile.displayName',
        ];
        expectedFields.forEach(field => {
          expect(fields).toContain(field);
        });
        return {
          items: entities,
        };
      }),
    });

    const { getByText, queryByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            entityPresentationApiRef,
            {
              forEntity: (entity: any) => ({
                snapshot: {
                  entityRef: entity.metadata.name,
                  primaryTitle:
                    entity.metadata.annotations?.[
                      'backstage.io/presentation-title'
                    ] ??
                    entity.metadata.title ??
                    entity.metadata.name,
                },
                promise: Promise.resolve({
                  entityRef: entity.metadata.name,
                  primaryTitle:
                    entity.metadata.annotations?.[
                      'backstage.io/presentation-title'
                    ] ??
                    entity.metadata.title ??
                    entity.metadata.name,
                }),
              }),
            },
          ],
          [starredEntitiesApiRef, mockedApi],
        ]}
      >
        <Content />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('mock-starred-entity')).toBeInTheDocument();
    expect(getByText('Mock Starred Entity 2!')).toBeInTheDocument();
    expect(queryByText('mock-starred-entity-3')).not.toBeInTheDocument();
    expect(getByText('mock-starred-entity').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/mock-starred-entity',
    );
    expect(getByText('Mock Starred Entity 2!').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/mock-starred-entity-2',
    );
  });

  it('should display call to action message if no entities are starred', async () => {
    const mockedApi = new MockStarredEntitiesApi();

    const mockCatalogApi = catalogApiMock.mock({
      getEntitiesByRefs: jest
        .fn()
        .mockImplementation(async () => ({ items: entities })),
    });

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            entityPresentationApiRef,
            {
              forEntity: (entity: any) => ({
                snapshot: {
                  entityRef: entity.metadata.name,
                  primaryTitle: entity.metadata.title ?? entity.metadata.name,
                },
                promise: Promise.resolve({
                  entityRef: entity.metadata.name,
                  primaryTitle: entity.metadata.title ?? entity.metadata.name,
                }),
              }),
            },
          ],
          [starredEntitiesApiRef, mockedApi],
        ]}
      >
        <Content />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(
      getByText('Click the star beside an entity name to add it to this list!'),
    ).toBeInTheDocument();
  });

  it('should display user provided message if no entities are starred', async () => {
    const mockedApi = new MockStarredEntitiesApi();

    const mockCatalogApi = catalogApiMock.mock({
      getEntitiesByRefs: jest
        .fn()
        .mockImplementation(async () => ({ items: entities })),
    });

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            entityPresentationApiRef,
            {
              forEntity: (entity: any) => ({
                snapshot: {
                  entityRef: entity.metadata.name,
                  primaryTitle: entity.metadata.title ?? entity.metadata.name,
                },
                promise: Promise.resolve({
                  entityRef: entity.metadata.name,
                  primaryTitle: entity.metadata.title ?? entity.metadata.name,
                }),
              }),
            },
          ],
          [starredEntitiesApiRef, mockedApi],
        ]}
      >
        <Content noStarredEntitiesMessage="foo" />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('foo')).toBeInTheDocument();
  });

  it('should sort starred entities by presentation title', async () => {
    const mockedApi = new MockStarredEntitiesApi();
    mockedApi.toggleStarred('component:default/z-name');
    mockedApi.toggleStarred('component:default/a-name');

    const mockCatalogApi = catalogApiMock.mock({
      getEntitiesByRefs: jest.fn().mockResolvedValue({
        items: [
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'z-name',
              annotations: {
                'backstage.io/presentation-title': 'A title',
              },
            },
          },
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'a-name',
              annotations: {
                'backstage.io/presentation-title': 'Z title',
              },
            },
          },
        ],
      }),
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            entityPresentationApiRef,
            {
              forEntity: (entity: any) => ({
                snapshot: {
                  entityRef: entity.metadata.name,
                  primaryTitle:
                    entity.metadata.annotations?.[
                      'backstage.io/presentation-title'
                    ] ?? entity.metadata.name,
                },
                promise: Promise.resolve({
                  entityRef: entity.metadata.name,
                  primaryTitle:
                    entity.metadata.annotations?.[
                      'backstage.io/presentation-title'
                    ] ?? entity.metadata.name,
                }),
              }),
            },
          ],
          [starredEntitiesApiRef, mockedApi],
        ]}
      >
        <Content />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const firstTitle = await screen.findByText('A title');
    const secondTitle = await screen.findByText('Z title');
    expect(
      firstTitle.compareDocumentPosition(secondTitle) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('should sort grouped starred entities by presentation title', async () => {
    const mockedApi = new MockStarredEntitiesApi();
    mockedApi.toggleStarred('component:default/z-name');
    mockedApi.toggleStarred('component:default/a-name');

    const mockCatalogApi = catalogApiMock.mock({
      getEntitiesByRefs: jest.fn().mockResolvedValue({
        items: [
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'z-name',
              annotations: {
                'backstage.io/presentation-title': 'A title',
              },
            },
          },
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'a-name',
              annotations: {
                'backstage.io/presentation-title': 'Z title',
              },
            },
          },
        ],
      }),
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            entityPresentationApiRef,
            {
              forEntity: (entity: any) => ({
                snapshot: {
                  entityRef: entity.metadata.name,
                  primaryTitle:
                    entity.metadata.annotations?.[
                      'backstage.io/presentation-title'
                    ] ?? entity.metadata.name,
                },
                promise: Promise.resolve({
                  entityRef: entity.metadata.name,
                  primaryTitle:
                    entity.metadata.annotations?.[
                      'backstage.io/presentation-title'
                    ] ?? entity.metadata.name,
                }),
              }),
            },
          ],
          [starredEntitiesApiRef, mockedApi],
        ]}
      >
        <Content groupByKind />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const firstTitle = await screen.findByText('A title');
    const secondTitle = await screen.findByText('Z title');
    expect(
      firstTitle.compareDocumentPosition(secondTitle) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
