/*
 * Copyright 2025 The Backstage Authors
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

import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { NotAllowedError } from '@backstage/errors';
import {
  catalogConditions,
  permissionRules,
} from '@backstage/plugin-catalog-backend/alpha';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createEntityPermissionFilterBuilder } from './createEntityPermissionFilterBuilder';

describe('createEntityPermissionFilterBuilder', () => {
  it('handles allow policies', async () => {
    const builder = createEntityPermissionFilterBuilder(
      mockServices.permissions({ result: AuthorizeResult.ALLOW }),
      mockServices.permissionsRegistry.mock({
        getPermissionRuleset: () => ({
          getRuleByName: jest.fn(),
        }),
      }),
    );

    await expect(builder(mockCredentials.user(), undefined)).resolves.toBe(
      undefined,
    );
    await expect(builder(mockCredentials.service(), undefined)).resolves.toBe(
      undefined,
    );
    await expect(
      builder(mockCredentials.user(), { key: 'a' }),
    ).resolves.toEqual({ key: 'a' });
  });

  it('handles deny policies', async () => {
    const builder = createEntityPermissionFilterBuilder(
      mockServices.permissions({ result: AuthorizeResult.DENY }),
      mockServices.permissionsRegistry.mock({
        getPermissionRuleset: () => ({
          getRuleByName: jest.fn(),
        }),
      }),
    );

    await expect(builder(mockCredentials.user(), undefined)).rejects.toThrow(
      NotAllowedError,
    );
    await expect(builder(mockCredentials.service(), undefined)).rejects.toThrow(
      NotAllowedError,
    );
    await expect(builder(mockCredentials.user(), { key: 'a' })).rejects.toThrow(
      NotAllowedError,
    );
  });

  it('handles conditional policies', async () => {
    const builder = createEntityPermissionFilterBuilder(
      mockServices.permissions.mock({
        authorizeConditional: async requests => {
          return requests.map(() => ({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'catalog',
            resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
            conditions: catalogConditions.isEntityOwner({ claims: ['a'] }),
          }));
        },
      }),
      mockServices.permissionsRegistry.mock({
        getPermissionRuleset: () =>
          ({ getRuleByName: () => permissionRules.isEntityOwner } as any),
      }),
    );

    await expect(builder(mockCredentials.user(), undefined)).resolves.toEqual({
      key: 'relations.ownedBy',
      values: ['a'],
    });
    await expect(
      builder(mockCredentials.service(), undefined),
    ).resolves.toEqual({ key: 'relations.ownedBy', values: ['a'] });
    await expect(
      builder(mockCredentials.user(), { key: 'a' }),
    ).resolves.toEqual({
      allOf: [{ key: 'relations.ownedBy', values: ['a'] }, { key: 'a' }],
    });
  });
});
