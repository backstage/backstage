/*
 * Copyright 2020 Spotify AB
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

import { CatalogClient } from './CatalogClient';
import mockFetch from 'jest-fetch-mock';

describe('CatalogClient', () => {
  it('builds entity search filters properly', async () => {
    mockFetch.mockResponse('[]');
    const client = new CatalogClient({ apiOrigin: '', basePath: '' });
    const entities = await client.getEntities({
      a: '1',
      b: ['2', '3'],
      ö: '=',
    });
    expect(entities).toEqual([]);
    expect(mockFetch).toBeCalledWith('/entities?a=1&b=2&b=3&%C3%B6=%3D');
  });
});
