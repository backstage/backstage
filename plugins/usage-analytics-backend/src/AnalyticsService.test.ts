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
import { mockServices } from '@backstage/backend-test-utils';
import { AnalyticsService } from './AnalyticsService';
import { DatabaseAnalyticsStore } from './DatabaseAnalyticsStore';

const createStore = (): jest.Mocked<
  Pick<DatabaseAnalyticsStore, 'recordEvents' | 'updatePresence'>
> => ({
  recordEvents: jest.fn(),
  updatePresence: jest.fn(),
});

describe('AnalyticsService', () => {
  it('sanitizes events and derives the user from the caller', async () => {
    const store = createStore();
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });
    const now = new Date();

    await service.recordEvents('user:default/alice', {
      sessionId: '35a52f7d-5583-42bb-951a-49f45e914c00',
      events: [
        {
          eventId: '62fbc254-d30c-46f1-a4c4-9cf73af9f197',
          occurredAt: now.toISOString(),
          action: 'navigate',
          subject: '/catalog/123?token=secret#section',
          currentPath: 'https://example.com/catalog/123?token=secret',
          previousPath: '/catalog/32c55182-3f37-43a2-b182-16ae99c28c4e',
        },
      ],
    });

    expect(store.recordEvents).toHaveBeenCalledWith([
      expect.objectContaining({
        userEntityRef: 'user:default/alice',
        currentPath: '/catalog/123',
        previousPath: '/catalog/32c55182-3f37-43a2-b182-16ae99c28c4e',
        subject: '/catalog/123',
      }),
    ]);
  });

  it('drops subjects for actions that are not allowed', async () => {
    const store = createStore();
    const service = new AnalyticsService({
      store,
      config: mockServices.rootConfig(),
    });

    await service.recordEvents('user:default/alice', {
      sessionId: '35a52f7d-5583-42bb-951a-49f45e914c00',
      events: [
        {
          eventId: '62fbc254-d30c-46f1-a4c4-9cf73af9f197',
          occurredAt: new Date().toISOString(),
          action: 'search',
          subject: 'sensitive query',
          currentPath: '/search',
        },
      ],
    });

    expect(store.recordEvents.mock.calls[0][0][0].subject).toBeUndefined();
  });

  it('rejects invalid report ranges and pagination', () => {
    const service = new AnalyticsService({
      store: createStore(),
      config: mockServices.rootConfig(),
    });
    expect(() =>
      service.parseRange('2026-01-02T00:00:00Z', '2026-01-01T00:00:00Z'),
    ).toThrow('from must be before to');
    expect(() => service.parsePaging('101', '0')).toThrow('Invalid pagination');
    expect(() =>
      service.parsePaging('25', '0', 'unknown', 'asc', ['pageViews']),
    ).toThrow('Invalid sorting');
    expect(() =>
      service.parsePaging('25', '0', 'pageViews', 'sideways', ['pageViews']),
    ).toThrow('Invalid sorting');
    expect(
      service.parsePaging('25', '50', 'pageViews', 'asc', ['pageViews']),
    ).toEqual({
      limit: 25,
      offset: 50,
      orderField: 'pageViews',
      orderDirection: 'asc',
    });
  });

  it('rejects retention settings that could delete current data', () => {
    expect(
      () =>
        new AnalyticsService({
          store: createStore(),
          config: mockServices.rootConfig({
            data: {
              usageAnalytics: { retention: { eventsDays: -1 } },
            },
          }),
        }),
    ).toThrow('usageAnalytics.retention.eventsDays must be a positive number');
  });

  it('resolves export resource defaults and valid overrides', () => {
    const defaultService = new AnalyticsService({
      store: createStore(),
      config: mockServices.rootConfig(),
    });
    expect(defaultService.exportSettings).toEqual({
      maxConcurrent: 2,
      timeoutSeconds: 300,
    });

    const configuredService = new AnalyticsService({
      store: createStore(),
      config: mockServices.rootConfig({
        data: {
          usageAnalytics: {
            export: { maxConcurrent: 4, timeoutSeconds: 600 },
          },
        },
      }),
    });
    expect(configuredService.exportSettings).toEqual({
      maxConcurrent: 4,
      timeoutSeconds: 600,
    });
  });

  it.each([0, -1, 1.5, Number.POSITIVE_INFINITY])(
    'rejects invalid export resource setting %p',
    value => {
      expect(
        () =>
          new AnalyticsService({
            store: createStore(),
            config: mockServices.rootConfig({
              data: {
                usageAnalytics: {
                  export: { maxConcurrent: value },
                },
              },
            }),
          }),
      ).toThrow(
        'usageAnalytics.export.maxConcurrent must be a positive integer',
      );
      expect(
        () =>
          new AnalyticsService({
            store: createStore(),
            config: mockServices.rootConfig({
              data: {
                usageAnalytics: {
                  export: { timeoutSeconds: value },
                },
              },
            }),
          }),
      ).toThrow(
        'usageAnalytics.export.timeoutSeconds must be a positive integer',
      );
    },
  );
});
