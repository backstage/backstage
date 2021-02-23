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

import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { makeRouter } from './router';
import { KubernetesFanOutHandler } from './KubernetesFanOutHandler';

describe('router', () => {
  let app: express.Express;
  let kubernetesFanOutHandler: jest.Mocked<KubernetesFanOutHandler>;

  beforeAll(async () => {
    kubernetesFanOutHandler = {
      getKubernetesObjectsByEntity: jest.fn(),
    } as any;

    const router = makeRouter(getVoidLogger(), kubernetesFanOutHandler);
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('post /services/:serviceId', () => {
    it('happy path: lists kubernetes objects without auth in request body', async () => {
      const result = {
        clusterOne: {
          pods: [
            {
              metadata: {
                name: 'pod1',
              },
            },
          ],
        },
      } as any;
      kubernetesFanOutHandler.getKubernetesObjectsByEntity.mockReturnValueOnce(
        Promise.resolve(result),
      );

      const response = await request(app).post('/services/test-service');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(result);
    });

    it('happy path: lists kubernetes objects with auth in request body', async () => {
      const result = {
        clusterOne: {
          pods: [
            {
              metadata: {
                name: 'pod1',
              },
            },
          ],
        },
      } as any;
      kubernetesFanOutHandler.getKubernetesObjectsByEntity.mockReturnValueOnce(
        Promise.resolve(result),
      );

      const response = await request(app)
        .post('/services/test-service')
        .send({
          auth: {
            google: 'google_token_123',
          },
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(result);
    });

    it('internal error: lists kubernetes objects', async () => {
      kubernetesFanOutHandler.getKubernetesObjectsByEntity.mockRejectedValue(
        Error('some internal error'),
      );

      const response = await request(app).post('/services/test-service');

      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: 'some internal error' });
    });
  });
});
