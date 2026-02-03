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
import { mockServices } from '@backstage/backend-test-utils';
import { TokenIssuer } from '../../identity/types';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { NotFoundError } from '@backstage/errors';
import { UserInfoDatabase } from '../../database/UserInfoDatabase';

describe('CatalogAuthResolverContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const catalog = catalogServiceMock();
  jest.spyOn(catalog, 'getEntities');

  const mockUserInfo = {
    addUserInfo: jest.fn().mockResolvedValue(undefined),
    getUserInfo: jest.fn().mockResolvedValue({
      claims: {
        sub: 'user:default/user',
        ent: ['user:default/user'],
      },
    }),
  } as unknown as jest.Mocked<UserInfoDatabase>;

  it('adds kind to filter when missing', async () => {
    const auth = mockServices.auth();
    const context = CatalogAuthResolverContext.create({
      logger: mockServices.logger.mock(),
      catalog,
      tokenIssuer: {} as TokenIssuer,
      auth,
      userInfo: mockUserInfo,
    });

    await expect(
      context.findCatalogUser({
        filter: [{}, { kind: 'group' }, { KIND: 'USER' }],
      }),
    ).rejects.toThrow(NotFoundError);
    expect(catalog.getEntities).toHaveBeenCalledWith(
      {
        filter: [{ kind: 'user' }, { kind: 'group' }, { KIND: 'USER' }],
      },
      { credentials: await auth.getOwnServiceCredentials() },
    );
  });
});
