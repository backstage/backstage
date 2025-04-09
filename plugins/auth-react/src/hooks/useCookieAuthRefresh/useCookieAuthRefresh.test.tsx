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

import { renderHook, waitFor } from '@testing-library/react';
import { fetchApiRef, discoveryApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider, mockApis } from '@backstage/test-utils';
import { useCookieAuthRefresh } from './useCookieAuthRefresh';

describe('useCookieAuthRefresh', () => {
  const discoveryApiMock = mockApis.discovery();

  const now = 1710316886171;
  const tenMinutesInMilliseconds = 10 * 60 * 1000;
  const tenMinutesFromNowInMilliseconds = now + tenMinutesInMilliseconds;
  const expiresAt = new Date(tenMinutesFromNowInMilliseconds).toISOString();

  const fetchApiMock = {
    fetch: jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ expiresAt }),
    }),
  };

  beforeEach(() => {
    jest.useFakeTimers({ now });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return a loading status when the refresh is in progress first time', () => {
    const error = new Error('Failed to get cookie');

    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [
                fetchApiRef,
                {
                  fetch: jest.fn().mockRejectedValue(error),
                },
              ],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    expect(result.current.status).toBe('loading');
  });

  it('should return a loading status when retrying without previous success', async () => {
    const error = new Error('Failed to get cookie');

    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [
                fetchApiRef,
                {
                  fetch: jest
                    .fn()
                    .mockRejectedValueOnce(error)
                    .mockReturnValue(new Promise(() => {})),
                },
              ],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    expect(result.current).toStrictEqual({ status: 'loading' });

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'error',
        error,
        retry: expect.any(Function),
      }),
    );

    if (result.current.status === 'error') {
      result.current.retry();
    }

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'loading',
      }),
    );
  });

  it('should return a loading status when retrying with previous success', async () => {
    const error = new Error('Failed to get cookie');

    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [
                fetchApiRef,
                {
                  fetch: jest
                    .fn()
                    .mockResolvedValueOnce({
                      ok: true,
                      json: jest.fn().mockResolvedValue({ expiresAt }),
                    })
                    .mockRejectedValueOnce(error)
                    .mockReturnValue(new Promise(() => {})),
                },
              ],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    expect(result.current).toStrictEqual({ status: 'loading' });

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'success',
        data: { expiresAt },
      }),
    );

    jest.advanceTimersByTime(tenMinutesInMilliseconds);

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'error',
        error,
        retry: expect.any(Function),
      }),
    );

    if (result.current.status === 'error') {
      result.current.retry();
    }

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'loading',
      }),
    );
  });

  it('should return an error status when the refresh has failed', async () => {
    const error = new Error('Failed to get cookie');

    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [
                fetchApiRef,
                {
                  fetch: jest.fn().mockRejectedValue(error),
                },
              ],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'error',
        error,
        retry: expect.any(Function),
      }),
    );
  });

  it('should handle 404 as disabled cookie auth', async () => {
    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [
                fetchApiRef,
                {
                  fetch: jest.fn().mockResolvedValue({
                    ok: false,
                    status: 404,
                  }),
                },
              ],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    await waitFor(() =>
      expect(result.current).toEqual({
        status: 'success',
        data: { expiresAt: expect.any(Date) },
      }),
    );
  });

  it('should call the api to get the cookie and use it', async () => {
    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [fetchApiRef, fetchApiMock],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    await waitFor(() =>
      expect(fetchApiMock.fetch).toHaveBeenCalledWith(
        'http://example.com/api/techdocs/.backstage/auth/v1/cookie',
        { credentials: 'include' },
      ),
    );

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'success',
        data: { expiresAt },
      }),
    );
  });

  it('should cancel the refresh when a message is received from another tab', async () => {
    const pluginId = 'techdocs';

    renderHook(() => useCookieAuthRefresh({ pluginId }), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [fetchApiRef, fetchApiMock],
            [discoveryApiRef, discoveryApiMock],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    const twentyMinutesFromNowInMilliseconds =
      now + 2 * tenMinutesInMilliseconds;

    // simulating other tab refreshing the cookie
    new global.BroadcastChannel(
      `${pluginId}-auth-cookie-expires-at`,
    ).postMessage({
      action: 'COOKIE_REFRESH_SUCCESS',
      payload: {
        expiresAt: new Date(twentyMinutesFromNowInMilliseconds).toISOString(),
      },
    });

    // advance the timers in 10 minutes to match the old expires at
    jest.advanceTimersByTime(tenMinutesInMilliseconds);

    // should not call the api
    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1));

    // advance the timers in more 10 minutes to match the new expires at
    jest.advanceTimersByTime(tenMinutesInMilliseconds - 1000);

    // should call the api
    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(2));
  });

  it('should cancel the refresh when the component is unmounted', async () => {
    const { result, unmount } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [fetchApiRef, fetchApiMock],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        status: 'success',
        data: { expiresAt },
      }),
    );

    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1));

    unmount();

    // advance the timers to ensure that the refresh is not called
    jest.advanceTimersByTime(tenMinutesInMilliseconds);

    // should not call the api after unmount
    await waitFor(() =>
      expect(fetchApiMock.fetch).not.toHaveBeenCalledTimes(2),
    );
  });

  it('should refresh the cookie when it is about to expire', async () => {
    renderHook(() => useCookieAuthRefresh({ pluginId: 'techdocs' }), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [fetchApiRef, fetchApiMock],
            [discoveryApiRef, discoveryApiMock],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1));

    // advance the timers to the expiration date
    jest.advanceTimersByTime(tenMinutesInMilliseconds - 1000);

    // should call the api
    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(2));
  });
});
