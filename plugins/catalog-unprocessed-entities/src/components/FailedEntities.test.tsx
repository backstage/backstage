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
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FailedEntities } from './FailedEntities';
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
  location_key: 'url:http://example.com/alpha',
  ...overrides,
});

describe('FailedEntities', () => {
  const toastApi = { post: jest.fn() };
  let api: jest.Mocked<CatalogUnprocessedEntitiesApi>;

  const renderComponent = () =>
    renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogUnprocessedEntitiesApiRef, api],
          [toastApiRef, toastApi],
        ]}
      >
        <FailedEntities />
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
    api.failed.mockReturnValueOnce(new Promise(() => {}));
    const { unmount } = await renderComponent();
    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    unmount();

    api.failed.mockRejectedValueOnce(new Error('something went wrong'));
    await renderComponent();
    expect(
      (await screen.findAllByText(/something went wrong/)).length,
    ).toBeGreaterThan(0);
  });

  it('renders an empty state when there are no failed entities', async () => {
    api.failed.mockResolvedValue({ entities: [] });
    await renderComponent();
    expect(
      await screen.findByText('No failed entities found'),
    ).toBeInTheDocument();
  });

  it('renders entity rows, falling back to "unknown" for a missing owner', async () => {
    api.failed.mockResolvedValue({
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
    expect(screen.getByText('component:default/beta')).toBeInTheDocument();
    expect(screen.getByText('team-a')).toBeInTheDocument();
    // The beta entity has no owner, so it falls back to "unknown".
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('renders rows even when an entity_ref is null', async () => {
    // Regression guard: a null entity_ref used to crash the entityRef column's
    // search predicate (see filterEntities.test.ts). The table must still
    // render such rows. The predicate itself is unit-tested directly.
    api.failed.mockResolvedValue({
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

  it('deletes an entity after confirmation and reports success', async () => {
    api.failed.mockResolvedValue({ entities: [makeEntity()] });
    api.delete.mockResolvedValue();
    await renderComponent();

    await userEvent.click(
      (
        await screen.findAllByLabelText('Delete entity component:default/alpha')
      )[0],
    );
    expect(
      await screen.findByText('Are you sure you want to delete this entity?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('id-alpha'));
    expect(toastApi.post).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Entity component:default/alpha has been deleted',
        status: 'success',
      }),
    );
    // The table refetches its data after a successful deletion.
    await waitFor(() => expect(api.failed).toHaveBeenCalledTimes(2));
  });

  it('reports an error alert when the delete call fails', async () => {
    api.failed.mockResolvedValue({ entities: [makeEntity()] });
    api.delete.mockRejectedValue(new Error('network error'));
    await renderComponent();

    await userEvent.click(
      (
        await screen.findAllByLabelText('Delete entity component:default/alpha')
      )[0],
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete' }),
    );

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('id-alpha'));
    expect(toastApi.post).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Failed to delete entity component:default/alpha',
        status: 'danger',
      }),
    );
  });
});
