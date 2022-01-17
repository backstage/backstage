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

import { CatalogApi } from '@backstage/catalog-client';
import {
  ComponentEntity,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  UserEntity,
} from '@backstage/catalog-model';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { catalogApiRef } from '../api';
import {
  loadCatalogOwnerRefs,
  loadIdentityOwnerRefs,
  useEntityOwnership,
} from './useEntityOwnership';

describe('useEntityOwnership', () => {
  type MockIdentityApi = jest.Mocked<Pick<IdentityApi, 'getBackstageIdentity'>>;
  type MockCatalogApi = jest.Mocked<Pick<CatalogApi, 'getEntityByName'>>;

  const mockIdentityApi: MockIdentityApi = {
    getBackstageIdentity: jest.fn(),
  };
  const mockCatalogApi: MockCatalogApi = {
    getEntityByName: jest.fn(),
  };

  const identityApi = mockIdentityApi as unknown as IdentityApi;
  const catalogApi = mockCatalogApi as unknown as CatalogApi;

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <TestApiProvider
      apis={[
        [identityApiRef, identityApi],
        [catalogApiRef, catalogApi],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  const ownedEntity: ComponentEntity = {
    apiVersion: 'backstage.io/v1beta1',
    kind: 'Component',
    metadata: {
      name: 'component1',
      namespace: 'default',
    },
    spec: {
      /* should not be accessed */
    } as any,
    relations: [
      {
        type: RELATION_OWNED_BY,
        target: { kind: 'User', namespace: 'default', name: 'user1' },
      },
      {
        type: RELATION_OWNED_BY,
        target: { kind: 'Group', namespace: 'default', name: 'group1' },
      },
    ],
  };

  const user2Entity: UserEntity = {
    apiVersion: 'backstage.io/v1beta1',
    kind: 'User',
    metadata: {
      name: 'user2',
      namespace: 'default',
    },
    spec: {
      /* should not be accessed */
    } as any,
    relations: [
      {
        type: RELATION_MEMBER_OF,
        target: { kind: 'Group', namespace: 'default', name: 'group1' },
      },
    ],
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('loadIdentityOwnerRefs', () => {
    it('passes through the ownershipEntityRefs', async () => {
      const refs = new Array<string>();
      mockIdentityApi.getBackstageIdentity.mockResolvedValueOnce({
        type: 'user',
        userEntityRef: 'user:default/guest',
        ownershipEntityRefs: refs,
      });
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toBe(refs);
    });
  });

  describe('loadCatalogOwnerRefs', () => {
    it('loads the first user from the catalog', async () => {
      mockCatalogApi.getEntityByName.mockResolvedValueOnce(user2Entity);
      await expect(
        loadCatalogOwnerRefs(catalogApi, ['user:default/user2']),
      ).resolves.toEqual(['group:default/group1']);
      expect(mockCatalogApi.getEntityByName).toBeCalledWith({
        kind: 'user',
        namespace: 'default',
        name: 'user2',
      });
    });

    it('gracefully handles missing user', async () => {
      mockCatalogApi.getEntityByName.mockResolvedValueOnce(undefined);
      await expect(
        loadCatalogOwnerRefs(catalogApi, ['user:default/user2']),
      ).resolves.toEqual([]);
      expect(mockCatalogApi.getEntityByName).toBeCalledWith({
        kind: 'user',
        namespace: 'default',
        name: 'user2',
      });
    });
  });

  describe('useEntityOwnership', () => {
    it('matches ownership via ownership entity refs', async () => {
      mockIdentityApi.getBackstageIdentity.mockResolvedValue({
        type: 'user',
        userEntityRef: 'user:default/user1',
        ownershipEntityRefs: ['user:default/user1', 'group:default/group1'],
      });
      mockCatalogApi.getEntityByName.mockResolvedValue(undefined);

      const { result, waitForValueToChange } = renderHook(
        () => useEntityOwnership(),
        {
          wrapper: Wrapper,
        },
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.isOwnedEntity(ownedEntity)).toBe(false);

      await waitForValueToChange(() => result.current.loading);

      expect(result.current.loading).toBe(false);
      expect(result.current.isOwnedEntity(ownedEntity)).toBe(true);
    });
  });
});
