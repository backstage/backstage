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
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import {
  UsageAnalyticsApi,
  usageAnalyticsApiRef,
} from '../../api/UsageAnalyticsApi';
import { UsageAnalyticsPageContent } from './UsageAnalyticsPage';

const api: jest.Mocked<UsageAnalyticsApi> = {
  getOverview: jest.fn().mockResolvedValue({
    from: '2026-07-01T00:00:00.000Z',
    to: '2026-07-18T00:00:00.000Z',
    eventCount: 12,
    activeUsers: 3,
    sessions: 4,
    pageViews: 5,
  }),
  getTimeseries: jest.fn().mockResolvedValue({
    from: '2026-07-01T00:00:00.000Z',
    to: '2026-07-18T00:00:00.000Z',
    interval: 'day',
    buckets: [
      {
        start: '2026-07-02T00:00:00.000Z',
        eventCount: 2,
        activeUsers: 3,
        sessions: 4,
        pageViews: 5,
      },
      {
        start: '2026-07-01T00:00:00.000Z',
        eventCount: 10,
        activeUsers: 1,
        sessions: 1,
        pageViews: 2,
      },
    ],
  }),
  getPlugins: jest.fn().mockResolvedValue({
    items: [
      {
        pluginId: 'catalog',
        events: 7,
        uniqueUsers: 2,
        lastUsedAt: '2026-07-18T00:00:00.000Z',
      },
    ],
    total: 1,
  }),
  getEventTypes: jest.fn().mockResolvedValue({ items: [] }),
  getPresenceSummary: jest.fn().mockResolvedValue({ onlineUsers: 2 }),
  getPages: jest.fn().mockResolvedValue({
    items: [
      {
        path: '/z-page',
        pageViews: 2,
        uniqueUsers: 1,
        estimatedDurationSeconds: 59,
        lastViewedAt: '2026-07-02T00:00:00.000Z',
      },
      {
        path: '/a-page',
        pageViews: 10,
        uniqueUsers: 3,
        estimatedDurationSeconds: 61,
        lastViewedAt: '2026-07-01T00:00:00.000Z',
      },
    ],
    total: 100,
  }),
  getUsers: jest.fn(),
  getActivity: jest.fn(),
  getSessions: jest.fn(),
  getOnlineUsers: jest.fn(),
};

