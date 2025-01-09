/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import type { Location } from '@backstage/catalog-client';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import express from 'express';
import request from 'supertest';
import { Cursor, EntitiesCatalog } from '../catalog/types';
import { LocationInput, LocationService, RefreshService } from './types';
import { basicEntityFilter } from './request';
import { createRouter } from './createRouter';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  createPermissionIntegrationRouter,
  createPermissionRule,
} from '@backstage/plugin-permission-node';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';
import { CatalogProcessingOrchestrator } from '../processing/types';
import { z } from 'zod';
import { decodeCursor, encodeCursor } from './util';
import { wrapServer } from '@backstage/backend-openapi-utils';
import { Server } from 'http';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { LocationAnalyzer } from '@backstage/plugin-catalog-node';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';

const middleware = MiddlewareFactory.create({
  logger: mockServices.logger.mock(),
  config: mockServices.rootConfig(),
});

describe('createRouter readonly disabled', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationService: jest.Mocked<LocationService>;
  let orchestrator: jest.Mocked<CatalogProcessingOrchestrator>;
  let app: express.Express | Server;
  let refreshService: RefreshService;
  let locationAnalyzer: jest.Mocked<LocationAnalyzer>;
  const permissionsService = mockServices.permissions.mock();

  beforeEach(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      entitiesBatch: jest.fn(),
      removeEntityByUid: jest.fn(),
      entityAncestry: jest.fn(),
      facets: jest.fn(),
      queryEntities: jest.fn(),
    };
    locationService = {
      getLocation: jest.fn(),
      createLocation: jest.fn(),
      listLocations: jest.fn(),
      deleteLocation: jest.fn(),
      getLocationByEntity: jest.fn(),
    };
    locationAnalyzer = {
      analyzeLocation: jest.fn(),
    };
    refreshService = { refresh: jest.fn() };
    orchestrator = { process: jest.fn() };
    const router = await createRouter({
      entitiesCatalog,
      locationService,
      orchestrator,
      logger: mockServices.logger.mock(),
      refreshService,
      config: new ConfigReader(undefined),
      permissionIntegrationRouter: express.Router(),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      locationAnalyzer,
      permissionsService,
    });
    router.use(middleware.error());
    app = await wrapServer(express().use(router));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /refresh', () => {
    it('refreshes an entity using the refresh service', async () => {
      const response = await request(app)
        .post('/refresh')
        .set('Content-Type', 'application/json')
        .send({ entityRef: 'Component/default:foo' });
      expect(response.status).toBe(200);
      expect(refreshService.refresh).toHaveBeenCalledWith({
        entityRef: 'Component/default:foo',
        credentials: mockCredentials.user(),
      });
    });

    it('should support passing the token in the request body for backwards compatibility', async () => {
      const response = await request(app)
        .post('/refresh')
        .set('Content-Type', 'application/json')
        .send({
          entityRef: 'Component/default:foo',
          authorizationToken: mockCredentials.user.token('user:default/other'),
        });
      expect(response.status).toBe(200);
      expect(refreshService.refresh).toHaveBeenCalledWith({
        entityRef: 'Component/default:foo',
        credentials: mockCredentials.user('user:default/other'),
      });
    });
  });

  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: { type: 'object', entities: [entities[0]] },
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });

    it('happy path: lists entities when by-entities emulation is enabled', async () => {
      const router = await createRouter({
        entitiesCatalog,
        locationService,
        orchestrator,
        logger: mockServices.logger.mock(),
        refreshService,
        config: new ConfigReader(undefined),
        permissionIntegrationRouter: express.Router(),
        auth: mockServices.auth(),
        httpAuth: mockServices.httpAuth(),
        locationAnalyzer,
        permissionsService,
        disableRelationsCompatibility: true, // added
      });
      app = await wrapServer(express().use(router));

      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: [entities[0]] },
        pageInfo: {},
        totalItems: 1,
      });

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });

    it('parses single and multiple request parameters and passes them down', async () => {
      entitiesCatalog.entities.mockResolvedValueOnce({
        entities: { type: 'object', entities: [] },
        pageInfo: { hasNextPage: false },
      });
      const response = await request(app).get(
        '/entities?filter=a=1,a=2,b=3&filter=c=4',
      );

      expect(response.status).toEqual(200);
      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: {
          anyOf: [
            {
              allOf: [
                { key: 'a', values: ['1', '2'] },
                { key: 'b', values: ['3'] },
              ],
            },
            { key: 'c', values: ['4'] },
          ],
        },
        credentials: mockCredentials.user(),
      });
    });

    it('parses single and multiple request parameters and passes them down when by-entities emulation is enabled', async () => {
      const router = await createRouter({
        entitiesCatalog,
        locationService,
        orchestrator,
        logger: mockServices.logger.mock(),
        refreshService,
        config: new ConfigReader(undefined),
        permissionIntegrationRouter: express.Router(),
        auth: mockServices.auth(),
        httpAuth: mockServices.httpAuth(),
        locationAnalyzer,
        permissionsService,
        disableRelationsCompatibility: true, // added
      });
      app = await wrapServer(express().use(router));

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: [] },
        pageInfo: {},
        totalItems: 0,
      });
      const response = await request(app).get(
        '/entities?filter=a=1,a=2,b=3&filter=c=4',
      );

      expect(response.status).toEqual(200);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledWith({
        filter: {
          anyOf: [
            {
              allOf: [
                { key: 'a', values: ['1', '2'] },
                { key: 'b', values: ['3'] },
              ],
            },
            { key: 'c', values: ['4'] },
          ],
        },
        limit: 10000,
        credentials: mockCredentials.user(),
        skipTotalItems: true,
      });
    });
  });

  describe('GET /entities/by-query', () => {
    it('happy path: lists entities', async () => {
      const items: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: items },
        totalItems: 100,
        pageInfo: { nextCursor: mockCursor() },
      });

      const response = await request(app).get('/entities/by-query');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        items,
        totalItems: 100,
        pageInfo: {
          nextCursor: expect.any(String),
        },
      });
    });

    it('parses initial request', async () => {
      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: [] },
        pageInfo: {},
        totalItems: 0,
      });
      const response = await request(app).get(
        '/entities/by-query?filter=a=1,a=2,b=3&filter=c=4&orderField=metadata.name,asc&orderField=metadata.uid,desc',
      );

      expect(response.status).toEqual(200);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledWith({
        filter: {
          anyOf: [
            {
              allOf: [
                { key: 'a', values: ['1', '2'] },
                { key: 'b', values: ['3'] },
              ],
            },
            { key: 'c', values: ['4'] },
          ],
        },
        orderFields: [
          { field: 'metadata.name', order: 'asc' },
          { field: 'metadata.uid', order: 'desc' },
        ],
        fullTextFilter: {
          fields: undefined,
          term: '',
        },
        credentials: mockCredentials.user(),
      });
    });

    it('parses encoded params request', async () => {
      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: [] },
        pageInfo: {},
        totalItems: 0,
      });
      const response = await request(app).get(
        `/entities/by-query?filter=${encodeURIComponent(
          'a=1,a=2,b=3',
        )}&filter=c=4&orderField=${encodeURIComponent(
          'metadata.name,asc',
        )}&orderField=metadata.uid,desc`,
      );

      expect(response.status).toEqual(200);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledWith({
        filter: {
          anyOf: [
            {
              allOf: [
                { key: 'a', values: ['1', '2'] },
                { key: 'b', values: ['3'] },
              ],
            },
            { key: 'c', values: ['4'] },
          ],
        },
        orderFields: [
          { field: 'metadata.name', order: 'asc' },
          { field: 'metadata.uid', order: 'desc' },
        ],
        fullTextFilter: {
          fields: undefined,
          term: '',
        },
        credentials: mockCredentials.user(),
      });
    });

    it('parses cursor request', async () => {
      const items: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: items },
        totalItems: 100,
        pageInfo: { nextCursor: mockCursor() },
      });

      const cursor = mockCursor({ totalItems: 100, isPrevious: false });

      const response = await request(app).get(
        `/entities/by-query?cursor=${encodeCursor(cursor)}`,
      );
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledWith({
        cursor,
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        items,
        totalItems: 100,
        pageInfo: { nextCursor: expect.any(String) },
      });
    });

    it('parses cursor request with fullTextFilter', async () => {
      const items: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: items },
        totalItems: 100,
        pageInfo: {
          nextCursor: mockCursor({ fullTextFilter: { term: 'mySearch' } }),
        },
      });

      const cursor = mockCursor({
        totalItems: 100,
        isPrevious: false,
        fullTextFilter: { term: 'mySearch' },
      });

      const response = await request(app).get(
        `/entities/by-query?cursor=${encodeCursor(cursor)}`,
      );
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.queryEntities).toHaveBeenCalledWith({
        cursor,
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        items,
        totalItems: 100,
        pageInfo: { nextCursor: expect.any(String) },
      });
      const decodedCursor = decodeCursor(response.body.pageInfo.nextCursor);
      expect(decodedCursor).toMatchObject({
        isPrevious: false,
        fullTextFilter: {
          term: 'mySearch',
        },
      });
    });

    it('should throw in case of malformed cursor', async () => {
      const items: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: items },
        totalItems: 100,
        pageInfo: { nextCursor: mockCursor() },
      });

      let response = await request(app).get(
        `/entities/by-query?cursor=${Buffer.from(
          JSON.stringify({ bad: 'cursor' }),
          'utf8',
        ).toString('base64')}`,
      );
      expect(response.status).toEqual(400);
      expect(response.body.error.message).toMatch(/Malformed cursor/);

      response = await request(app).get(`/entities/by-query?cursor=badcursor`);
      expect(response.status).toEqual(400);
      expect(response.body.error.message).toMatch(/Malformed cursor/);
    });

    it('should throw in case of invalid limit', async () => {
      const items: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'object', entities: items },
        totalItems: 100,
        pageInfo: { nextCursor: mockCursor() },
      });

      const response = await request(app).get(`/entities/by-query?limit=asdf`);
      expect(response.status).toEqual(400);
      expect(response.body.error.message).toMatch(
        /request\/query\/limit must be integer/,
      );
    });
  });

  describe('GET /entities/by-uid/:uid', () => {
    it('can fetch entity by uid', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
        },
      };
      entitiesCatalog.entities.mockResolvedValue({
        entities: { type: 'object', entities: [entity] },
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-uid/zzz');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({ 'metadata.uid': 'zzz' }),
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entities.mockResolvedValue({
        entities: { type: 'object', entities: [] },
        pageInfo: { hasNextPage: false },
      });

      const response = await request(app).get('/entities/by-uid/zzz');

      expect(entitiesCatalog.entities).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith({
        filter: basicEntityFilter({ 'metadata.uid': 'zzz' }),
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/uid/);
    });
  });

  describe('GET /entities/by-name/:kind/:namespace/:name', () => {
    it('can fetch entity by name', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'k',
        metadata: {
          name: 'n',
          namespace: 'ns',
        },
      };
      entitiesCatalog.entitiesBatch.mockResolvedValue({
        items: { type: 'object', entities: [entity] },
      });

      const response = await request(app).get('/entities/by-name/k/ns/n');

      expect(entitiesCatalog.entitiesBatch).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entitiesBatch).toHaveBeenCalledWith({
        entityRefs: ['k:ns/n'],
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entitiesBatch.mockResolvedValue({
        items: { type: 'object', entities: [null] },
      });

      const response = await request(app).get('/entities/by-name/b/d/c');

      expect(entitiesCatalog.entitiesBatch).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entitiesBatch).toHaveBeenCalledWith({
        entityRefs: ['b:d/c'],
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/name/);
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    it('can remove', async () => {
      entitiesCatalog.removeEntityByUid.mockResolvedValue(undefined);

      const response = await request(app).delete('/entities/by-uid/apa');
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa', {
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(204);
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.removeEntityByUid.mockRejectedValue(
        new NotFoundError('nope'),
      );

      const response = await request(app).delete('/entities/by-uid/apa');
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa', {
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(404);
    });
  });

  describe('POST /entities/by-refs', () => {
    it.each([
      '',
      'not json',
      '[',
      '[]',
      '{}',
      '{"unknown":7}',
      '{"entityRefs":7}',
      '{"entityRefs":[7]}',
      '{"entityRefs":[7],"fields":7}',
      '{"entityRefs":[7],"fields":[7]}',
    ])('properly rejects malformed request body, %p', async p => {
      await expect(
        request(app)
          .post('/entities/by-refs')
          .set('Content-Type', 'application/json')
          .send(p),
      ).resolves.toMatchObject({ status: 400 });
    });

    it('can fetch entities by refs', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'component',
        metadata: {
          name: 'a',
        },
      };
      const entityRef = stringifyEntityRef(entity);
      entitiesCatalog.entitiesBatch.mockResolvedValue({
        items: { type: 'object', entities: [entity] },
      });
      const response = await request(app)
        .post('/entities/by-refs?filter=kind=Component')
        .set('Content-Type', 'application/json')
        .send(
          JSON.stringify({
            entityRefs: [entityRef],
            fields: ['metadata.name'],
          }),
        );
      expect(entitiesCatalog.entitiesBatch).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entitiesBatch).toHaveBeenCalledWith({
        entityRefs: [entityRef],
        fields: expect.any(Function),
        credentials: mockCredentials.user(),
        filter: { key: 'kind', values: ['Component'] },
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ items: [entity] });
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: Location[] = [
        { id: 'foo', type: 'url', target: 'example.com' },
      ];
      locationService.listLocations.mockResolvedValueOnce(locations);

      const response = await request(app).get('/locations');
      expect(locationService.listLocations).toHaveBeenCalledTimes(1);
      expect(locationService.listLocations).toHaveBeenCalledWith({
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { data: { id: 'foo', target: 'example.com', type: 'url' } },
      ]);
    });
  });

  describe('GET /locations/:id', () => {
    it('happy path: gets location by id', async () => {
      const location: Location = {
        id: 'foo',
        type: 'url',
        target: 'example.com',
      };
      locationService.getLocation.mockResolvedValueOnce(location);

      const response = await request(app).get('/locations/foo');
      expect(locationService.getLocation).toHaveBeenCalledTimes(1);
      expect(locationService.getLocation).toHaveBeenCalledWith('foo', {
        credentials: mockCredentials.user(),
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 'foo',
        target: 'example.com',
        type: 'url',
      });
    });
  });

  describe('POST /locations', () => {
    it('rejects malformed locations', async () => {
      const spec = {
        typez: 'b',
        target: 'c',
      } as unknown as LocationInput;

      const response = await request(app)
        .post('/locations')

        .send(spec);

      expect(locationService.createLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
    });

    it('passes the body down', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      locationService.createLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations')

        .send(spec);

      expect(locationService.createLocation).toHaveBeenCalledTimes(1);
      expect(locationService.createLocation).toHaveBeenCalledWith(spec, false, {
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });

    it('supports dry run', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      locationService.createLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations?dryRun=true')

        .send(spec);

      expect(locationService.createLocation).toHaveBeenCalledTimes(1);
      expect(locationService.createLocation).toHaveBeenCalledWith(spec, true, {
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });
  });

  describe('DELETE /locations', () => {
    it('deletes the location', async () => {
      locationService.deleteLocation.mockResolvedValueOnce(undefined);

      const response = await request(app).delete('/locations/foo');
      expect(locationService.deleteLocation).toHaveBeenCalledTimes(1);
      expect(locationService.deleteLocation).toHaveBeenCalledWith('foo', {
        credentials: mockCredentials.user(),
      });

      expect(response.status).toEqual(204);
    });
  });

  describe('GET /locations/by-entity/:kind/:namespace/:name', () => {
    it('happy path: gets location by entity ref', async () => {
      const location: Location = {
        id: 'foo',
        type: 'url',
        target: 'example.com',
      };
      locationService.getLocationByEntity.mockResolvedValueOnce(location);

      const response = await request(app).get('/locations/by-entity/c/ns/n');
      expect(locationService.getLocationByEntity).toHaveBeenCalledTimes(1);
      expect(locationService.getLocationByEntity).toHaveBeenCalledWith(
        { kind: 'c', namespace: 'ns', name: 'n' },
        {
          credentials: mockCredentials.user(),
        },
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 'foo',
        target: 'example.com',
        type: 'url',
      });
    });
  });

  describe('POST /validate-entity', () => {
    describe('valid entity', () => {
      it('returns 200', async () => {
        const entity: Entity = {
          apiVersion: 'a',
          kind: 'b',
          metadata: { name: 'n' },
        };

        permissionsService.authorize.mockResolvedValueOnce([
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);

        orchestrator.process.mockResolvedValueOnce({
          ok: true,
          state: {},
          completedEntity: entity,
          deferredEntities: [],
          refreshKeys: [],
          relations: [],
          errors: [],
        });

        const response = await request(app)
          .post('/validate-entity')
          .send({ entity, location: 'url:validate-entity' });

        expect(response.status).toEqual(200);
        expect(orchestrator.process).toHaveBeenCalledTimes(1);
        expect(orchestrator.process).toHaveBeenCalledWith({
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              name: 'n',
              annotations: {
                [ANNOTATION_LOCATION]: 'url:validate-entity',
                [ANNOTATION_ORIGIN_LOCATION]: 'url:validate-entity',
              },
            },
          },
        });
      });
    });

    describe('invalid entity', () => {
      it('returns 400', async () => {
        const entity: Entity = {
          apiVersion: 'a',
          kind: 'b',
          metadata: { name: 'invalid*name' },
        };

        permissionsService.authorize.mockResolvedValueOnce([
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);

        orchestrator.process.mockResolvedValueOnce({
          ok: false,
          errors: [new Error('Invalid entity name')],
        });

        const response = await request(app)
          .post('/validate-entity')
          .send({ entity, location: 'url:validate-entity' });

        expect(response.status).toEqual(400);
        expect(response.body.errors.length).toEqual(1);
        expect(response.body.errors[0].message).toEqual('Invalid entity name');
        expect(orchestrator.process).toHaveBeenCalledTimes(1);
        expect(orchestrator.process).toHaveBeenCalledWith({
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              name: 'invalid*name',
              annotations: {
                [ANNOTATION_LOCATION]: 'url:validate-entity',
                [ANNOTATION_ORIGIN_LOCATION]: 'url:validate-entity',
              },
            },
          },
        });
      });
    });

    describe('no location', () => {
      it('returns 400', async () => {
        const entity: Entity = {
          apiVersion: 'a',
          kind: 'b',
          metadata: { name: 'n' },
        };

        permissionsService.authorize.mockResolvedValueOnce([
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);

        const response = await request(app)
          .post('/validate-entity')
          .send({ entity, location: null });

        expect(response.status).toEqual(400);
        expect(response.body.errors.length).toEqual(1);
        expect(response.body.errors[0].message).toContain('Malformed request:');
        expect(orchestrator.process).toHaveBeenCalledTimes(0);
      });
    });

    describe('no entity', () => {
      it('returns 400', async () => {
        const response = await request(app)
          .post('/validate-entity')
          .send({ entity: null, location: 'url:entity' });

        expect(response.status).toEqual(400);
        expect(response.body.errors.length).toEqual(1);
        expect(response.body.errors[0].message).toContain(
          '<root> must be object - type: object',
        );
      });
    });
  });

  describe('POST /analyze-location', () => {
    it('handles invalid URLs', async () => {
      const parseUrlError = new Error();
      (parseUrlError as any).subject_url = 'not a url';
      locationAnalyzer.analyzeLocation.mockRejectedValue(parseUrlError);
      const response = await request(app)
        .post('/analyze-location')
        .send({ location: { type: 'url', target: 'not a url' } });
      expect(response.status).toEqual(400);
      expect(response.body.error.message).toMatch(
        /The given location.target is not a URL/,
      );
    });
  });
});

