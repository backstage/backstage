/*
 * Copyright 2024 The Backstage Authors
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

import { withLogCollector } from '@backstage/test-utils';
import { startCookieAuthRefresh } from './startCookieAuthRefresh';

describe('startCookieAuthRefresh', () => {
  const discoveryApiMock = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7000/app/api'),
  };

  const tenMinutesInMilliseconds = 10 * 60 * 1000;

  const fetchApiMock = {
    fetch: jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockImplementation(async () => ({
        expiresAt: new Date(
          Date.now() + tenMinutesInMilliseconds,
        ).toISOString(),
      })),
    }),
  };

  const errorApiMock = {
    post: jest.fn(),
    error$: jest.fn(),
  };

  const mockOptions = {
    errorApi: errorApiMock,
    fetchApi: fetchApiMock,
    discoveryApi: discoveryApiMock,
  };

  beforeEach(() => {
    jest.useFakeTimers({ now: 0 });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should refresh cookie', async () => {
    const postMessage = jest.fn();
    global.BroadcastChannel = jest.fn().mockImplementation(() => ({
      postMessage,
      addEventListener() {},
      removeEventListener() {},
      close() {},
    }));

    const stop = startCookieAuthRefresh(mockOptions);

    await jest.advanceTimersByTimeAsync(0);

    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1);
    expect(fetchApiMock.fetch).toHaveBeenCalledWith(
      'http://localhost:7000/app/api/.backstage/auth/v1/cookie',
      { credentials: 'include' },
    );

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith({
      action: 'COOKIE_REFRESH_SUCCESS',
      payload: { expiresAt: new Date(tenMinutesInMilliseconds).toISOString() },
    });

    // Should never refresh within the first 5 minutes
    await jest.advanceTimersByTimeAsync(tenMinutesInMilliseconds / 2);

    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledTimes(1);

    // Should always refresh within the next 5
    await jest.advanceTimersByTimeAsync(tenMinutesInMilliseconds / 2);

    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(2);
    expect(postMessage).toHaveBeenCalledTimes(2);

    stop();
  });

  it('should bump refresh when receiving a broadcast message', async () => {
    let messageListener: undefined | ((params: any) => void) = undefined;
    global.BroadcastChannel = jest.fn().mockImplementation(() => ({
      postMessage() {},
      addEventListener: jest.fn().mockImplementation((type, listener) => {
        expect(type).toBe('message');
        messageListener = listener;
      }),
      removeEventListener() {},
      close() {},
    }));
    const stop = startCookieAuthRefresh(mockOptions);

    await jest.advanceTimersByTimeAsync(0);

    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1);
    expect(fetchApiMock.fetch).toHaveBeenCalledWith(
      'http://localhost:7000/app/api/.backstage/auth/v1/cookie',
      { credentials: 'include' },
    );

    messageListener!({
      data: {
        action: 'COOKIE_REFRESH_SUCCESS',
        payload: {
          expiresAt: new Date(tenMinutesInMilliseconds * 2).toISOString(),
        },
      },
    });

    // Usually the refresh would happen after 10 minutes, but now we need to wait 20 instead
    await jest.advanceTimersByTimeAsync(tenMinutesInMilliseconds);
    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(tenMinutesInMilliseconds);
    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(2);

    stop();
  });

  it('should ignore first error, but post the second one', async () => {
    fetchApiMock.fetch.mockRejectedValueOnce(new Error('Failed to get cookie'));

    const { error } = await withLogCollector(['error'], async () => {
      const stop = startCookieAuthRefresh(mockOptions);

      await 'a tick';

      expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1);
      expect(fetchApiMock.fetch).toHaveBeenCalledWith(
        'http://localhost:7000/app/api/.backstage/auth/v1/cookie',
        { credentials: 'include' },
      );
      expect(errorApiMock.post).toHaveBeenCalledTimes(0);

      fetchApiMock.fetch.mockRejectedValueOnce(
        new Error('Failed to get cookie again'),
      );

      // Backoff time for first error
      await jest.advanceTimersByTimeAsync(5000);

      expect(fetchApiMock.fetch).toHaveBeenCalledTimes(2);
      expect(errorApiMock.post).toHaveBeenCalledTimes(1);
      expect(errorApiMock.post).toHaveBeenCalledWith(
        new Error('Session refresh failed, see developer console for details'),
      );

      stop();
    });

    expect(error).toEqual(['Session cookie refresh failed']);
  });
});
