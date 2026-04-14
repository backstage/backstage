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

import { Entity, RELATION_HAS_PART } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { EntityRelationCard } from './EntityRelationCard';
import { entityColumnPresets } from '../EntityDataTable/presets';
import { catalogApiMock } from '../../testUtils/catalogApiMock';

describe('<EntityRelationCard />', () => {
  const catalogApi = catalogApiMock.mock();
  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: ReactNode }) => (
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('renders the card title', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: { name: 'my-system', namespace: 'my-namespace' },
      relations: [],
    };

    await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntityRelationCard
            title="Has components"
            relationType={RELATION_HAS_PART}
            entityKind="Component"
            columnConfig={entityColumnPresets.component.columns}
          />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('Has components')).toBeInTheDocument();
  });

  it('shows empty state message and help link when no related entities', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: { name: 'my-system', namespace: 'my-namespace' },
      relations: [],
    };

    await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntityRelationCard
            title="Has components"
            relationType={RELATION_HAS_PART}
            entityKind="Component"
            columnConfig={entityColumnPresets.component.columns}
            emptyState={{
              message: 'No component is part of this system.',
              helpLink: 'https://backstage.io/docs',
            }}
          />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(
      screen.getByText(/No component is part of this system/),
    ).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://backstage.io/docs');
  });

  it('shows related entities in the table', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: { name: 'my-system', namespace: 'my-namespace' },
      relations: [
        {
          targetRef: 'component:my-namespace/my-component',
          type: RELATION_HAS_PART,
        },
      ],
    };
    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [
        {
          apiVersion: 'v1',
          kind: 'Component',
          metadata: { name: 'my-component', namespace: 'my-namespace' },
          spec: { type: 'service', lifecycle: 'production' },
        },
      ],
    });

    await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntityRelationCard
            title="Has components"
            relationType={RELATION_HAS_PART}
            entityKind="Component"
            columnConfig={entityColumnPresets.component.columns}
          />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('Has components')).toBeInTheDocument();
    expect(await screen.findByText(/my-component/)).toBeInTheDocument();
  });

  it('shows error state when loading fails', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: { name: 'my-system', namespace: 'my-namespace' },
      relations: [
        {
          targetRef: 'component:my-namespace/my-component',
          type: RELATION_HAS_PART,
        },
      ],
    };
    catalogApi.getEntitiesByRefs.mockRejectedValue(
      new Error('Request failed with 500'),
    );

    await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntityRelationCard
            title="Has components"
            relationType={RELATION_HAS_PART}
            entityKind="Component"
            columnConfig={entityColumnPresets.component.columns}
          />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('Has components')).toBeInTheDocument();
    expect(
      await screen.findByText(/Request failed with 500/),
    ).toBeInTheDocument();
  });
});
