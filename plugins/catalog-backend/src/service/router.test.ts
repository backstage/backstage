/*
 * Copyright 2020 Spotify AB
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

import { getVoidLogger, NotFoundError } from '@backstage/backend-common';
import type { Entity } from '@backstage/catalog-model';
import express from 'express';
import request from 'supertest';
import { EntitiesCatalog, Location, LocationsCatalog } from '../catalog';
import { createRouter } from './router';

class MockEntitiesCatalog implements EntitiesCatalog {
  entities = jest.fn();
  entityByUid = jest.fn();
  entityByName = jest.fn();
  addEntity = jest.fn();
  addOrUpdateEntity = jest.fn();
  removeEntityByUid = jest.fn();
}

class MockLocationsCatalog implements LocationsCatalog {
  addLocation = jest.fn();
  removeLocation = jest.fn();
  locations = jest.fn();
  location = jest.fn();
  locationHistory = jest.fn();
}

describe('createRouter', () => {
  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      const catalog = new MockEntitiesCatalog();
      catalog.entities.mockResolvedValueOnce(entities);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });

    it('parses single and multiple request parameters and passes them down', async () => {
      const catalog = new MockEntitiesCatalog();

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/entities?a=1&a=&a=3&b=4&c=');

      expect(response.status).toEqual(200);
      expect(catalog.entities).toHaveBeenCalledWith([
        { key: 'a', values: ['1', null, '3'] },
        { key: 'b', values: ['4'] },
        { key: 'c', values: [null] },
      ]);
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
      const catalog = new MockEntitiesCatalog();
      catalog.entityByUid.mockResolvedValue(entity);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/entities/by-uid/zzz');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      const catalog = new MockEntitiesCatalog();
      catalog.entityByUid.mockResolvedValue(undefined);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/entities/by-uid/zzz');

      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/uid/);
    });
  });

  describe('GET /entities/by-name/:kind/:namespace/:name', () => {
    it('can fetch entity by name', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };
      const catalog = new MockEntitiesCatalog();
      catalog.entityByName.mockResolvedValue(entity);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/entities/by-name/b/d/c');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      const catalog = new MockEntitiesCatalog();
      catalog.entityByName.mockResolvedValue(undefined);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/entities/by-name//b/d/c');

      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/name/);
    });
  });

  describe('POST /entities', () => {
    it('requires a body', async () => {
      const catalog = new MockEntitiesCatalog();
      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app)
        .post('/entities')
        .set('Content-Type', 'application/json')
        .send();

      expect(response.status).toEqual(400);
      expect(response.text).toMatch(/body/);
      expect(catalog.addOrUpdateEntity).not.toHaveBeenCalled();
    });

    it('passes the body down', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };

      const catalog = new MockEntitiesCatalog();
      catalog.addOrUpdateEntity.mockResolvedValue(entity);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app)
        .post('/entities')
        .send(entity)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entity);
      expect(catalog.addOrUpdateEntity).toHaveBeenCalledTimes(1);
      expect(catalog.addOrUpdateEntity).toHaveBeenNthCalledWith(1, entity);
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    it('can remove', async () => {
      const catalog = new MockEntitiesCatalog();
      catalog.removeEntityByUid.mockResolvedValue(undefined);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).delete('/entities/by-uid/apa');

      expect(response.status).toEqual(204);
      expect(catalog.removeEntityByUid).toHaveBeenCalledTimes(1);
    });

    it('responds with a 404 for missing entities', async () => {
      const catalog = new MockEntitiesCatalog();
      catalog.removeEntityByUid.mockRejectedValue(new NotFoundError('nope'));

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).delete('/entities/by-uid/apa');

      expect(response.status).toEqual(404);
      expect(catalog.removeEntityByUid).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: Location[] = [{ id: 'a', type: 'b', target: 'c' }];

      const catalog = new MockLocationsCatalog();
      catalog.locations.mockResolvedValueOnce(locations);

      const router = await createRouter({
        locationsCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/locations');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(locations);
    });
  });

  describe('POST /locations', () => {
    it('rejects malformed locations', async () => {
      const location = ({
        id: 'a',
        typez: 'b',
        target: 'c',
      } as unknown) as Location;

      const catalog = new MockLocationsCatalog();
      const router = await createRouter({
        locationsCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).post('/locations').send(location);

      expect(response.status).toEqual(400);
    });
  });
});
