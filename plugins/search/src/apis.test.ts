/*
 * Copyright 2021 The Backstage Authors
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

import { MockFetchApi } from '@backstage/test-utils';
import { SearchClient } from './apis';

describe('apis', () => {
  const query = {
    term: '',
    filters: {},
    types: [],
  };

  const baseUrl = 'https://base-url.com/';
  const getBaseUrl = jest.fn().mockResolvedValue(baseUrl);

  const identityApi = {
    getCredentials: jest.fn(),
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    signOut: jest.fn(),
  };
  const json = jest.fn();
  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    json,
  });
  const fetchApi = new MockFetchApi({
    baseImplementation: mockFetch,
    injectIdentityAuth: { identityApi },
  });

  const client = new SearchClient({
    discoveryApi: { getBaseUrl },
    fetchApi,
  });

  it('Fetch is called with expected URL (including stringified Q params)', async () => {
    identityApi.getCredentials.mockResolvedValue({});
    await client.query(query);
    expect(getBaseUrl).toHaveBeenLastCalledWith('search');
    expect(mockFetch).toHaveBeenLastCalledWith(
      `${baseUrl}/query?term=`,
      undefined,
    );
  });

  it('Resolves JSON from fetch response', async () => {
    const result = { loading: false, error: '', value: {} };
    json.mockReturnValueOnce(result);
    expect(await client.query(query)).toStrictEqual(result);
  });
});
