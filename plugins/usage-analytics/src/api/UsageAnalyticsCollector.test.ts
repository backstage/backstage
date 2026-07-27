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
import { UsageAnalyticsCollector } from './UsageAnalyticsCollector';

describe('UsageAnalyticsCollector', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
    jest.useRealTimers();
  });

  it('batches analytics events and sends presence separately', async () => {
    window.history.pushState({}, '', '/catalog?token=secret#section');
    const fetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
    const collector = new UsageAnalyticsCollector({
      discoveryApi: { getBaseUrl: jest.fn().mockResolvedValue('http://api') },
      fetchApi: { fetch },
    });
    await Promise.resolve();
    await Promise.resolve();

    collector.captureEvent({
      action: 'navigate',
      subject: '/catalog?token=secret',
      context: {
        pluginId: 'catalog',
        routeRef: 'catalog-index',
        extension: 'CatalogPage',
      },
    });
    await jest.advanceTimersByTimeAsync(5_000);

    const requests = fetch.mock.calls.map(call => [
      call[0],
      JSON.parse(call[1].body),
    ]);
    expect(requests).toEqual(
      expect.arrayContaining([
        [
          'http://api/v1/presence/heartbeat',
          expect.objectContaining({ currentPath: '/catalog' }),
        ],
        [
          'http://api/v1/events',
          expect.objectContaining({
            events: [
              expect.objectContaining({
                action: 'navigate',
                pluginId: 'catalog',
                extensionId: 'CatalogPage',
              }),
            ],
          }),
        ],
      ]),
    );
    collector.shutdown();
  });

  it('uses a separate session for each tab instance', async () => {
    const fetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
    const first = createCollector(fetch);
    const second = createCollector(fetch);
    await Promise.resolve();
    await Promise.resolve();

    const sessionIds = fetch.mock.calls.map(
      call => JSON.parse(call[1].body).sessionId,
    );
    expect(new Set(sessionIds).size).toBe(2);
    first.shutdown();
    second.shutdown();
  });

  it('does not send click subjects', async () => {
    const fetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
    const collector = createCollector(fetch);

    collector.captureEvent({
      action: 'click',
      subject: 'secret form value',
      context: {
        pluginId: 'catalog',
        routeRef: 'catalog-index',
        extension: 'CreateButton',
      },
    });
    await jest.advanceTimersByTimeAsync(5_000);

    const event = JSON.parse(eventRequests(fetch)[0][1].body).events[0];
    expect(event).not.toHaveProperty('subject');
    collector.shutdown();
  });

  it('drops a batch after a permanent client error', async () => {
    const fetch = jest
      .fn()
      .mockImplementation((url: string) =>
        Promise.resolve(
          url.endsWith('/v1/events')
            ? { ok: false, status: 400 }
            : { ok: true, status: 204 },
        ),
      );
    const collector = createCollector(fetch);

    collector.captureEvent(createEvent());
    await jest.advanceTimersByTimeAsync(65_000);

    expect(eventRequests(fetch)).toHaveLength(1);
    collector.shutdown();
  });

  it('retries server errors with bounded exponential backoff', async () => {
    const attemptTimes: number[] = [];
    const fetch = jest.fn().mockImplementation((url: string) => {
      if (url.endsWith('/v1/events')) {
        attemptTimes.push(Date.now());
        return Promise.resolve({ ok: false, status: 500 });
      }
      return Promise.resolve({ ok: true, status: 204 });
    });
    const collector = createCollector(fetch);

    collector.captureEvent(createEvent());
    await jest.advanceTimersByTimeAsync(100_000);

    expect(eventRequests(fetch)).toHaveLength(4);
    expect(attemptTimes.map(time => time - attemptTimes[0])).toEqual([
      0, 5_000, 15_000, 35_000,
    ]);
    collector.shutdown();
  });

  it('schedules queued events after a timer fires during a slow flush', async () => {
    let resolveFirstEventRequest: (response: {
      ok: boolean;
      status: number;
    }) => void = () => {};
    let eventRequestCount = 0;
    const fetch = jest.fn().mockImplementation((url: string) => {
      if (url.endsWith('/v1/events') && eventRequestCount++ === 0) {
        return new Promise(resolve => {
          resolveFirstEventRequest = resolve;
        });
      }
      return Promise.resolve({ ok: true, status: 204 });
    });
    const collector = createCollector(fetch);

    collector.captureEvent(createEvent());
    await jest.advanceTimersByTimeAsync(5_000);
    collector.captureEvent(createEvent());
    await jest.advanceTimersByTimeAsync(5_000);
    resolveFirstEventRequest({ ok: true, status: 204 });
    await Promise.resolve();
    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(5_000);

    expect(eventRequests(fetch)).toHaveLength(2);
    collector.shutdown();
  });

  it('resends an active batch with keepalive when the page is hidden', async () => {
    let resolveFirstEventRequest: (response: {
      ok: boolean;
      status: number;
    }) => void = () => {};
    let eventRequestCount = 0;
    const fetch = jest.fn().mockImplementation((url: string) => {
      if (url.endsWith('/v1/events') && eventRequestCount++ === 0) {
        return new Promise(resolve => {
          resolveFirstEventRequest = resolve;
        });
      }
      return Promise.resolve({ ok: true, status: 204 });
    });
    const collector = createCollector(fetch);

    collector.captureEvent(createEvent());
    await jest.advanceTimersByTimeAsync(5_000);
    window.dispatchEvent(new Event('pagehide'));
    await Promise.resolve();
    await Promise.resolve();

    const requests = eventRequests(fetch);
    expect(requests).toHaveLength(2);
    expect(requests[1][1].keepalive).toBe(true);
    expect(JSON.parse(requests[1][1].body).events).toEqual(
      JSON.parse(requests[0][1].body).events,
    );

    resolveFirstEventRequest({ ok: true, status: 204 });
    collector.shutdown();
  });

  it('limits the event queue to 1,000 entries', async () => {
    let resolveFirstEventRequest: (response: {
      ok: boolean;
      status: number;
    }) => void = () => {};
    let eventRequestCount = 0;
    const fetch = jest.fn().mockImplementation((url: string) => {
      if (url.endsWith('/v1/events') && eventRequestCount++ === 0) {
        return new Promise(resolve => {
          resolveFirstEventRequest = resolve;
        });
      }
      return Promise.resolve({ ok: true, status: 204 });
    });
    const collector = createCollector(fetch);

    for (let index = 0; index < 1_021; index++) {
      collector.captureEvent({
        action: 'click',
        subject: 'button',
        context: createEvent().context,
        value: index,
      });
    }
    await Promise.resolve();
    await Promise.resolve();
    resolveFirstEventRequest({ ok: true, status: 204 });
    await jest.advanceTimersByTimeAsync(60_000);

    const events = eventRequests(fetch).flatMap(
      call => JSON.parse(call[1].body).events,
    );
    expect(events).toHaveLength(1_020);
    expect(events.map(event => event.value)).not.toContain(20);
    expect(events.at(-1).value).toBe(1_020);
    collector.shutdown();
  });
});

function createCollector(fetch: jest.Mock) {
  return new UsageAnalyticsCollector({
    discoveryApi: { getBaseUrl: jest.fn().mockResolvedValue('http://api') },
    fetchApi: { fetch },
  });
}

function createEvent() {
  return {
    action: 'navigate',
    subject: '/catalog',
    context: {
      pluginId: 'catalog',
      routeRef: 'catalog-index',
      extension: 'CatalogPage',
    },
  };
}

function eventRequests(fetch: jest.Mock) {
  return fetch.mock.calls.filter(call => call[0].endsWith('/v1/events'));
}
