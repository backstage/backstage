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
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { catalogApiRef } from '../api';
import {
  loadCatalogOwnerRefs,
  loadIdentityOwnerRefs,
  useEntityOwnership,
} from './useEntityOwnership';

describe('useEntityOwnership', () => {
  type MockIdentityApi = jest.Mocked<
    Pick<IdentityApi, 'getUserId' | 'getIdToken'>
  >;
  type MockCatalogApi = jest.Mocked<Pick<CatalogApi, 'getEntityByName'>>;

  const mockIdentityApi: MockIdentityApi = {
    getUserId: jest.fn(),
    getIdToken: jest.fn(),
  };
  const mockCatalogApi: MockCatalogApi = {
    getEntityByName: jest.fn(),
  };

  const identityApi = mockIdentityApi as unknown as IdentityApi;
  const catalogApi = mockCatalogApi as unknown as CatalogApi;

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <ApiProvider
      apis={ApiRegistry.with(identityApiRef, identityApi).with(
        catalogApiRef,
        catalogApi,
      )}
    >
      {children}
    </ApiProvider>
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

  // these were generated on https://jwt.io, based off of its default example token
  // no ent at all
  const tokenNoEnt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  // "ent": []
  const tokenEmptyEnt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbnQiOltdfQ.Khyza2whczkoC4wSCLBhBaBB9-ktIkk7gpXEgQPHhtY';
  // "ent": ["user:default/user1"]
  const tokenUserEnt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbnQiOlsidXNlcjpkZWZhdWx0L3VzZXIxIl19.CMCxjwI4rj_TD3uUoBNgFjkZI23LwRTbQnSPBxzncoY';
  // "ent": ["user:default/user1", "group:default/group1"]
  const tokenUserAndGroupEnt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbnQiOlsidXNlcjpkZWZhdWx0L3VzZXIxIiwiZ3JvdXA6ZGVmYXVsdC9ncm91cDEiXX0.ZZmZrogbQKx0hnForw63ETkyAhUyeoBE8Hgloi45rdg';

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('loadIdentityOwnerRefs', () => {
    it('returns the user id when there is no relevant token info', async () => {
      mockIdentityApi.getUserId.mockReturnValueOnce('foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce(undefined);
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:default/foo',
      ]);

      mockIdentityApi.getUserId.mockReturnValueOnce('ns/foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce(undefined);
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:ns/foo',
      ]);

      mockIdentityApi.getUserId.mockReturnValueOnce('user:ns/foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce(undefined);
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:ns/foo',
      ]);

      mockIdentityApi.getUserId.mockReturnValueOnce('foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce(tokenNoEnt);
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:default/foo',
      ]);

      mockIdentityApi.getUserId.mockReturnValueOnce('foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce(tokenEmptyEnt);
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:default/foo',
      ]);
    });

    it('returns both the user id and the token parts', async () => {
      mockIdentityApi.getUserId.mockReturnValueOnce('foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce(tokenUserEnt);
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:default/foo',
        'user:default/user1',
      ]);

      mockIdentityApi.getUserId.mockReturnValueOnce('foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce(tokenUserAndGroupEnt);
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:default/foo',
        'user:default/user1',
        'group:default/group1',
      ]);
    });

    it('gracefully ignores broken token', async () => {
      mockIdentityApi.getUserId.mockReturnValueOnce('foo');
      mockIdentityApi.getIdToken.mockResolvedValueOnce('not a jwt');
      await expect(loadIdentityOwnerRefs(identityApi)).resolves.toEqual([
        'user:default/foo',
      ]);
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
    it('matches ownership via token claims', async () => {
      mockIdentityApi.getUserId.mockReturnValue('foo');
      mockIdentityApi.getIdToken.mockResolvedValue(tokenUserAndGroupEnt);
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

    it('matches ownership via catalog user entity', async () => {
      mockIdentityApi.getUserId.mockReturnValue('user2');
      mockIdentityApi.getIdToken.mockResolvedValue(undefined);
      mockCatalogApi.getEntityByName.mockResolvedValue(user2Entity);

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

      expect(mockCatalogApi.getEntityByName).toBeCalledWith({
        kind: 'user',
        namespace: 'default',
        name: 'user2',
      });
    });
  });
});
