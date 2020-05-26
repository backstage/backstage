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

import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { EntitiesCatalog, LocationsCatalog, Location } from '../catalog';
import { getVoidLogger } from '@backstage/backend-common';
import { DescriptorEnvelope } from '../ingestion';

class MockEntitiesCatalog implements EntitiesCatalog {
  entities = jest.fn();
  entity = jest.fn();
}

class MockLocationsCatalog implements LocationsCatalog {
  addLocation = jest.fn();
  removeLocation = jest.fn();
  locations = jest.fn();
  location = jest.fn();
}

describe('createRouter', () => {
  describe('entities', () => {
    it('happy path: lists entities', async () => {
      const entities: DescriptorEnvelope[] = [{ apiVersion: 'a', kind: 'b' }];

      const catalog = new MockEntitiesCatalog();
      catalog.entities.mockResolvedValueOnce(entities);

      const router = await createRouter({
        entitiesCatalog: catalog,
        logger: getVoidLogger(),
      });

      const app = express().use(router);
      const response = await request(app).get('/entities');

      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(entities);
    });
  });

  describe('locations', () => {
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
      expect(JSON.parse(response.text)).toEqual(locations);
    });
  });
});
