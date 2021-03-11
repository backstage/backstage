/*
 * Copyright 2021 Spotify AB
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
import { CatalogApi } from '@backstage/catalog-client';
import type { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { createRouter } from './router';
import { BadgeBuilder } from '../lib';

describe('createRouter', () => {
  let app: express.Express;
  let badgeBuilder: jest.Mocked<BadgeBuilder>;
  let catalog: jest.Mocked<CatalogApi>;
  let config: jest.Mocked<Config>;

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'service',
    metadata: {
      name: 'test',
    },
  };

  const badge = {
    id: 'test-badge',
    badge: { label: 'test badge' },
    url: '/...',
    markdown: '[![...](...)]',
  };

  beforeAll(async () => {
    badgeBuilder = {
      createBadge: jest.fn(),
      getBadgeIds: jest.fn(),
    };
    catalog = {
      addLocation: jest.fn(),
      getEntities: jest.fn(),
      getEntityByName: jest.fn(),
      getLocationByEntity: jest.fn(),
      getLocationById: jest.fn(),
      removeEntityByUid: jest.fn(),
    };
    config = {
      get: jest.fn(),
      getBoolean: jest.fn(),
      getConfig: jest.fn(),
      getConfigArray: jest.fn(),
      getNumber: jest.fn(),
      getOptional: jest.fn(),
      getOptionalBoolean: jest.fn(),
      getOptionalConfig: jest.fn(),
      getOptionalConfigArray: jest.fn(),
      getOptionalNumber: jest.fn(),
      getOptionalString: jest.fn(),
      getOptionalStringArray: jest.fn(),
      getString: jest.fn(),
      getStringArray: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
    };
    const router = await createRouter({ badgeBuilder, catalog, config });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('works', async () => {
    const router = await createRouter({ badgeBuilder, catalog, config });
    expect(router).toBeDefined();
  });

  describe('GET /entity/:namespace/:kind/:name/badge-specs', () => {
    it('returns all badge specs for entity', async () => {
      catalog.getEntityByName.mockResolvedValueOnce(entity);

      badgeBuilder.getBadgeIds.mockResolvedValueOnce([badge.id]);
      badgeBuilder.createBadge.mockResolvedValueOnce(
        JSON.stringify(badge, null, 2),
      );

      const response = await request(app).get(
        '/entity/default/service/test/badge-specs',
      );

      expect(response.status).toEqual(200);
      expect(response.text).toEqual(`[${JSON.stringify(badge, null, 2)}]`);

      expect(catalog.getEntityByName).toHaveBeenCalledTimes(1);
      expect(catalog.getEntityByName).toHaveBeenCalledWith({
        namespace: 'default',
        kind: 'service',
        name: 'test',
      });

      expect(badgeBuilder.getBadgeIds).toHaveBeenCalledTimes(1);
      expect(badgeBuilder.createBadge).toHaveBeenCalledTimes(1);
      expect(badgeBuilder.createBadge).toHaveBeenCalledWith({
        badgeId: badge.id,
        context: {
          badgeUrl: expect.stringMatching(
            /http:\/\/127.0.0.1:\d+\/entity\/default\/service\/test\/test-badge/,
          ),
          config,
          entity,
        },
        format: 'json',
      });
    });
  });

  describe('GET /entity/:namespace/:kind/:name/test-badge', () => {
    it('returns badge for entity', async () => {
      catalog.getEntityByName.mockResolvedValueOnce(entity);

      const image = '<svg>...</svg>';
      badgeBuilder.createBadge.mockResolvedValueOnce(image);

      const response = await request(app).get(
        '/entity/default/service/test/test-badge',
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(Buffer.from(image));

      expect(catalog.getEntityByName).toHaveBeenCalledTimes(1);
      expect(catalog.getEntityByName).toHaveBeenCalledWith({
        namespace: 'default',
        kind: 'service',
        name: 'test',
      });

      expect(badgeBuilder.getBadgeIds).toHaveBeenCalledTimes(0);
      expect(badgeBuilder.createBadge).toHaveBeenCalledTimes(1);
      expect(badgeBuilder.createBadge).toHaveBeenCalledWith({
        badgeId: badge.id,
        context: {
          badgeUrl: expect.stringMatching(
            /http:\/\/127.0.0.1:\d+\/entity\/default\/service\/test\/test-badge/,
          ),
          config,
          entity,
        },
        format: 'svg',
      });
    });
  });
});
