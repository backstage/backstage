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
import type { Entity, LocationSpec } from '@backstage/catalog-model';
import express from 'express';
import request from 'supertest';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { LocationResponse } from '../catalog/types';
import { HigherOrderOperation } from '../ingestion/types';
import { createRouter } from './router';

describe('createRouter', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationsCatalog: jest.Mocked<LocationsCatalog>;
  let higherOrderOperation: jest.Mocked<HigherOrderOperation>;
  let app: express.Express;

  beforeAll(async () => {
    entitiesCatalog = {
      entities: jest.fn(),
      entityByUid: jest.fn(),
      entityByName: jest.fn(),
      addOrUpdateEntity: jest.fn(),
      removeEntityByUid: jest.fn(),
    };
    locationsCatalog = {
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      locations: jest.fn(),
      location: jest.fn(),
      locationHistory: jest.fn(),
      logUpdateSuccess: jest.fn(),
      logUpdateFailure: jest.fn(),
    };
    higherOrderOperation = {
      addLocation: jest.fn(),
    };
    const router = await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      logger: getVoidLogger(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /entities', () => {
    it('happy path: lists entities', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'b', metadata: { name: 'n' } },
      ];

      entitiesCatalog.entities.mockResolvedValueOnce(entities);

      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entities);
    });

    it('parses single and multiple request parameters and passes them down', async () => {
      const response = await request(app).get('/entities?a=1&a=&a=3&b=4&c=');

      expect(response.status).toEqual(200);
      expect(entitiesCatalog.entities).toHaveBeenCalledWith([
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
      entitiesCatalog.entityByUid.mockResolvedValue(entity);

      const response = await request(app).get('/entities/by-uid/zzz');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entityByUid.mockResolvedValue(undefined);
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
      entitiesCatalog.entityByName.mockResolvedValue(entity);

      const response = await request(app).get('/entities/by-name/b/d/c');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.objectContaining(entity));
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.entityByName.mockResolvedValue(undefined);

      const response = await request(app).get('/entities/by-name//b/d/c');

      expect(response.status).toEqual(404);
      expect(response.text).toMatch(/name/);
    });
  });

  describe('POST /entities', () => {
    it('requires a body', async () => {
      const response = await request(app)
        .post('/entities')
        .set('Content-Type', 'application/json')
        .send();

      expect(response.status).toEqual(400);
      expect(response.text).toMatch(/body/);
      expect(entitiesCatalog.addOrUpdateEntity).not.toHaveBeenCalled();
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

      entitiesCatalog.addOrUpdateEntity.mockResolvedValue(entity);

      const response = await request(app)
        .post('/entities')
        .send(entity)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(entity);
      expect(entitiesCatalog.addOrUpdateEntity).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.addOrUpdateEntity).toHaveBeenNthCalledWith(
        1,
        entity,
      );
    });
  });

  describe('DELETE /entities/by-uid/:uid', () => {
    it('can remove', async () => {
      entitiesCatalog.removeEntityByUid.mockResolvedValue(undefined);

      const response = await request(app).delete('/entities/by-uid/apa');

      expect(response.status).toEqual(204);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
    });

    it('responds with a 404 for missing entities', async () => {
      entitiesCatalog.removeEntityByUid.mockRejectedValue(
        new NotFoundError('nope'),
      );

      const response = await request(app).delete('/entities/by-uid/apa');

      expect(response.status).toEqual(404);
      expect(entitiesCatalog.removeEntityByUid).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /locations', () => {
    it('happy path: lists locations', async () => {
      const locations: LocationResponse[] = [
        {
          currentStatus: { timestamp: '', status: '', message: '' },
          data: { id: 'a', type: 'b', target: 'c' },
        },
      ];
      locationsCatalog.locations.mockResolvedValueOnce(locations);

      const response = await request(app).get('/locations');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(locations);
    });
  });

  describe('POST /locations', () => {
    it('rejects malformed locations', async () => {
      const spec = ({
        typez: 'b',
        target: 'c',
      } as unknown) as LocationSpec;

      const response = await request(app).post('/locations').send(spec);

      expect(response.status).toEqual(400);
      expect(higherOrderOperation.addLocation).not.toHaveBeenCalled();
    });

    it('passes the body down', async () => {
      const spec: LocationSpec = {
        type: 'b',
        target: 'c',
      };

      higherOrderOperation.addLocation.mockResolvedValue({
        location: { id: 'a', ...spec },
        entities: [],
      });

      const response = await request(app).post('/locations').send(spec);

      expect(response.status).toEqual(201);
      expect(higherOrderOperation.addLocation).toHaveBeenCalledTimes(1);
      expect(higherOrderOperation.addLocation).toHaveBeenCalledWith(spec);
    });
  });
});
