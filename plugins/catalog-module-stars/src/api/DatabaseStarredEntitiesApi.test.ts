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
import { DatabaseStarredEntitiesApi } from './DatabaseStarredEntitiesApi';
import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';

const mockBaseUrl = 'http://localhost:7007/api/catalog';
const mockDiscoveryApi: jest.Mocked<DiscoveryApi> = {
  getBaseUrl: jest.fn().mockResolvedValue(mockBaseUrl),
};

const mockFetch = jest.fn();
const mockFetchApi: jest.Mocked<FetchApi> = {
  fetch: mockFetch,
};

const mockIdentityApi: jest.Mocked<IdentityApi> = {
  getProfileInfo: jest.fn(),
  getBackstageIdentity: jest.fn(),
  getCredentials: jest.fn().mockResolvedValue({ token: 'fake-token' }),
  signOut: jest.fn(),
};

describe('DatabaseStarredEntitiesApi', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockDiscoveryApi.getBaseUrl.mockResolvedValue(mockBaseUrl);
    mockIdentityApi.getCredentials.mockResolvedValue({ token: 'fake-token' });
  });

  it('should initialize and fetch stars', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: ['component:default/comp1'] }),
    });

    const api = new DatabaseStarredEntitiesApi({
      discoveryApi: mockDiscoveryApi,
      fetchApi: mockFetchApi,
      identityApi: mockIdentityApi,
    });

    // Wait for the initialization promise
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(mockFetch).toHaveBeenCalledWith(`${mockBaseUrl}/starred-entities`, {
      headers: { Authorization: 'Bearer fake-token' },
    });

    const observable = api.starredEntitie$();
    const next = jest.fn();

    const sub = observable.subscribe({ next });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(next).toHaveBeenCalledWith(new Set(['component:default/comp1']));

    sub.unsubscribe();
  });

  it('should toggle a star', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const api = new DatabaseStarredEntitiesApi({
      discoveryApi: mockDiscoveryApi,
      fetchApi: mockFetchApi,
      identityApi: mockIdentityApi,
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    const next = jest.fn();
    const sub = api.starredEntitie$().subscribe({ next });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(next).toHaveBeenCalledWith(new Set());

    // Mock successful PUT
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    await api.toggleStarred('component:default/comp1');

    expect(mockFetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/starred-entities/component%3Adefault%2Fcomp1`,
      {
        method: 'PUT',
        headers: { Authorization: 'Bearer fake-token' },
      },
    );

    expect(next).toHaveBeenCalledWith(new Set(['component:default/comp1']));

    // Mock successful DELETE
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    await api.toggleStarred('component:default/comp1');

    expect(mockFetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/starred-entities/component%3Adefault%2Fcomp1`,
      {
        method: 'DELETE',
        headers: { Authorization: 'Bearer fake-token' },
      },
    );

    expect(next).toHaveBeenCalledWith(new Set([]));

    sub.unsubscribe();
  });

  it('should get star count', async () => {
    // Initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const api = new DatabaseStarredEntitiesApi({
      discoveryApi: mockDiscoveryApi,
      fetchApi: mockFetchApi,
      identityApi: mockIdentityApi,
    });

    // count fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ count: 42 }),
    });

    const count = await api.getStarCount('component:default/comp1');

    expect(count).toBe(42);
    expect(mockFetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/starred-entities/count/component%3Adefault%2Fcomp1`,
      {
        headers: { Authorization: 'Bearer fake-token' },
      },
    );
  });
});
