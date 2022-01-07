/*
 * Copyright 2022 The Backstage Authors
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

import { NotAllowedError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createConditionTransformer } from '@backstage/plugin-permission-node';
import { isEntityKind } from '../permissions/rules/isEntityKind';
import { AuthorizedEntitiesCatalog } from './AuthorizedEntitiesCatalog';

describe('AuthorizedEntitiesCatalog', () => {
  const fakeCatalog = {
    entities: jest.fn(),
    removeEntityByUid: jest.fn(),
    entityAncestry: jest.fn(),
  };
  const fakePermissionApi = {
    authorize: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('entities', () => {
    it('returns empty response on DENY', async () => {
      fakePermissionApi.authorize.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);

      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([]),
      );

      expect(
        await catalog.entities({
          authorizationToken: 'abcd',
        }),
      ).toEqual({
        entities: [],
        pageInfo: { hasNextPage: false },
      });
    });

    it('calls underlying catalog method with correct filter on CONDITIONAL', async () => {
      fakePermissionApi.authorize.mockResolvedValue([
        {
          result: AuthorizeResult.CONDITIONAL,
          conditions: { rule: 'IS_ENTITY_KIND', params: [['b']] },
        },
      ]);
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([isEntityKind]),
      );

      await catalog.entities({ authorizationToken: 'abcd' });

      expect(fakeCatalog.entities).toHaveBeenCalledWith({
        authorizationToken: 'abcd',
        filter: { key: 'kind', values: ['b'] },
      });
    });

    it('calls underlying catalog method on ALLOW', async () => {
      fakePermissionApi.authorize.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([]),
      );

      await catalog.entities({ authorizationToken: 'abcd' });

      expect(fakeCatalog.entities).toHaveBeenCalledWith({
        authorizationToken: 'abcd',
      });
    });
  });

  describe('removeEntityByUid', () => {
    it('throws error on DENY', async () => {
      fakeCatalog.entities.mockResolvedValue({
        entities: [
          { kind: 'component', namespace: 'default', name: 'my-component' },
        ],
      });
      fakePermissionApi.authorize.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([]),
      );

      await expect(() =>
        catalog.removeEntityByUid('uid', 'Bearer abcd'),
      ).rejects.toThrowError(NotAllowedError);
    });

    it('calls underlying catalog method on ALLOW', async () => {
      fakeCatalog.entities.mockResolvedValue({
        entities: [
          { kind: 'component', namespace: 'default', name: 'my-component' },
        ],
      });
      fakePermissionApi.authorize.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([]),
      );

      await catalog.removeEntityByUid('uid', 'Bearer abcd');

      expect(fakeCatalog.removeEntityByUid).toHaveBeenCalledWith('uid');
    });
  });
});
