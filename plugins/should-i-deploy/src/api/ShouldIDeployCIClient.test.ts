/*
 * Copyright 2023 The Backstage Authors
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
import { FetchApi } from '@backstage/core-plugin-api';
import { ShouldIDeployCIClient } from './ShouldIDeployCIClient';
import { ShouldIDeployCIApi } from './ShouldIDeployCIApi';

interface ExtendedFetchApi extends FetchApi {
  fetch: jest.Mock<Promise<any>>;
}

describe('ShouldIDeployCIClient', () => {
  let fetchApi: ExtendedFetchApi;
  let client: ShouldIDeployCIApi;

  beforeEach(() => {
    fetchApi = {
      fetch: jest.fn(),
    };
    client = new ShouldIDeployCIClient({ fetchApi });
  });

  it('should create an instance of ShouldIDeployCIClient', () => {
    expect(client).toBeInstanceOf(ShouldIDeployCIClient);
  });

  it('should call the API and return the response', async () => {
    const mockResponse = { some: 'data' };
    fetchApi.fetch.mockResolvedValue({
      ok: true,
      json: () => mockResponse,
    });

    const response = await client.get();

    expect(fetchApi.fetch).toHaveBeenCalledWith(
      'https://shouldideploy.today/api',
    );
    expect(response).toEqual(mockResponse);
  });

  it('should build the correct URL with timeZone', async () => {
    const mockResponse = { some: 'data' };
    fetchApi.fetch.mockResolvedValue({
      ok: true,
      json: () => mockResponse,
    });

    const timeZone = 'America/Sao_Paulo';

    await client.get(timeZone);

    expect(fetchApi.fetch).toHaveBeenCalledWith(
      `https://shouldideploy.today/api?tz=${timeZone}`,
    );
  });

  it('should handle API error and throw an error', async () => {
    let error;
    fetchApi.fetch.mockResolvedValue({
      ok: false,
    });

    try {
      await client.get();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Error to load response.');
  });
});