describe('UsageAnalyticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders aggregate and plugin reports', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [usageAnalyticsApiRef, api],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <UsageAnalyticsPageContent />
      </TestApiProvider>,
    );

    expect(await screen.findByText('catalog')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('Online now')).toBeTruthy();
  });

  it('converts the inclusive date filters to an exclusive UTC range', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[usageAnalyticsApiRef, api]]}>
        <UsageAnalyticsPageContent />
      </TestApiProvider>,
    );

    fireEvent.change(await screen.findByLabelText('From'), {
      target: { value: '2026-07-01' },
    });
    fireEvent.change(screen.getByLabelText('To'), {
      target: { value: '2026-07-18' },
    });

    await waitFor(() =>
      expect(api.getOverview).toHaveBeenLastCalledWith({
        from: '2026-07-01T00:00:00.000Z',
        to: '2026-07-19T00:00:00.000Z',
      }),
    );
  });

  it('sorts formatted table values using their underlying values', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[usageAnalyticsApiRef, api]]}>
        <UsageAnalyticsPageContent />
      </TestApiProvider>,
    );

    const table = (
      await screen.findByRole('columnheader', { name: 'Day' })
    ).closest('table')!;
    const rows = () => within(table).getAllByRole('row').slice(1);
    const cells = (row: HTMLElement) => within(row).getAllByRole('cell');

    fireEvent.click(within(table).getByText('Events'));
    expect(cells(rows()[0])[1].textContent).toBe('2');
    expect(cells(rows()[1])[1].textContent).toBe('10');

    fireEvent.click(within(table).getByText('Day'));
    expect(cells(rows()[0])[1].textContent).toBe('10');
    expect(cells(rows()[1])[1].textContent).toBe('2');
  });

  it('requests paginated page rows', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[usageAnalyticsApiRef, api]]}>
        <UsageAnalyticsPageContent />
      </TestApiProvider>,
    );

    fireEvent.click(await screen.findByRole('tab', { name: 'Pages' }));
    await screen.findByRole('columnheader', { name: 'Path' });
    expect(api.getPages).toHaveBeenLastCalledWith({
      limit: 25,
      offset: 0,
    });

    fireEvent.click(screen.getByLabelText('Next Page'));
    await waitFor(() =>
      expect(api.getPages).toHaveBeenLastCalledWith({
        limit: 25,
        offset: 25,
      }),
    );
  });

  it('preserves the row order returned by the server', async () => {
    api.getPages.mockResolvedValueOnce({
      items: [
        {
          path: '/server-first',
          pageViews: 1,
          uniqueUsers: 1,
          estimatedDurationSeconds: 1,
          lastViewedAt: '2026-07-01T00:00:00.000Z',
        },
        {
          path: '/server-second',
          pageViews: 100,
          uniqueUsers: 100,
          estimatedDurationSeconds: 100,
          lastViewedAt: '2026-07-02T00:00:00.000Z',
        },
      ],
      total: 2,
    });

    await renderInTestApp(
      <TestApiProvider apis={[[usageAnalyticsApiRef, api]]}>
        <UsageAnalyticsPageContent />
      </TestApiProvider>,
    );

    fireEvent.click(await screen.findByRole('tab', { name: 'Pages' }));
    const table = (
      await screen.findByRole('columnheader', { name: 'Path' })
    ).closest('table')!;
    const rows = within(table).getAllByRole('row').slice(1);

    expect(within(rows[0]).getAllByRole('cell')[0].textContent).toBe(
      '/server-first',
    );
    expect(within(rows[1]).getAllByRole('cell')[0].textContent).toBe(
      '/server-second',
    );
  });

  it('returns to the last available page when the total shrinks', async () => {
    api.getPages
      .mockResolvedValueOnce({ items: [], total: 26 })
      .mockResolvedValueOnce({ items: [], total: 24 })
      .mockResolvedValueOnce({ items: [], total: 24 });

    await renderInTestApp(
      <TestApiProvider apis={[[usageAnalyticsApiRef, api]]}>
        <UsageAnalyticsPageContent />
      </TestApiProvider>,
    );

    fireEvent.click(await screen.findByRole('tab', { name: 'Pages' }));
    await screen.findByRole('columnheader', { name: 'Path' });
    fireEvent.click(screen.getByLabelText('Next Page'));

    await waitFor(() =>
      expect(api.getPages).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0 }),
      ),
    );
  });

  it('loads a selected session timeline through paginated activity', async () => {
    api.getSessions.mockResolvedValue({
      items: [
        {
          sessionId: '35a52f7d-5583-42bb-951a-49f45e914c00',
          userEntityRef: 'user:default/alice',
          startedAt: '2026-07-18T00:00:00.000Z',
          lastSeenAt: '2026-07-18T00:30:00.000Z',
          durationSeconds: 1_800,
          eventCount: 30,
        },
      ],
      total: 1,
    });
    api.getActivity.mockResolvedValue({
      items: [
        {
          eventId: '62fbc254-d30c-46f1-a4c4-9cf73af9f197',
          occurredAt: '2026-07-18T00:00:00.000Z',
          userEntityRef: 'user:default/alice',
          sessionId: '35a52f7d-5583-42bb-951a-49f45e914c00',
          action: 'navigate',
          currentPath: '/catalog',
        },
      ],
      total: 30,
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [usageAnalyticsApiRef, api],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <UsageAnalyticsPageContent />
      </TestApiProvider>,
    );

    fireEvent.click(await screen.findByRole('tab', { name: 'Sessions' }));
    fireEvent.click(
      await screen.findByRole('button', {
        name: '35a52f7d-5583-42bb-951a-49f45e914c00',
      }),
    );

    expect(await screen.findByText('/catalog')).toBeTruthy();
    expect(api.getActivity).toHaveBeenLastCalledWith({
      limit: 25,
      offset: 0,
      orderField: 'occurredAt',
      orderDirection: 'asc',
      sessionId: '35a52f7d-5583-42bb-951a-49f45e914c00',
    });

    fireEvent.click(screen.getAllByLabelText('Next Page')[1]);
    await waitFor(() =>
      expect(api.getActivity).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 25 }),
      ),
    );
  });
});
