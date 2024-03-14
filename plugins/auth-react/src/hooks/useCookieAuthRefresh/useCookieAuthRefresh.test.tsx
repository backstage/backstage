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

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import {
  fetchApiRef,
  discoveryApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { MockStorageApi, TestApiProvider } from '@backstage/test-utils';
import { useCookieAuthRefresh } from './useCookieAuthRefresh';

describe('useCookieAuthRefresh', () => {
  const discoveryApiMock = {
    getBaseUrl: jest
      .fn()
      .mockResolvedValue('http://localhost:7000/techdocs/api'),
  };

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

  const storageApiMock = MockStorageApi.create();

  beforeEach(() => {
    jest.useFakeTimers({ now });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return a loading status when the refresh is in progress', () => {
    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [
                fetchApiRef,
                {
                  fetch: jest.fn(),
                },
              ],
              [storageApiRef, storageApiMock],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    expect(result.current.loading).toBeTruthy();
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
              [storageApiRef, storageApiMock],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    await waitFor(() => expect(result.current.error).toStrictEqual(error));
  });

  it('should call the api to get the cookie and use it', async () => {
    const { result } = renderHook(
      () => useCookieAuthRefresh({ pluginId: 'techdocs' }),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [fetchApiRef, fetchApiMock],
              [storageApiRef, storageApiMock],
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
        'http://localhost:7000/techdocs/api/cookie',
        { credentials: 'include' },
      ),
    );

    expect(result.current.value).toMatchObject({ expiresAt });
  });

  it('should cancel the refresh when a message is received from another tab', async () => {
    const pluginId = 'techdocs';

    renderHook(() => useCookieAuthRefresh({ pluginId }), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [fetchApiRef, fetchApiMock],
            [storageApiRef, storageApiMock],
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
    storageApiMock
      .forBucket(`${pluginId}-auth-cookie-storage`)
      .set(
        'expiresAt',
        new Date(twentyMinutesFromNowInMilliseconds).toISOString(),
      );

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
              [storageApiRef, storageApiMock],
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1));

    expect(result.current.value).toMatchObject({ expiresAt });

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
            [storageApiRef, storageApiMock],
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
