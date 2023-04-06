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
  PluginEndpointDiscovery,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import type { Entity } from '@backstage/catalog-model';
import { Config, ConfigReader } from '@backstage/config';
import { createRouter } from './router';
import { BadgeBuilder } from '../lib';

describe('createRouter', () => {
  let app: express.Express;
  let badgeBuilder: jest.Mocked<BadgeBuilder>;
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
  let config: Config;
  let discovery: PluginEndpointDiscovery;

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'service',
    metadata: {
      name: 'test',
    },
  };

  const badge = {
    id: 'test-badge',
    badge: {
      label: 'test',
      message: 'badge',
    },
    url: '/...',
    markdown: '[![...](...)]',
  };

  beforeAll(async () => {
    badgeBuilder = {
      getBadges: jest.fn(),
      createBadgeJson: jest.fn(),
      createBadgeSvg: jest.fn(),
    };
    config = new ConfigReader({
      backend: {
        baseUrl: 'http://127.0.0.1',
        listen: { port: 7007 },
      },
    });
    discovery = SingleHostDiscovery.fromConfig(config);

    const router = await createRouter({
      badgeBuilder,
      catalog: catalog as Partial<CatalogApi> as CatalogApi,
      config,
      discovery,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('works', async () => {
    const router = await createRouter({
      badgeBuilder,
      catalog: catalog as Partial<CatalogApi> as CatalogApi,
      config,
      discovery,
    });
    expect(router).toBeDefined();
  });

  describe('GET /entity/:namespace/:kind/:name/badge-specs', () => {
    it('returns all badge specs for entity', async () => {
      catalog.getEntityByRef.mockResolvedValueOnce(entity);

      badgeBuilder.getBadges.mockResolvedValueOnce([{ id: badge.id }]);
      badgeBuilder.createBadgeJson.mockResolvedValueOnce(badge);

      const response = await request(app).get(
        '/entity/default/service/test/badge-specs',
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([badge]);

      expect(catalog.getEntityByRef).toHaveBeenCalledTimes(1);
      expect(catalog.getEntityByRef).toHaveBeenCalledWith(
        {
          namespace: 'default',
          kind: 'service',
          name: 'test',
        },
        { token: undefined },
      );

      expect(badgeBuilder.getBadges).toHaveBeenCalledTimes(1);
      expect(badgeBuilder.createBadgeJson).toHaveBeenCalledTimes(1);
      expect(badgeBuilder.createBadgeJson).toHaveBeenCalledWith({
        badgeInfo: { id: badge.id },
        context: {
          badgeUrl: expect.stringMatching(
            /http:\/\/127.0.0.1\/api\/badges\/entity\/default\/service\/test\/badge\/test-badge/,
          ),
          config,
          entity,
        },
      });
    });
  });

  describe('GET /entity/:namespace/:kind/:name/badge/test-badge', () => {
    it('returns badge for entity', async () => {
      catalog.getEntityByRef.mockResolvedValueOnce(entity);

      const image = '<svg>...</svg>';
      badgeBuilder.createBadgeSvg.mockResolvedValueOnce(image);

      const response = await request(app).get(
        '/entity/default/service/test/badge/test-badge',
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(Buffer.from(image));

      expect(catalog.getEntityByRef).toHaveBeenCalledTimes(1);
      expect(catalog.getEntityByRef).toHaveBeenCalledWith(
        {
          namespace: 'default',
          kind: 'service',
          name: 'test',
        },
        { token: undefined },
      );

      expect(badgeBuilder.getBadges).toHaveBeenCalledTimes(0);
      expect(badgeBuilder.createBadgeSvg).toHaveBeenCalledTimes(1);
      expect(badgeBuilder.createBadgeSvg).toHaveBeenCalledWith({
        badgeInfo: { id: badge.id },
        context: {
          badgeUrl: expect.stringMatching(
            /http:\/\/127.0.0.1\/api\/badges\/entity\/default\/service\/test\/badge\/test-badge/,
          ),
          config,
          entity,
        },
      });
    });

    it('returns badge spec for entity', async () => {
      catalog.getEntityByRef.mockResolvedValueOnce(entity);
      badgeBuilder.createBadgeJson.mockResolvedValueOnce(badge);

      const url = '/entity/default/service/test/badge/test-badge?format=json';
      const response = await request(app).get(url);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(badge);
    });
  });

  describe('Errors', () => {
    it('returns 404 for unknown entities', async () => {
      catalog.getEntityByRef.mockResolvedValue(undefined);
      async function testUrl(url: string) {
        const response = await request(app).get(url);
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
          error: {
            message: 'No service entity in default named "missing"',
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
      await testUrl('/entity/default/service/missing/badge-specs');
      await testUrl('/entity/default/service/missing/badge/test-badge');
    });
  });
});
