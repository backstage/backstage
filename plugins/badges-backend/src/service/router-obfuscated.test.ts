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

import express from 'express';
import request from 'supertest';
import {
  getVoidLogger,
  PluginEndpointDiscovery,
  ServerTokenManager,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import type { Entity } from '@backstage/catalog-model';
import { Config, ConfigReader } from '@backstage/config';
import { createRouter } from './router';
import { BadgeBuilder } from '../lib';
import {
  BackstageIdentityResponse,
  IdentityApiGetIdentityRequest,
} from '@backstage/plugin-auth-node';
import { BadgesStore } from '../database/badgesStore';

describe('createRouter', () => {
  let app: express.Express;
  const badgeBuilder: jest.Mocked<BadgeBuilder> = {
    getBadges: jest.fn(),
    createBadgeJson: jest.fn(),
    createBadgeSvg: jest.fn(),
  };

  const catalog = {
    addLocation: jest.fn(),
    getEntities: jest.fn(),
    getEntityByRef: jest.fn(),
    getLocationByRef: jest.fn(),
    getLocationById: jest.fn(),
    removeLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityFacets: jest.fn(),
    validateEntity: jest.fn(),
  };
  const getIdentity = jest
    .fn()
    .mockImplementation(
      async ({
        request: _request,
      }: IdentityApiGetIdentityRequest): Promise<
        BackstageIdentityResponse | undefined
      > => {
        return {
          identity: {
            userEntityRef: 'user:default/guest',
            ownershipEntityRefs: [],
            type: 'user',
          },
          token: 'token',
        };
      },
    );

  const config: Config = new ConfigReader({
    backend: {
      baseUrl: 'http://127.0.0.1',
      listen: {
        port: 7007,
      },
      database: {
        client: 'better-sqlite3',
        connection: ':memory:',
      },
    },
    app: {
      badges: {
        obfuscate: true,
      },
    },
  });

  let discovery: PluginEndpointDiscovery;

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'test',
    },
  };

  const entities: Entity[] = [
    entity,
    {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'test-2',
      },
    },
  ];

  const badge = {
    id: 'test-badge',
    badge: {
      label: 'test',
      message: 'badge',
    },
    url: '/...',
    markdown: '[![...](...)]',
  };

  const badgeEntity = {
    name: 'test',
    namespace: 'default',
    kind: 'component',
  };

  const badgeStore: jest.Mocked<BadgesStore> = {
    addBadge: jest.fn().mockImplementation(async () => {
      return { uuid: 'uuid1' };
    }),
    getBadgeFromUuid: jest.fn().mockImplementation(async () => {
      return badgeEntity;
    }),
    getUuidFromEntityMetadata: jest
      .fn()
      .mockImplementation(async () => 'uuid1'),
  };

  beforeAll(async () => {
    discovery = SingleHostDiscovery.fromConfig(config);
    const tokenManager = ServerTokenManager.noop();
    const router = await createRouter({
      badgeBuilder,
      catalog: catalog as Partial<CatalogApi> as CatalogApi,
      config,
      discovery,
      tokenManager,
      logger: getVoidLogger(),
      identity: { getIdentity },
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('works with provided badgeStore', async () => {
    const tokenManager = ServerTokenManager.noop();
    const router = await createRouter({
      badgeBuilder,
      catalog: catalog as Partial<CatalogApi> as CatalogApi,
      config,
      discovery,
      tokenManager,
      logger: getVoidLogger(),
      identity: { getIdentity },
      badgeStore: badgeStore,
    });
    expect(router).toBeDefined();
  });

  describe('GET /entity/:namespace/:kind/:name/badge-specs', () => {
    it('does not returns all badge specs for entity', async () => {
      catalog.getEntityByRef.mockResolvedValueOnce(entity);

      badgeBuilder.getBadges.mockResolvedValueOnce([{ id: badge.id }]);
      badgeBuilder.createBadgeJson.mockResolvedValueOnce(badge);

      const response = await request(app).get(
        '/entity/default/component/test/badge-specs',
      );

      expect(response.status).toEqual(404);
    });
  });

  describe('GET /entity/:namespace/:kind/:name/badge/test-badge', () => {
    it('does not returns badge for entity', async () => {
      catalog.getEntityByRef.mockResolvedValueOnce(entity);

      const image = '<svg>...</svg>';
      badgeBuilder.createBadgeSvg.mockResolvedValueOnce(image);

      const response = await request(app).get(
        '/entity/default/component/test/badge/test-badge',
      );

      expect(response.status).toEqual(404);
    });

    it('does not returns badge spec for entity', async () => {
      catalog.getEntityByRef.mockResolvedValueOnce(entity);
      badgeBuilder.createBadgeJson.mockResolvedValueOnce(badge);

      const url = '/entity/default/component/test/badge/test-badge?format=json';
      const response = await request(app).get(url);

      expect(response.status).toEqual(404);
    });
  });

  describe('GET /entity/:namespace/:kind/:name/obfuscated', () => {
    catalog.getEntityByRef.mockResolvedValueOnce(entity);
    catalog.getEntities.mockResolvedValueOnce({ items: entities });

    it('returns obfuscated 401 if no auth', async () => {
      const obfuscatedEntity = await request(app).get(
        '/entity/default/component/test/obfuscated',
      );
      expect(obfuscatedEntity.status).toEqual(401);
    });

    it('returns obfuscated entity and badges', async () => {
      const obfuscatedEntity = await request(app)
        .get('/entity/default/component/test/obfuscated')
        .set('Authorization', 'Bearer fakeToken');
      expect(obfuscatedEntity.status).toEqual(200);
      expect(obfuscatedEntity.body.uuid).toMatch(
        new RegExp(
          '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        ),
      );

      const uuid = obfuscatedEntity.body.uuid;
      const url = `/entity/${uuid}/test-badge?format=json`;
      let response = await request(app).get(url);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(badge);

      catalog.getEntityByRef.mockResolvedValueOnce(entity);
      catalog.getEntities.mockResolvedValueOnce({ items: entities });

      const image = '<svg>...</svg>';
      badgeBuilder.createBadgeSvg.mockResolvedValueOnce(image);

      response = await request(app).get(`/entity/${uuid}/test-badge`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(Buffer.from(image));

      catalog.getEntities.mockResolvedValueOnce({ items: entities });
      catalog.getEntityByRef.mockResolvedValueOnce(entity);

      badgeBuilder.getBadges.mockResolvedValueOnce([{ id: badge.id }]);
      badgeBuilder.createBadgeJson.mockResolvedValueOnce(badge);

      response = await request(app).get(`/entity/${uuid}/badge-specs`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([badge]);

      expect(badgeBuilder.getBadges).toHaveBeenCalledTimes(1);
      expect(badgeBuilder.createBadgeJson).toHaveBeenCalledTimes(2);
    });

    describe('Errors', () => {
      it('returns 404 for unknown entity uuid', async () => {
        badgeStore.getBadgeFromUuid.mockResolvedValue(undefined);
        catalog.getEntityByRef.mockResolvedValueOnce(entity);
        catalog.getEntities.mockResolvedValueOnce({ items: entities });
        badgeBuilder.getBadges.mockResolvedValueOnce([{ id: badge.id }]);
        badgeBuilder.createBadgeJson.mockResolvedValueOnce(badge);

        async function testUrl(url: string) {
          const response = await request(app).get(url);
          expect(response.status).toEqual(404);
          expect(response.body).toEqual({
            error: {
              message: expect.any(String),
              name: 'NotFoundError',
            },
            request: {
              method: 'GET',
              url,
            },
            response: {
              statusCode: 404,
            },
          });
        }
        await testUrl(
          '/entity/3a5f91c1e66519be5394c37a8ba69cfsf3087b7c322c600e7497dc9d517353e5bed/badge-specs',
        );
        await testUrl(
          '/entity/3a5f91c1e66519be5394c37a8ba69c3087b7csfsf322c600e7497dc9d517353e5bed/test-badge',
        );
      });
    });
  });
});
