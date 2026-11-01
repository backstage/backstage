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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';

import { PendingEntities } from './PendingEntities';
import { catalogUnprocessedEntitiesApiRef } from '../api';
import {
  CatalogUnprocessedEntitiesApi,
  UnprocessedEntity,
} from '@backstage/plugin-catalog-unprocessed-entities-common';

const makeEntity = (
  overrides: Partial<UnprocessedEntity> = {},
): UnprocessedEntity => ({
  entity_id: 'id-alpha',
  entity_ref: 'component:default/alpha',
  unprocessed_entity: {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'alpha' },
    spec: { owner: 'team-a' },
  },
  next_update_at: '2026-09-03T08:15:08.088Z',
  last_discovery_at: '2026-09-03T08:15:08.088Z',
  ...overrides,
});

describe('PendingEntities', () => {
  let api: jest.Mocked<CatalogUnprocessedEntitiesApi>;

  const renderComponent = () =>
    renderInTestApp(
      <TestApiProvider apis={[[catalogUnprocessedEntitiesApiRef, api]]}>
        <PendingEntities />
      </TestApiProvider>,
    );

  beforeEach(() => {
    api = {
      failed: jest.fn(),
      pending: jest.fn(),
      delete: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows progress while loading and an error panel on failure', async () => {
    api.pending.mockReturnValueOnce(new Promise(() => {}));
    const { unmount } = await renderComponent();
    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    unmount();

    api.pending.mockRejectedValueOnce(new Error('something went wrong'));
    await renderComponent();
    expect(
      (await screen.findAllByText(/something went wrong/)).length,
    ).toBeGreaterThan(0);
  });

  it('renders an empty state and entity rows with an owner fallback', async () => {
    api.pending.mockResolvedValueOnce({ entities: [] });
    const { unmount } = await renderComponent();
    expect(
      await screen.findByText('No pending entities found'),
    ).toBeInTheDocument();
    unmount();

    api.pending.mockResolvedValueOnce({
      entities: [
        makeEntity(),
        makeEntity({
          entity_id: 'id-beta',
          entity_ref: 'component:default/beta',
          unprocessed_entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'API',
            metadata: { name: 'beta' },
            spec: {},
          },
        }),
      ],
    });
    await renderComponent();
    expect(
      await screen.findByText('component:default/alpha'),
    ).toBeInTheDocument();
    expect(screen.getByText('team-a')).toBeInTheDocument();
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('renders rows even when an entity_ref is null', async () => {
    // Regression guard: a null entity_ref used to crash the entityRef column's
    // search predicate (see filterEntities.test.ts). The table must still
    // render such rows. The predicate itself is unit-tested directly.
    api.pending.mockResolvedValue({
      entities: [
        makeEntity(),
        makeEntity({
          entity_id: 'id-null',
          entity_ref: null as unknown as string,
        }),
      ],
    });
    await renderComponent();

    expect(
      await screen.findByText('component:default/alpha'),
    ).toBeInTheDocument();
    // Both rows render (the null-ref row keeps the default owner).
    expect(screen.getAllByText('team-a')).toHaveLength(2);
  });
});
