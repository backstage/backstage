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

import { CatalogAuthResolverContext } from './CatalogAuthResolverContext';
import { CatalogApi } from '@backstage/catalog-client';
import { mockServices } from '@backstage/backend-test-utils';
import { TokenIssuer } from '../../identity/types';
import { DiscoveryService } from '@backstage/backend-plugin-api';

describe('CatalogAuthResolverContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCatalogApi = {
    getEntities: jest.fn().mockResolvedValue({ items: [{}] }),
  } as Partial<jest.Mocked<CatalogApi>>;

  it('adds kind to filter when missing', async () => {
    const context = CatalogAuthResolverContext.create({
      logger: mockServices.logger.mock(),
      catalogApi: mockCatalogApi as CatalogApi,
      tokenIssuer: {} as TokenIssuer,
      tokenManager: mockServices.tokenManager(),
      discovery: {} as DiscoveryService,
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
    });

    await context.findCatalogUser({
      filter: [{}, { kind: 'group' }, { KIND: 'USER' }],
    });
    expect(mockCatalogApi.getEntities).toHaveBeenCalledWith(
      {
        filter: [{ kind: 'user' }, { kind: 'group' }, { KIND: 'USER' }],
      },
      { token: 'mock-service-token:{"sub":"plugin:test","target":"catalog"}' },
    );
  });
});
