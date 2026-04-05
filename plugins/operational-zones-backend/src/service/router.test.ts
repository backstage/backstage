/*
 * Copyright 2024 The Backstage Authors
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
import { mockServices, mockErrorHandler } from '@backstage/backend-test-utils';
import { OperationalZoneService } from '@backstage/plugin-operational-zones-common';

describe('createRouter', () => {
  const mockZone = {
    id: 'test-op',
    level: 'green' as const,
    label: 'No active restrictions',
    activeUntil: undefined,
  };

  const service: jest.Mocked<OperationalZoneService> = {
    resolve: jest.fn(),
    register: jest.fn(),
    listAll: jest.fn(),
  };

  let app: express.Express;

  beforeEach(async () => {
    const router = await createRouter({
      httpAuth: mockServices.httpAuth(),
      service,
    });

    app = express().use(router).use(mockErrorHandler());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /zones', () => {
    it('returns all zones', async () => {
      service.listAll.mockResolvedValue([mockZone]);

      const response = await request(app).get('/zones');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ zones: [mockZone] });
      expect(service.listAll).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no zones registered', async () => {
      service.listAll.mockResolvedValue([]);

      const response = await request(app).get('/zones');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ zones: [] });
    });
  });

  describe('GET /zones/:operationId', () => {
    it('returns a specific zone', async () => {
      service.resolve.mockResolvedValue(mockZone);

      const response = await request(app).get('/zones/test-op');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockZone);
      expect(service.resolve).toHaveBeenCalledWith('test-op');
    });

    it('returns 404 for unknown operation', async () => {
      service.resolve.mockRejectedValue(
        Object.assign(new Error('Not found'), { name: 'NotFoundError' }),
      );

      const response = await request(app).get('/zones/unknown');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /zones', () => {
    it('creates a new zone schedule', async () => {
      service.resolve.mockResolvedValue(mockZone);

      const body = {
        operationId: 'new-op',
        defaultLevel: 'green',
        windows: [{ level: 'red', cron: '0 8 * * 1-5', durationMinutes: 600 }],
      };

      const response = await request(app).post('/zones').send(body);

      expect(response.status).toBe(201);
      expect(service.register).toHaveBeenCalledTimes(1);
      expect(service.register).toHaveBeenCalledWith(
        'new-op',
        expect.objectContaining({ operationId: 'new-op' }),
      );
    });

    it('returns 400 for invalid body', async () => {
      const response = await request(app)
        .post('/zones')
        .send({ operationId: '' });

      expect(response.status).toBe(400);
      expect(service.register).not.toHaveBeenCalled();
    });

    it('returns 400 when windows array is empty', async () => {
      const response = await request(app)
        .post('/zones')
        .send({ operationId: 'op', windows: [] });

      expect(response.status).toBe(400);
    });
  });
});
