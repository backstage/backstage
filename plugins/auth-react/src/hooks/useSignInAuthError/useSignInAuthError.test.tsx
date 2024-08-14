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
import { act, renderHook } from '@testing-library/react';
import { discoveryApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { useSignInAuthError } from './useSignInAuthError';
import { serializeError } from '@backstage/errors';

describe('useCookieAuthRefresh', () => {
  const discoveryApiMock = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7000/api/auth'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error when the cookie returns an error object', async () => {
    const errorObject = {
      name: 'TestError',
      message: 'This is a test error',
    };
    const serializedError = serializeError(errorObject);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(serializedError),
    } as unknown as Response);

    const { result } = renderHook(() => useSignInAuthError(), {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[discoveryApiRef, discoveryApiMock]]}>
          {children}
        </TestApiProvider>
      ),
    });

    await act(async () => {
      result.current.checkAuthError();
    });

    expect(discoveryApiMock.getBaseUrl).toHaveBeenCalledWith('auth');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:7000/api/auth/.backstage/error',
      {
        credentials: 'include',
      },
    );
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).name).toEqual(errorObject.name);
    expect((result.current.error as Error).message).toEqual(
      errorObject.message,
    );
  });

  it('should return undefined when the backend does not return an error object', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(undefined),
    } as unknown as Response);

    const { result } = renderHook(() => useSignInAuthError(), {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[discoveryApiRef, discoveryApiMock]]}>
          {children}
        </TestApiProvider>
      ),
    });

    await act(async () => {
      result.current.checkAuthError();
    });

    expect(discoveryApiMock.getBaseUrl).toHaveBeenCalledWith('auth');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:7000/api/auth/.backstage/error',
      {
        credentials: 'include',
      },
    );
    expect(result.current.error).toBeUndefined();
  });
});
