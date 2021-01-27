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

import { CatalogClient } from '@backstage/catalog-client';
import { CatalogIdentityClient } from './CatalogIdentityClient';

jest.mock('@backstage/catalog-client');
const MockedCatalogClient = CatalogClient as jest.Mock<CatalogClient>;

describe('CatalogIdentityClient', () => {
  const token = 'fake-id-token';

  afterEach(() => jest.resetAllMocks());

  it('passes through the correct search params', async () => {
    const client = new CatalogIdentityClient({
      catalogClient: new MockedCatalogClient(),
    });

    client.findUser({ annotations: { key: 'value' } }, { token });

    const getEntities = MockedCatalogClient.mock.instances[0].getEntities;
    expect(getEntities).toHaveBeenCalledWith(
      {
        filter: {
          kind: 'user',
          'metadata.annotations.key': 'value',
        },
      },
      { token },
    );
    expect(getEntities).toHaveBeenCalledTimes(1);
  });
});
