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
import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';

describe('createRouter', () => {
  let app: express.Express;
  const mockAuthService = mockServices.auth.mock({
    getPluginRequestToken: async () => ({ token: 'abc123' }),
  });

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config: new ConfigReader({
        auth: {
          external: [
            {
              apiKey: '1234',
              name: 'external',
              allowedPlugins: ['notifications'],
            },
          ],
        },
      }),
      discovery: mockServices.discovery(),
      auth: mockAuthService,
    });
    app = express().use(router);
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /token/:pluginId', () => {
    it('should return token for allowed plugin', async () => {
      const response = await request(app)
        .get('/token/notifications')
        .set('X-Api-Key', '1234');

      expect(mockAuthService.getPluginRequestToken).toHaveBeenCalledWith({
        onBehalfOf: {
          $$type: '@backstage/BackstageCredentials',
          principal: {
            subject: 'external:external',
            type: 'service',
          },
        },
        targetPluginId: 'notifications',
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ token: 'abc123' });
    });

    it('should not allow calling without api key', async () => {
      const response = await request(app).get('/token/notifications');
      expect(response.status).toEqual(401);
    });

    it('should not allow calling with invalid api key', async () => {
      const response = await request(app)
        .get('/token/notifications')
        .set('X-Api-Key', 'invalid');
      expect(response.status).toEqual(401);
    });

    it('shoild not allow fetching token for not allowed plugin', async () => {
      const response = await request(app)
        .get('/token/catalog')
        .set('X-Api-Key', '1234');
      expect(response.status).toEqual(401);
    });
  });
});
