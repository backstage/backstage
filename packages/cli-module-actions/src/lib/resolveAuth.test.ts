/*
 * Copyright 2025 The Backstage Authors
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

import { resolveAuth } from './resolveAuth';
import {
  getSelectedInstance,
  getInstanceConfig,
  accessTokenNeedsRefresh,
  refreshAccessToken,
  getSecretStore,
  type StoredInstance,
} from '@backstage/cli-module-auth';

jest.mock('@backstage/cli-module-auth', () => ({
  getSelectedInstance: jest.fn(),
  getInstanceConfig: jest.fn(),
  accessTokenNeedsRefresh: jest.fn(),
  refreshAccessToken: jest.fn(),
  getSecretStore: jest.fn(),
}));

const mockGetSelectedInstance = getSelectedInstance as jest.MockedFunction<
  typeof getSelectedInstance
>;
const mockGetInstanceConfig = getInstanceConfig as jest.MockedFunction<
  typeof getInstanceConfig
>;
const mockAccessTokenNeedsRefresh =
  accessTokenNeedsRefresh as jest.MockedFunction<
    typeof accessTokenNeedsRefresh
  >;
const mockRefreshAccessToken = refreshAccessToken as jest.MockedFunction<
  typeof refreshAccessToken
>;
const mockGetSecretStore = getSecretStore as jest.MockedFunction<
  typeof getSecretStore
>;

describe('resolveAuth', () => {
  const mockInstance: StoredInstance = {
    name: 'production',
    baseUrl: 'https://backstage.example.com',
    clientId: 'my-client',
    issuedAt: Date.now(),
    accessTokenExpiresAt: Date.now() + 3600_000,
  };

  const mockSecretStore = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSelectedInstance.mockResolvedValue(mockInstance);
    mockAccessTokenNeedsRefresh.mockReturnValue(false);
    mockGetSecretStore.mockResolvedValue(mockSecretStore);
    mockSecretStore.get.mockResolvedValue('test-access-token');
    mockGetInstanceConfig.mockResolvedValue(['catalog', 'scaffolder']);
  });

  it('resolves auth with the selected instance and stored token', async () => {
    const result = await resolveAuth();

    expect(mockGetSelectedInstance).toHaveBeenCalledWith(undefined);
    expect(mockAccessTokenNeedsRefresh).toHaveBeenCalledWith(mockInstance);
    expect(mockRefreshAccessToken).not.toHaveBeenCalled();
    expect(result).toEqual({
      instance: mockInstance,
      accessToken: 'test-access-token',
      pluginSources: ['catalog', 'scaffolder'],
    });
  });

  it('passes instance name flag to getSelectedInstance', async () => {
    await resolveAuth('staging');

    expect(mockGetSelectedInstance).toHaveBeenCalledWith('staging');
  });

  it('refreshes the access token when it is about to expire', async () => {
    const refreshedInstance = {
      ...mockInstance,
      accessTokenExpiresAt: Date.now() + 7200_000,
    };
    mockAccessTokenNeedsRefresh.mockReturnValue(true);
    mockRefreshAccessToken.mockResolvedValue(refreshedInstance);

    const result = await resolveAuth();

    expect(mockRefreshAccessToken).toHaveBeenCalledWith('production');
    expect(result.instance).toBe(refreshedInstance);
  });

  it('throws when no access token is stored', async () => {
    mockSecretStore.get.mockResolvedValue(undefined);

    await expect(resolveAuth()).rejects.toThrow(
      'No access token found. Run "auth login" to authenticate.',
    );
  });

  it('returns empty plugin sources when none are configured', async () => {
    mockGetInstanceConfig.mockResolvedValue(undefined);

    const result = await resolveAuth();

    expect(result.pluginSources).toEqual([]);
  });
});
