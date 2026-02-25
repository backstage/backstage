/*
 * Copyright 2020 The Backstage Authors
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

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ConfigReader } from '@backstage/config';
import {
  GitLabIntegration,
  replaceGitLabUrlType,
  sleep,
} from './GitLabIntegration';
import { registerMswTestHooks } from '../helpers';

// Mock pThrottle to make testing easier
jest.mock('p-throttle', () => {
  return jest.fn(() => (fn: any) => fn);
});

describe('GitLabIntegration', () => {
  it('has a working factory', () => {
    const integrations = GitLabIntegration.factory({
      config: new ConfigReader({
        integrations: {
          gitlab: [
            {
              host: 'h.com',
              token: 't',
              apiBaseUrl: 'https://h.com/api/v4',
              baseUrl: 'https://h.com',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('h.com');
    expect(integrations.list()[1].config.host).toBe('gitlab.com');
  });

  it('returns the basics', () => {
    const integration = new GitLabIntegration({ host: 'h.com' } as any);
    expect(integration.type).toBe('gitlab');
    expect(integration.title).toBe('h.com');
  });

  it('resolve edit URL', () => {
    const integration = new GitLabIntegration({
      host: 'h.com',
      apiBaseUrl: 'https://h.com/api/v4',
      baseUrl: 'https://h.com',
    });

    expect(
      integration.resolveEditUrl(
        'https://gitlab.com/my-org/my-project/-/blob/develop/README.md',
      ),
    ).toBe('https://gitlab.com/my-org/my-project/-/edit/develop/README.md');
  });

  describe('fetch strategy', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    beforeEach(() => {
      jest.clearAllTimers();
    });

    it('uses plain fetch when no throttling or retries configured', async () => {
      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
      });

      let calledUrl: string | undefined;
      worker.use(
        rest.get('https://h.com/api/v4', (req, res, ctx) => {
          calledUrl = req.url.href;
          return res(ctx.status(200));
        }),
      );

      await integration.fetch('https://h.com/api/v4');
      expect(calledUrl).toBe('https://h.com/api/v4');
    });

    it('applies retry logic when maxRetries > 0', async () => {
      let callCount = 0;
      worker.use(
        rest.get('https://h.com/api/v4', (_req, res, ctx) => {
          callCount += 1;
          if (callCount === 1) {
            return res(ctx.status(429), ctx.json({}));
          }
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        retry: {
          maxRetries: 3,
          retryStatusCodes: [429],
        },
      });
      const responsePromise = integration.fetch('https://h.com/api/v4');
      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(200);
      await jest.advanceTimersByTimeAsync(400);
      const response = await responsePromise;

      expect(response.status).toBe(200);
      expect(callCount).toBe(2);
    });

    it('does not retry when status code is not in retryStatusCodes', async () => {
      let callCount = 0;
      worker.use(
        rest.get('https://h.com/api/v4', (_req, res, ctx) => {
          callCount += 1;
          return res(ctx.status(404));
        }),
      );

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        retry: {
          maxRetries: 3,
          retryStatusCodes: [429, 500],
        },
      });

      const responsePromise = integration.fetch('https://h.com/api/v4');
      await jest.advanceTimersByTimeAsync(1000);
      const response = await responsePromise;

      expect(response.status).toBe(404);
      expect(callCount).toBe(1);
    });

    it('stops retrying after maxRetries attempts', async () => {
      let callCount = 0;
      worker.use(
        rest.get('https://h.com/api/v4', (_req, res, ctx) => {
          callCount += 1;
          return res(ctx.status(429));
        }),
      );

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        retry: {
          maxRetries: 2,
          retryStatusCodes: [429],
        },
      });

      const responsePromise = integration.fetch('https://h.com/api/v4');
      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(200);
      await jest.advanceTimersByTimeAsync(400);
      const response = await responsePromise;

      expect(response.status).toBe(429);
      expect(callCount).toBe(3); // initial + 2 retries
    });

    it('applies throttling when limitPerMinute > 0', async () => {
      const pThrottle = require('p-throttle');
      const throttleMock = jest.fn(() => (fn: any) => fn);
      pThrottle.mockReturnValue(throttleMock);

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        retry: {
          maxApiRequestsPerMinute: 60,
        },
      });

      await integration.fetch('https://h.com/api/v4');

      expect(pThrottle).toHaveBeenCalledWith({
        limit: 60,
        interval: 60_000,
      });
      expect(throttleMock).toHaveBeenCalled();
    });

    it('applies both throttling and retry when both are configured', async () => {
      const pThrottle = require('p-throttle');

      const throttleMock = jest.fn((fn: any) => fn);
      pThrottle.mockReturnValue(throttleMock);

      let callCount = 0;
      worker.use(
        rest.get('https://h.com/api/v4', (_req, res, ctx) => {
          callCount += 1;
          if (callCount === 1) {
            return res(ctx.status(429), ctx.json({}));
          }
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const integration = new GitLabIntegration({
        apiBaseUrl: 'https://h.com/api/v4',
        host: 'h.com',
        baseUrl: 'https://h.com',
        retry: {
          maxRetries: 3,
          retryStatusCodes: [429],
          maxApiRequestsPerMinute: 60,
        },
      });

      const responsePromise = integration.fetch('https://h.com/api/v4');
      await jest.advanceTimersByTimeAsync(100);
      const response = await responsePromise;

      expect(response.status).toBe(200);
      expect(pThrottle).toHaveBeenCalledWith({
        limit: 60,
        interval: 60_000,
      });
      expect(callCount).toBe(2);
    });

    it('retries based on configured status codes', async () => {
      let callCount = 0;
      worker.use(
        rest.get('https://h.com/api/v4', (_req, res, ctx) => {
          callCount += 1;
          if (callCount === 1) {
            return res(
              ctx.status(429),
              ctx.set('Retry-After', '1'),
              ctx.json({}),
            );
          }
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        retry: {
          maxRetries: 3,
          retryStatusCodes: [429],
        },
      });

      const responsePromise = integration.fetch('https://h.com/api/v4');
      await jest.advanceTimersByTimeAsync(1000);
      const response = await responsePromise;

      expect(response.status).toBe(200);
      expect(callCount).toBe(2);
    });

    it('retries multiple times for persistent failures', async () => {
      let callCount = 0;
      worker.use(
        rest.get('https://h.com/api/v4', (_req, res, ctx) => {
          callCount += 1;
          if (callCount < 3) {
            return res(ctx.status(500), ctx.json({}));
          }
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const integration = new GitLabIntegration({
        host: 'h.com',
        apiBaseUrl: 'https://h.com/api/v4',
        baseUrl: 'https://h.com',
        retry: {
          maxRetries: 3,
          retryStatusCodes: [500],
        },
      });

      const responsePromise = integration.fetch('https://h.com/api/v4');
      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(200);
      await jest.advanceTimersByTimeAsync(400);
      const response = await responsePromise;

      expect(response.status).toBe(200);
      expect(callCount).toBe(3);
    });
  });
});

describe('sleep', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('should resolve after the specified duration when not aborted', async () => {
    const duration = 1000;
    const sleepPromise = sleep(duration, null);

    // Fast-forward timers to trigger the timeout
    jest.advanceTimersByTimeAsync(duration);

    await expect(sleepPromise).resolves.toBeUndefined();
  });

  it('should resolve immediately if abortSignal is already aborted', async () => {
    const abortController = new AbortController();
    abortController.abort();

    const sleepPromise = sleep(5000, abortController.signal);

    // Should resolve immediately without needing to advance timers
    await expect(sleepPromise).resolves.toBeUndefined();
  });

  it('should resolve when aborted during wait', async () => {
    const abortController = new AbortController();
    const duration = 5000;

    const sleepPromise = sleep(duration, abortController.signal);

    // Abort the signal after starting the sleep
    abortController.abort();

    // Should resolve immediately when aborted
    await expect(sleepPromise).resolves.toBeUndefined();
  });

  it('should handle undefined abortSignal gracefully', async () => {
    const duration = 500;
    const sleepPromise = sleep(duration, undefined);

    // Fast-forward timers to trigger the timeout
    jest.advanceTimersByTimeAsync(duration);

    await expect(sleepPromise).resolves.toBeUndefined();
  });

  it('should clean up timeout when aborted', async () => {
    const abortController = new AbortController();
    const duration = 10000;

    const sleepPromise = sleep(duration, abortController.signal);

    // Check that a timer was set
    expect(jest.getTimerCount()).toBe(1);

    // Abort the signal
    abortController.abort();

    // Wait for the promise to resolve
    await sleepPromise;

    // Timer should be cleaned up
    expect(jest.getTimerCount()).toBe(0);
  });

  it('should clean up abort event listener when timeout completes', async () => {
    const abortController = new AbortController();
    const duration = 1000;

    const sleepPromise = sleep(duration, abortController.signal);

    // Fast-forward timers to complete the timeout
    jest.advanceTimersByTimeAsync(duration);

    // Wait for the promise to complete and verify it resolves properly
    await expect(sleepPromise).resolves.toBeUndefined();

    // Event listener should be cleaned up - aborting after completion should not cause issues
    abortController.abort(); // This should not affect anything since the sleep is already done

    // Verify the sleep function handled cleanup properly
    expect(jest.getTimerCount()).toBe(0);
  });
});

describe('replaceGitLabUrlType', () => {
  it('should replace with expected type', () => {
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/my-org/my-project/-/blob/develop/README.md',
        'edit',
      ),
    ).toBe('https://gitlab.com/my-org/my-project/-/edit/develop/README.md');
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/webmodules/blob/-/blob/develop/test',
        'tree',
      ),
    ).toBe('https://gitlab.com/webmodules/blob/-/tree/develop/test');
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/blob/blob/-/blob/develop/test',
        'tree',
      ),
    ).toBe('https://gitlab.com/blob/blob/-/tree/develop/test');
    expect(
      replaceGitLabUrlType(
        'https://gitlab.com/blob/blob/-/edit/develop/README.md',
        'tree',
      ),
    ).toBe('https://gitlab.com/blob/blob/-/tree/develop/README.md');
  });
});
