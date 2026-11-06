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
import { Settings } from 'luxon';

import { convertTimeToLocalTimezone, FailedEntities } from './FailedEntities';
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

describe('convertTimeToLocalTimezone', () => {
  afterEach(() => {
    Settings.defaultLocale = null as unknown as string;
    Settings.defaultZone = 'system';
  });

  it('renders every database timestamp format as the same instant', () => {
    Settings.defaultLocale = 'en-GB';
    const expected = '6 Nov 2026, 15:15:08 CET';
    Settings.defaultZone = 'Europe/Paris';

    // PostgreSQL, serialized from a Date
    expect(convertTimeToLocalTimezone('2026-11-06T14:15:08.000Z')).toBe(
      expected,
    );
    expect(
      convertTimeToLocalTimezone(new Date('2026-11-06T14:15:08.000Z')),
    ).toBe(expected);
    // SQLite, which has no timezone designator but is always UTC
    expect(convertTimeToLocalTimezone('2026-11-06 14:15:08')).toBe(expected);
  });

  it('reports unparsable input as invalid', () => {
    expect(convertTimeToLocalTimezone('invalid-date-string')).toBe(
      'Invalid DateTime',
    );
    expect(convertTimeToLocalTimezone('')).toBe('Invalid DateTime');
  });

  it("follows the user's locale", () => {
    Settings.defaultZone = 'UTC';
    Settings.defaultLocale = 'en-US';
    expect(convertTimeToLocalTimezone('2026-11-06 14:15:08')).toMatch(
      /^Nov 6, 2026, 2:15:08\sPM UTC$/,
    );

    Settings.defaultLocale = 'fr-FR';
    expect(convertTimeToLocalTimezone('2026-11-06 14:15:08')).toMatch(
      /^6 nov\. 2026, 14:15:08\sUTC$/,
    );
  });
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

  it('renders an empty state and entity rows with an owner fallback', async () => {
    api.failed.mockResolvedValueOnce({ entities: [] });
    const { unmount } = await renderComponent();
    expect(
      await screen.findByText('No failed entities found'),
    ).toBeInTheDocument();
    unmount();

    api.failed.mockResolvedValueOnce({
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

  it('renders a placeholder for a null entity_ref', async () => {
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
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('filters and sorts by kind', async () => {
    const user = userEvent.setup();
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
            spec: { owner: 'team-a' },
          },
        }),
      ],
    });
    await renderComponent();

    await screen.findByText('component:default/alpha');
    await user.click(screen.getByText('Kind'));
    const rows = screen.getAllByRole('row');
    expect(
      rows.findIndex(row => row.textContent?.includes('default/beta')),
    ).toBeLessThan(
      rows.findIndex(row => row.textContent?.includes('default/alpha')),
    );

    await user.type(screen.getByPlaceholderText('Filter'), 'API');
    await waitFor(() =>
      expect(
        screen.queryByText('component:default/alpha'),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText('component:default/beta')).toBeInTheDocument();
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

  it('falls back to the entity id (never "undefined") when deleting a null-ref entity fails', async () => {
    api.failed.mockResolvedValue({
      entities: [
        makeEntity({
          entity_id: 'id-null',
          entity_ref: null as unknown as string,
        }),
      ],
    });
    api.delete.mockRejectedValue(new Error('network error'));
    await renderComponent();

    await userEvent.click(
      (
        await screen.findAllByLabelText('Delete entity unknown')
      )[0],
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete' }),
    );

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('id-null'));
    expect(toastApi.post).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Failed to delete entity id-null',
        status: 'danger',
      }),
    );
  });
});
