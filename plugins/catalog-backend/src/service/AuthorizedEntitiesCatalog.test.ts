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
import { CatalogPermissionRule } from '../permissions/rules';
import { AuthorizedEntitiesCatalog } from './AuthorizedEntitiesCatalog';
import { Cursor, EntityFilter, QueryEntitiesResponse } from '../catalog/types';
import { Entity } from '@backstage/catalog-model';

describe('AuthorizedEntitiesCatalog', () => {
  const fakeCatalog = {
    entities: jest.fn(),
    entitiesBatch: jest.fn(),
    removeEntityByUid: jest.fn(),
    entityAncestry: jest.fn(),
    facets: jest.fn(),
    queryEntities: jest.fn(),
    getConflictingEntities: jest.fn(),
  };
  const fakePermissionApi = {
    authorize: jest.fn(),
    authorizeConditional: jest.fn(),
  };

  const createCatalog = (...rules: CatalogPermissionRule[]) =>
    new AuthorizedEntitiesCatalog(
      fakeCatalog,
      fakePermissionApi,
      createConditionTransformer(rules),
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('entities', () => {
    it('returns empty response on DENY', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);
      const catalog = createCatalog();

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
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        {
          result: AuthorizeResult.CONDITIONAL,
          conditions: { rule: 'IS_ENTITY_KIND', params: { kinds: ['b'] } },
        },
      ]);
      const catalog = createCatalog(isEntityKind);

      await catalog.entities({ authorizationToken: 'abcd' });

      expect(fakeCatalog.entities).toHaveBeenCalledWith({
        authorizationToken: 'abcd',
        filter: { key: 'kind', values: ['b'] },
      });
    });

    it('calls underlying catalog method on ALLOW', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);
      const catalog = createCatalog();

      await catalog.entities({ authorizationToken: 'abcd' });

      expect(fakeCatalog.entities).toHaveBeenCalledWith({
        authorizationToken: 'abcd',
      });
    });
  });

  describe('entitiesBatch', () => {
    it('returns empty response on DENY', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);
      const catalog = createCatalog();

      await expect(
        catalog.entitiesBatch({
          entityRefs: ['component:default/component-a'],
          authorizationToken: 'abcd',
        }),
      ).resolves.toEqual({
        items: [null],
      });

      expect(fakeCatalog.entitiesBatch).not.toHaveBeenCalled();
    });

    it('calls underlying catalog method with correct filter on CONDITIONAL', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        {
          result: AuthorizeResult.CONDITIONAL,
          conditions: {
            rule: 'IS_ENTITY_KIND',
            params: { kinds: ['b'] },
          },
        },
      ]);
      const catalog = createCatalog(isEntityKind);

      await catalog.entitiesBatch({
        entityRefs: ['component:default/component-a'],
        authorizationToken: 'abcd',
      });

      expect(fakeCatalog.entitiesBatch).toHaveBeenCalledWith({
        entityRefs: ['component:default/component-a'],
        authorizationToken: 'abcd',
        filter: { key: 'kind', values: ['b'] },
      });
    });

    it('calls underlying catalog method on ALLOW', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);
      const catalog = createCatalog();

      await catalog.entitiesBatch({
        entityRefs: ['component:default/component-a'],
        authorizationToken: 'abcd',
      });

      expect(fakeCatalog.entitiesBatch).toHaveBeenCalledWith({
        entityRefs: ['component:default/component-a'],
        authorizationToken: 'abcd',
      });
    });
  });

  describe('queryEntities', () => {
    it('returns empty response on DENY', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);
      const catalog = createCatalog();

      await expect(
        catalog.queryEntities({
          authorizationToken: 'abcd',
          filter: { key: 'kind', values: ['b'] },
        }),
      ).resolves.toEqual({
        items: [],
        pageInfo: {},
        totalItems: 0,
      });

      expect(fakeCatalog.queryEntities).not.toHaveBeenCalled();
    });

    it('calls underlying catalog method on ALLOW', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);
      const catalog = createCatalog();

      await catalog.queryEntities({
        authorizationToken: 'abcd',
        filter: { key: 'kind', values: ['b'] },
      });

      expect(fakeCatalog.queryEntities).toHaveBeenCalledWith({
        authorizationToken: 'abcd',
        filter: { key: 'kind', values: ['b'] },
      });
    });

    it('calls underlying catalog method with correct filter on CONDITIONAL', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        {
          result: AuthorizeResult.CONDITIONAL,
          conditions: {
            rule: 'IS_ENTITY_KIND',
            params: { kinds: ['b'] },
          },
        },
      ]);

      const requestFilter: EntityFilter = { key: 'name', values: ['name'] };

      const entities = [
        {
          kind: 'component',
          namespace: 'default',
          name: 'a',
        } as unknown as Entity,
        {
          kind: 'component',
          namespace: 'default',
          name: 'b1',
        } as unknown as Entity,
      ];

      fakeCatalog.queryEntities.mockResolvedValue({
        items: entities,
        pageInfo: {
          nextCursor: {
            isPrevious: false,
            orderFieldValues: ['xxx', null],
            filter: { allOf: [{ key: 'kind', values: ['b'] }, requestFilter] },
          },
          prevCursor: {
            isPrevious: true,
            orderFieldValues: ['a', null],
            filter: { allOf: [{ key: 'kind', values: ['b'] }, requestFilter] },
          },
        },
        totalItems: 4,
      } as QueryEntitiesResponse);
      const catalog = createCatalog(isEntityKind);

      let response = await catalog.queryEntities({
        authorizationToken: 'abcd',
        filter: { key: 'name', values: ['name'] },
      });

      expect(fakeCatalog.queryEntities).toHaveBeenCalledWith({
        authorizationToken: 'abcd',
        filter: { allOf: [{ key: 'kind', values: ['b'] }, requestFilter] },
      });

      expect(response).toEqual({
        items: entities,
        totalItems: 4,
        pageInfo: {
          nextCursor: {
            isPrevious: false,
            filter: requestFilter,
            orderFieldValues: ['xxx', null],
          },
          prevCursor: {
            isPrevious: true,
            filter: requestFilter,
            orderFieldValues: ['a', null],
          },
        },
      });

      const cursor: Cursor = {
        filter: requestFilter,
        orderFields: [{ field: 'name', order: 'asc' }],
        isPrevious: false,
        orderFieldValues: ['a', null],
      };
      response = await catalog.queryEntities({
        authorizationToken: 'abcd',
        cursor,
      });

      expect(fakeCatalog.queryEntities).toHaveBeenNthCalledWith(2, {
        authorizationToken: 'abcd',
        cursor: {
          ...cursor,
          filter: { allOf: [{ key: 'kind', values: ['b'] }, requestFilter] },
        },
      });

      expect(response).toEqual({
        items: entities,
        totalItems: 4,
        pageInfo: {
          nextCursor: {
            isPrevious: false,
            filter: requestFilter,
            orderFieldValues: ['xxx', null],
          },
          prevCursor: {
            isPrevious: true,
            filter: requestFilter,
            orderFieldValues: ['a', null],
          },
        },
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
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([]),
      );

      await expect(() =>
        catalog.removeEntityByUid('uid', { authorizationToken: 'abcd' }),
      ).rejects.toThrow(NotAllowedError);
    });

    it('throws error on CONDITIONAL authorization that evaluates to 0 entities', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        {
          result: AuthorizeResult.CONDITIONAL,
          conditions: { rule: 'IS_ENTITY_KIND', params: { kinds: ['b'] } },
        },
      ]);
      fakeCatalog.entities.mockResolvedValue({ entities: [] });
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([isEntityKind]),
      );

      await expect(() =>
        catalog.removeEntityByUid('uid', { authorizationToken: 'abcd' }),
      ).rejects.toThrow(NotAllowedError);
    });

    it('calls underlying catalog method on CONDITIONAL authorization that evaluates to nonzero entities', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        {
          result: AuthorizeResult.CONDITIONAL,
          conditions: { rule: 'IS_ENTITY_KIND', params: { kinds: ['b'] } },
        },
      ]);
      fakeCatalog.entities.mockResolvedValue({
        entities: [{ kind: 'b', namespace: 'default', name: 'my-component' }],
      });
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([isEntityKind]),
      );

      await catalog.removeEntityByUid('uid', { authorizationToken: 'abcd' });

      expect(fakeCatalog.removeEntityByUid).toHaveBeenCalledWith('uid');
    });

    it('calls underlying catalog method on ALLOW', async () => {
      fakeCatalog.entities.mockResolvedValue({
        entities: [
          { kind: 'component', namespace: 'default', name: 'my-component' },
        ],
      });
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);
      const catalog = new AuthorizedEntitiesCatalog(
        fakeCatalog,
        fakePermissionApi,
        createConditionTransformer([]),
      );

      await catalog.removeEntityByUid('uid', { authorizationToken: 'abcd' });

      expect(fakeCatalog.removeEntityByUid).toHaveBeenCalledWith('uid');
    });
  });

  describe('entityAncestry', () => {
    it('throws error if denied access to root entity', async () => {
      fakePermissionApi.authorize.mockResolvedValueOnce([
        { result: AuthorizeResult.DENY },
      ]);
      const catalog = createCatalog();

      await expect(() =>
        catalog.entityAncestry('backstage:default/component', {
          authorizationToken: 'Bearer abcd',
        }),
      ).rejects.toThrow(NotAllowedError);
    });

    it('filters out unauthorized entities and their parents', async () => {
      fakePermissionApi.authorize.mockResolvedValueOnce([
        { result: AuthorizeResult.ALLOW },
      ]);
      fakePermissionApi.authorize.mockResolvedValueOnce([
        { result: AuthorizeResult.ALLOW },
        { result: AuthorizeResult.DENY },
        { result: AuthorizeResult.ALLOW },
        { result: AuthorizeResult.ALLOW },
        { result: AuthorizeResult.ALLOW },
      ]);
      fakeCatalog.entityAncestry.mockResolvedValueOnce({
        rootEntityRef: 'component:default/a',
        items: [
          {
            entity: { kind: 'component', namespace: 'default', name: 'a' },
            parentEntityRefs: ['component:default/b1', 'component:default/b2'],
          },
          {
            entity: { kind: 'component', namespace: 'default', name: 'b1' },
            parentEntityRefs: ['component:default/c'],
          },
          {
            entity: { kind: 'component', namespace: 'default', name: 'b2' },
            parentEntityRefs: [],
          },
          {
            entity: { kind: 'component', namespace: 'default', name: 'c' },
            parentEntityRefs: [],
          },
          {
            entity: { kind: 'component', namespace: 'default', name: 'd' },
            parentEntityRefs: [],
          },
        ],
      });
      const catalog = createCatalog();

      const ancestryResult = await catalog.entityAncestry(
        'backstage:default/a',
        { authorizationToken: 'Bearer abcd' },
      );

      expect(ancestryResult).toEqual({
        rootEntityRef: 'component:default/a',
        items: [
          {
            entity: { kind: 'component', namespace: 'default', name: 'a' },
            parentEntityRefs: ['component:default/b1', 'component:default/b2'],
          },
          {
            entity: { kind: 'component', namespace: 'default', name: 'b2' },
            parentEntityRefs: [],
          },
          {
            entity: { kind: 'component', namespace: 'default', name: 'd' },
            parentEntityRefs: [],
          },
        ],
      });
    });
  });

  describe('facets', () => {
    it('returns empty response on DENY', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);
      const catalog = createCatalog();

      expect(
        await catalog.facets({
          facets: ['a'],
          authorizationToken: 'abcd',
        }),
      ).toEqual({
        facets: { a: [] },
      });
    });

    it('calls underlying catalog method with correct filter on CONDITIONAL', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        {
          result: AuthorizeResult.CONDITIONAL,
          conditions: { rule: 'IS_ENTITY_KIND', params: { kinds: ['b'] } },
        },
      ]);
      const catalog = createCatalog(isEntityKind);

      await catalog.facets({ facets: ['a'], authorizationToken: 'abcd' });

      expect(fakeCatalog.facets).toHaveBeenCalledWith({
        facets: ['a'],
        authorizationToken: 'abcd',
        filter: { key: 'kind', values: ['b'] },
      });
    });

    it('calls underlying catalog method on ALLOW', async () => {
      fakePermissionApi.authorizeConditional.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);
      const catalog = createCatalog();

      await catalog.facets({ facets: ['a'], authorizationToken: 'abcd' });

      expect(fakeCatalog.facets).toHaveBeenCalledWith({
        facets: ['a'],
        authorizationToken: 'abcd',
      });
    });
  });
});
