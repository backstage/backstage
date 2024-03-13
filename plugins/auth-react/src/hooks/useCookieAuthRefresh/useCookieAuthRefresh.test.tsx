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
import { fetchApiRef, discoveryApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
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

  type Listener = (event: { data: any }) => void;

  let listeners: Listener[];
  let channelMock: any;

  beforeEach(() => {
    jest.useFakeTimers({ now });
    jest.clearAllMocks();
    listeners = [];
    channelMock = {
      postMessage: jest.fn((message: any) => {
        listeners.forEach(listener => listener({ data: message }));
      }),
      addEventListener: jest.fn((event: string, listener: Listener) => {
        if (event === 'message') {
          listeners.push(listener);
        }
      }),
      removeEventListener: jest.fn((event: string, listener: Listener) => {
        if (event === 'message') {
          listeners = listeners.filter(l => l !== listener);
        }
      }),
    };
    global.BroadcastChannel = jest.fn().mockImplementation(() => channelMock);
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
              [discoveryApiRef, discoveryApiMock],
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      },
    );

    expect(result.current.state.status).toBe('loading');
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

    await waitFor(() => expect(result.current.state.status).toBe('error'));

    expect(result.current.state.error).toStrictEqual(error);
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
        'http://localhost:7000/techdocs/api/cookie',
        { credentials: 'include' },
      ),
    );

    expect(result.current.state.result).toMatchObject({ expiresAt });
  });

  it('should send a message to other tabs when the cookie is refreshed', async () => {
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

    expect(global.BroadcastChannel).toHaveBeenCalledWith(
      'techdocs-auth-cookie-channel',
    );

    await waitFor(() =>
      expect(channelMock.postMessage).toHaveBeenCalledTimes(1),
    );

    // posting the message to other tabs when the cookie is requested in the first time
    await waitFor(() =>
      expect(channelMock.postMessage).toHaveBeenCalledWith({
        action: 'COOKIE_REFRESHED',
        payload: { expiresAt },
      }),
    );
  });

  it('should cancel the refresh when a message is received from another tab', async () => {
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

    await waitFor(() =>
      expect(channelMock.addEventListener).toHaveBeenCalledTimes(1),
    );

    const twentyMinutesFromNowInMilliseconds =
      now + 2 * tenMinutesInMilliseconds;

    // simulating other tab refreshing the cookie
    channelMock.postMessage({
      action: 'COOKIE_REFRESHED',
      payload: {
        expiresAt: new Date(twentyMinutesFromNowInMilliseconds).toISOString(),
      },
    });

    // advance the timers in 10 minutes to match the old expires at
    jest.advanceTimersByTime(tenMinutesInMilliseconds);

    // should not call the api
    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1);

    // advance the timers in more 10 minutes to match the new expires at
    jest.advanceTimersByTime(tenMinutesInMilliseconds);

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

    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1));

    expect(result.current.state.result).toMatchObject({ expiresAt });

    unmount();

    expect(channelMock.removeEventListener).toHaveBeenCalledTimes(1);
    expect(channelMock.removeEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    );

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
    jest.advanceTimersByTime(tenMinutesInMilliseconds);

    // should call the api
    await waitFor(() => expect(fetchApiMock.fetch).toHaveBeenCalledTimes(2));
  });
});
