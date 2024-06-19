/*
 * Copyright 2023 The Backstage Authors
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
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { EventsService } from '@backstage/plugin-events-node';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { UserInfoService } from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';

const eventsServiceMock: jest.Mocked<EventsService> = {
  subscribe: jest.fn(),
  publish: jest.fn(),
};

const identityApiMock: jest.Mocked<IdentityApi> = {
  getIdentity: jest.fn(),
};

const discovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest.fn().mockResolvedValue('/api/signals'),
  getExternalBaseUrl: jest.fn(),
};

const userInfo: jest.Mocked<UserInfoService> = {
  getUserInfo: jest.fn(),
};

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      identity: identityApiMock,
      events: eventsServiceMock,
      discovery,
      userInfo,
      config: new ConfigReader({}),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
