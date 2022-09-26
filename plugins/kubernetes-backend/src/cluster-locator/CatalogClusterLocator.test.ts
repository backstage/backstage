/*
 * Copyright 2020 The Backstage Authors
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

import '@backstage/backend-common';
import { CatalogClusterLocator } from './CatalogClusterLocator';
import { CatalogApi } from '@backstage/catalog-client';

describe('CatalogClusterLocator', () => {
  it('empty clusters returns empty cluster details', async () => {
    const mockCatalogApi = {
      getEntityByRef: jest.fn(),
      getEntities: async () => ({
        items: [
          {
            apiVersion: 'version',
            kind: 'User',
            metadata: {
              annotations: {
                'kubernetes.io/api-server': 'https://apiserver.com',
                'kubernetes.io/api-server-certificate-authority': 'caData',
                'kubernetes.io/auth-provider': 'aws',
              },
              name: 'owned',
              namespace: 'default',
            },
          },
        ],
      }),
    } as Partial<CatalogApi> as CatalogApi;

    const sut = CatalogClusterLocator.fromConfig(mockCatalogApi);

    const result = await sut.getClusters();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'owned',
      url: 'https://apiserver.com',
      caData: 'caData',
      authProvider: 'aws',
    });
  });
});