describe('createRouter readonly and raw json enabled', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let app: express.Express;
  let locationService: jest.Mocked<LocationService>;
  const permissionsService = mockServices.permissions.mock();

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      entitiesBatch: jest.fn(),
      removeEntityByUid: jest.fn(),
      entityAncestry: jest.fn(),
      facets: jest.fn(),
      queryEntities: jest.fn(),
    };
    locationService = {
      getLocation: jest.fn(),
      createLocation: jest.fn(),
      listLocations: jest.fn(),
      deleteLocation: jest.fn(),
      getLocationByEntity: jest.fn(),
    };
    const router = await createRouter({
      disableRelationsCompatibility: true,
      entitiesCatalog,
      locationService,
      logger: mockServices.logger.mock(),
      config: new ConfigReader({
        catalog: {
          readonly: true,
        },
      }),
      permissionIntegrationRouter: express.Router(),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      permissionsService,
    });
    router.use(middleware.error());
    app = express().use(router);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.queryEntities.mockResolvedValueOnce({
        items: { type: 'raw', entities: [JSON.stringify(entities[0])] },
        pageInfo: {},
        totalItems: 1,
      });

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    // this delete is allowed as there is no other way to remove entities
    it('is allowed', async () => {
      const response = await request(app).delete('/entities/by-uid/apa');
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledWith('apa', {
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(204);
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: Location[] = [
        { id: 'foo', type: 'url', target: 'example.com' },
      ];
      locationService.listLocations.mockResolvedValueOnce(locations);

      const response = await request(app).get('/locations');
      expect(locationService.listLocations).toHaveBeenCalledTimes(1);
      expect(locationService.listLocations).toHaveBeenCalledWith({
        credentials: mockCredentials.user(),
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { data: { id: 'foo', target: 'example.com', type: 'url' } },
      ]);
    });
  });

  describe('GET /locations/:id', () => {
    it('happy path: gets location by id', async () => {
      const location: Location = {
        id: 'foo',
        type: 'url',
        target: 'example.com',
      };
      locationService.getLocation.mockResolvedValueOnce(location);

      const response = await request(app).get('/locations/foo');
      expect(locationService.getLocation).toHaveBeenCalledTimes(1);
      expect(locationService.getLocation).toHaveBeenCalledWith('foo', {
        credentials: mockCredentials.user(),
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 'foo',
        target: 'example.com',
        type: 'url',
      });
    });
  });

  describe('POST /locations', () => {
    it('is not allowed', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      const response = await request(app)
        .post('/locations')

        .send(spec);

      expect(locationService.createLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
      expect(response.text).toMatch(/not allowed in readonly/);
    });

    it('supports dry run', async () => {
      const spec: LocationInput = {
        type: 'b',
        target: 'c',
      };

      locationService.createLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app)
        .post('/locations?dryRun=true')

        .send(spec);

      expect(locationService.createLocation).toHaveBeenCalledTimes(1);
      expect(locationService.createLocation).toHaveBeenCalledWith(spec, true, {
        credentials: mockCredentials.user(),
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          location: { id: 'a', ...spec },
        }),
      );
    });
  });

  describe('DELETE /locations', () => {
    it('is not allowed', async () => {
      const response = await request(app).delete('/locations/foo');
      expect(locationService.deleteLocation).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });
  });

  describe('GET /locations/by-entity/:kind/:namespace/:name', () => {
    it('happy path: gets location by entity ref', async () => {
      const location: Location = {
        id: 'foo',
        type: 'url',
        target: 'example.com',
      };
      locationService.getLocationByEntity.mockResolvedValueOnce(location);

      const response = await request(app).get('/locations/by-entity/c/ns/n');
      expect(locationService.getLocationByEntity).toHaveBeenCalledTimes(1);
      expect(locationService.getLocationByEntity).toHaveBeenCalledWith(
        { kind: 'c', namespace: 'ns', name: 'n' },
        {
          credentials: mockCredentials.user(),
        },
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 'foo',
        target: 'example.com',
        type: 'url',
      });
    });
  });
});

