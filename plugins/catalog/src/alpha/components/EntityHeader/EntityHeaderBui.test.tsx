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

import { act, screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import {
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  EntityProvider,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { EntityHeaderBui } from './EntityHeaderBui';

const componentEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    namespace: 'default',
    name: 'artist-lookup',
    title: 'Artist Lookup',
  },
  spec: { type: 'service', lifecycle: 'experimental' },
  relations: [
    { type: RELATION_OWNED_BY, targetRef: 'group:default/team-a' },
    {
      type: RELATION_PART_OF,
      targetRef: 'system:default/artist-engagement-portal',
    },
  ],
};

const ownerEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: { namespace: 'default', name: 'team-a', title: 'Team A' },
  spec: { profile: { picture: 'https://example.com/team-a.png' } },
};

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(resolver => {
    resolve = resolver;
  });
  return { promise, resolve };
}

async function renderHeader(options: {
  entity?: Entity;
  catalogEntities?: Entity[];
  catalogApi?: ReturnType<typeof catalogApiMock>;
}) {
  return renderInTestApp(
    <EntityProvider entity={options.entity}>
      <EntityHeaderBui tabs={[]} contextMenuItems={[]} />
    </EntityProvider>,
    {
      apis: [
        options.catalogApi ??
          catalogApiMock({ entities: options.catalogEntities ?? [] }),
        [starredEntitiesApiRef, new MockStarredEntitiesApi()],
      ],
      mountPath: '/catalog/:namespace/:kind/:name',
      initialRouteEntries: ['/catalog/default/component/artist-lookup'],
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name': entityRouteRef,
      },
    },
  );
}

describe('EntityHeaderBui', () => {
  it('renders rich entity data from canonical relations', async () => {
    await renderHeader({
      entity: componentEntity,
      catalogEntities: [componentEntity, ownerEntity],
    });

    expect(
      await screen.findByRole('heading', { name: 'Artist Lookup' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Component')).toBeInTheDocument();
    expect(screen.getByText('service')).toBeInTheDocument();
    expect(screen.getByText('experimental')).toBeInTheDocument();
    expect(await screen.findByText('Team A')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'artist-engagement-portal' }),
    ).toHaveAttribute(
      'href',
      '/catalog/default/system/artist-engagement-portal',
    );
    expect(
      screen.getByRole('button', { name: 'Add to favorites' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'More actions' }),
    ).toBeInTheDocument();
  });

  it('keeps a useful owner fallback while catalog owner resolution is pending', async () => {
    const ownerResponse = createDeferred<{ items: Entity[] }>();
    await renderHeader({
      entity: componentEntity,
      catalogApi: catalogApiMock.mock({
        getEntitiesByRefs: jest.fn(() => ownerResponse.promise),
      }),
    });

    expect(await screen.findByText('team-a')).toBeInTheDocument();
    await act(async () => {
      ownerResponse.resolve({ items: [ownerEntity] });
    });
    expect(await screen.findByText('Team A')).toBeInTheDocument();
  });

  it('renders a route-ref title while the entity is loading', async () => {
    await renderHeader({ entity: undefined });
    expect(
      screen.getByRole('heading', { name: 'artist-lookup' }),
    ).toBeInTheDocument();
  });
});
