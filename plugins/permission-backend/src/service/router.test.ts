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
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { IdentityClient } from '@backstage/plugin-auth-backend';
import {
  AuthorizeResult,
  Permission,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy } from '@backstage/plugin-permission-node';

import { createRouter } from './router';

const identityApi: Partial<IdentityClient> = {
  authenticate: jest.fn().mockImplementation(_ => ({ id: 'test-user' })),
};

const policy: PermissionPolicy = {
  handle: jest.fn().mockImplementation((_req, identity) => {
    if (identity) {
      return { result: AuthorizeResult.ALLOW };
    }
    return { result: AuthorizeResult.DENY };
  }),
};

const permission: Permission = {
  name: 'test.permission',
  attributes: { action: 'read' },
};

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: new ConfigReader({
        backend: {
          baseUrl: 'http://localhost',
          listen: { port: 7007 },
        },
      }),
      policy,
      identity: identityApi as IdentityClient,
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

  describe('POST /authorize', () => {
    it('calls the permission policy', async () => {
      const response = await request(app)
        .post('/authorize')
        .send([{ id: 123, permission }]);

      expect(response.status).toEqual(200);
      expect(policy.handle).toHaveBeenCalledWith({ permission }, undefined);
      expect(response.body).toEqual([
        { id: 123, result: AuthorizeResult.DENY },
      ]);
    });

    it('resolves identity from the Authorization header', async () => {
      const token = 'token';
      const response = await request(app)
        .post('/authorize')
        .auth(token, { type: 'bearer' })
        .send([{ id: 123, permission }]);

      expect(response.status).toEqual(200);
      expect(identityApi.authenticate).toHaveBeenCalledWith('token');
      expect(policy.handle).toHaveBeenCalledWith(
        { permission },
        { id: 'test-user' },
      );
    });
  });
});