describe('NextRouter permissioning', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationService: jest.Mocked<LocationService>;
  let app: express.Express;
  let refreshService: RefreshService;
  const permissionsService = mockServices.permissions.mock();

  const fakeRule = createPermissionRule({
    name: 'FAKE_RULE',
    description: 'fake rule',
    resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
    paramsSchema: z.object({
      foo: z.string(),
    }),
    apply: () => true,
    toQuery: () => ({ key: '', values: [] }),
  });

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      entitiesBatch: jest.fn(),
      removeEntityByUid: jest.fn(),
      entityAncestry: jest.fn(),
      facets: jest.fn(),
      queryEntities: jest.fn(),
    };
    locationService = {
      getLocation: jest.fn(),
      createLocation: jest.fn(),
      listLocations: jest.fn(),
      deleteLocation: jest.fn(),
      getLocationByEntity: jest.fn(),
    };
    refreshService = { refresh: jest.fn() };
    const router = await createRouter({
      entitiesCatalog,
      locationService,
      logger: mockServices.logger.mock(),
      refreshService,
      config: new ConfigReader(undefined),
      permissionIntegrationRouter: createPermissionIntegrationRouter({
        resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
        rules: [fakeRule],
        getResources: jest.fn((resourceRefs: string[]) =>
          Promise.resolve(
            resourceRefs.map(resourceRef => ({ id: resourceRef })),
          ),
        ),
      }),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      permissionsService,
    });
    app = express().use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('accepts and evaluates conditions at the apply-conditions endpoint', async () => {
    const spideySense: Entity = {
      apiVersion: 'a',
      kind: 'component',
      metadata: {
        name: 'spidey-sense',
      },
    };
    entitiesCatalog.entities.mockResolvedValueOnce({
      entities: { type: 'object', entities: [spideySense] },
      pageInfo: { hasNextPage: false },
    });

    const requestBody = {
      items: [
        {
          id: '123',
          resourceType: 'catalog-entity',
          resourceRef: 'component:default/spidey-sense',
          conditions: {
            rule: 'FAKE_RULE',
            resourceType: 'catalog-entity',
            params: {
              foo: 'user:default/spiderman',
            },
          },
        },
      ],
    };
    const response = await request(app)
      .post('/.well-known/backstage/permissions/apply-conditions')
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [{ id: '123', result: AuthorizeResult.ALLOW }],
    });
  });
});

function mockCursor(partialCursor?: Partial<Cursor>): Cursor {
  return {
    orderFields: [],
    orderFieldValues: [],
    isPrevious: false,
    ...partialCursor,
  };
}
