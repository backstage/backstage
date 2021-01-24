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
import { DiscoveryApi, IdentityApi } from '@backstage/core';
import { CatalogClientWrapper } from './CatalogClientWrapper';

jest.mock('@backstage/catalog-client');
const MockedCatalogClient = CatalogClient as jest.Mock<CatalogClient>;

const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discoveryApi: DiscoveryApi = {
  async getBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
};
const identityApi: IdentityApi = {
  getUserId() {
    return 'jane-fonda';
  },
  getProfile() {
    return { email: 'jane-fonda@spotify.com' };
  },
  async getIdToken() {
    return Promise.resolve('fake-id-token');
  },
  async signOut() {
    return Promise.resolve();
  },
};

describe('CatalogClientWrapper', () => {
  let client: CatalogClientWrapper;

  beforeEach(() => {
    MockedCatalogClient.mockClear();
    client = new CatalogClientWrapper({
      client: new MockedCatalogClient({ discoveryApi }),
      identityApi,
    });
  });

  describe('getEntities', () => {
    it('injects authorization token', async () => {
      expect.assertions(2);
      await client.getEntities();
      const getEntities = MockedCatalogClient.mock.instances[0].getEntities;
      expect(getEntities).toHaveBeenCalledWith(undefined, {
        token: 'fake-id-token',
      });
      expect(getEntities).toHaveBeenCalledTimes(1);
    });
  });
});
