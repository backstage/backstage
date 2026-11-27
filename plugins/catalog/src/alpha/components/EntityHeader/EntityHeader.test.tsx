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

import { screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { mockApis, TestApiProvider } from '@backstage/frontend-test-utils';
import {
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  AsyncEntityProvider,
  EntityProvider,
  entityPresentationApiRef,
  EntityPresentationApi,
  EntityRefPresentationSnapshot,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { EntityHeader } from './EntityHeader';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'my-entity',
    namespace: 'default',
    title: 'My Entity Title',
  },
  spec: {
    type: 'service',
  },
  relations: [
    {
      type: RELATION_PART_OF,
      targetRef: 'system:default/parent-system',
    },
    {
      type: RELATION_OWNED_BY,
      targetRef: 'group:default/team-a',
    },
  ],
};

const parentSystem: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'System',
  metadata: {
    name: 'parent-system',
    namespace: 'default',
    title: 'Parent System Title',
  },
};

describe('EntityHeader', () => {
  it('renders title and document title using presentation API when provided', async () => {
    const mockPresentationApi: EntityPresentationApi = {
      forEntity: entityOrRef => {
        const name =
          typeof entityOrRef === 'string'
            ? entityOrRef
            : entityOrRef.metadata.name;
        const snapshot: EntityRefPresentationSnapshot = {
          entityRef: `component:default/${name}`,
          primaryTitle: `Presented ${name}`,
        };
        return { snapshot, promise: Promise.resolve(snapshot) };
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          catalogApiMock({ entities: [mockEntity, parentSystem] }),
          mockApis.alert(),
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          mockApis.permission(),
          [entityPresentationApiRef, mockPresentationApi],
        ]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityHeader parentEntityRelations={[RELATION_PART_OF]} />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // Both the header title and current entity breadcrumb use EntityDisplayName
    const presentedEntities = await screen.findAllByText('Presented my-entity');
    expect(presentedEntities).toHaveLength(2);
    // Breadcrumb uses EntityRefLink for parent with Presentation API title
    expect(
      await screen.findByRole('link', {
        name: 'Presented system:default/parent-system',
      }),
    ).toBeInTheDocument();
    // Document title set by Header via pageTitleOverride
    await waitFor(() =>
      expect(document.title).toContain('Presented my-entity'),
    );
  });

  it('renders fallback title while entity is loading', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          catalogApiMock(),
          mockApis.alert(),
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          mockApis.permission(),
        ]}
      >
        <AsyncEntityProvider loading entity={undefined}>
          <EntityHeader />
        </AsyncEntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('does not duplicate namespace in title when namespaced entity has no title', async () => {
    const namespacedEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'my-service',
        namespace: 'team-a',
      },
      spec: {
        type: 'service',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          catalogApiMock({ entities: [namespacedEntity] }),
          mockApis.alert(),
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          mockApis.permission(),
        ]}
      >
        <EntityProvider entity={namespacedEntity}>
          <EntityHeader />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    // Entity has no title, so primaryTitle is 'team-a/my-service'.
    // Document title should be 'team-a/my-service' without repeating 'in team-a'.
    await waitFor(() => expect(document.title).toContain('team-a/my-service'));
    expect(document.title).not.toContain('team-a/my-service in team-a');
  });

  it('includes namespace suffix when namespaced entity has an explicit title', async () => {
    const namespacedEntityWithTitle: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'my-service',
        namespace: 'team-a',
        title: 'My Service',
      },
      spec: {
        type: 'service',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          catalogApiMock({ entities: [namespacedEntityWithTitle] }),
          mockApis.alert(),
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          mockApis.permission(),
        ]}
      >
        <EntityProvider entity={namespacedEntityWithTitle}>
          <EntityHeader />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    await waitFor(() =>
      expect(document.title).toContain('My Service in team-a'),
    );
  });
});
