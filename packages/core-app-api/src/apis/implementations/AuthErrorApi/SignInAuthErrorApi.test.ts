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

import { DiscoveryApi } from '@backstage/core-plugin-api';
import { serializeError } from '@backstage/errors';
import { SignInAuthErrorApi } from './SignInAuthErrorApi';

describe('SignInAuthErrorApi', () => {
  const mockDiscoveryApi = {
    getBaseUrl: jest.fn(),
  } as unknown as jest.Mocked<DiscoveryApi>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an instance of SignInAuthErrorApi', async () => {
    const api = SignInAuthErrorApi.create({
      discovery: mockDiscoveryApi,
    });

    mockDiscoveryApi.getBaseUrl.mockResolvedValue(
      'http://localhost:7007/api/auth',
    );

    expect(api).toBeInstanceOf(SignInAuthErrorApi);
  });

  it('should return an error when the cookie returns an error object', async () => {
    const errorObject = {
      name: 'TestError',
      message: 'This is a test error',
    };
    const serializedError = serializeError(errorObject);
    mockDiscoveryApi.getBaseUrl.mockResolvedValue(
      'http://localhost:7000/api/auth',
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(serializedError),
    } as unknown as Response);

    const api = SignInAuthErrorApi.create({ discovery: mockDiscoveryApi });
    const error = await api.getSignInAuthError();

    expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('auth');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:7000/api/auth/.backstage/error',
      {
        credentials: 'include',
      },
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).name).toEqual(errorObject.name);
    expect((error as Error).message).toEqual(errorObject.message);
  });

  it('should return undefined when the backend does not return an error object', async () => {
    mockDiscoveryApi.getBaseUrl.mockResolvedValue(
      'http://localhost:7000/api/auth',
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(undefined),
    } as unknown as Response);

    const api = SignInAuthErrorApi.create({ discovery: mockDiscoveryApi });
    const error = await api.getSignInAuthError();

    expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('auth');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:7000/api/auth/.backstage/error',
      {
        credentials: 'include',
      },
    );
    expect(error).toBeUndefined();
  });
});
