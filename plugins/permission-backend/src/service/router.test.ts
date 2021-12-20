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
import { IdentityClient } from '@backstage/plugin-auth-backend';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { ApplyConditionsResponseEntry } from '@backstage/plugin-permission-node';
import { PermissionIntegrationClient } from './PermissionIntegrationClient';

import { createRouter } from './router';

const mockApplyConditions: jest.MockedFunction<
  InstanceType<typeof PermissionIntegrationClient>['applyConditions']
> = jest.fn(async decisions =>
  decisions.map(decision => {
    if (
      decision.result === AuthorizeResult.CONDITIONAL &&
      decision.resourceRef
    ) {
      return { id: decision.id, result: AuthorizeResult.DENY as const };
    }

    if (decision.result === AuthorizeResult.CONDITIONAL) {
      return {
        id: decision.id,
        result: decision.result,
        conditions: decision.conditions,
      };
    }

    return decision;
  }),
);

jest.mock('./PermissionIntegrationClient', () => ({
  PermissionIntegrationClient: jest.fn(() => ({
    applyConditions: mockApplyConditions,
  })),
}));

const policy = {
  handle: jest.fn().mockImplementation(async (_req, identity) => {
    if (identity) {
      return { result: AuthorizeResult.ALLOW };
    }
    return { result: AuthorizeResult.DENY };
  }),
};

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      discovery: {
        getBaseUrl: jest.fn(),
        getExternalBaseUrl: jest.fn(),
      },
      identity: {
        authenticate: jest.fn(token => {
          if (!token) {
            throw new Error('No token supplied!');
          }

          return Promise.resolve({
            id: 'test-user',
            token,
          });
        }),
      } as unknown as IdentityClient,
      policy,
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
        .send([
          {
            id: '123',
            permission: {
              name: 'test.permission1',
              attributes: {},
            },
          },
          {
            id: '234',
            permission: {
              name: 'test.permission2',
              attributes: {},
            },
          },
        ]);

      expect(response.status).toEqual(200);

      expect(policy.handle).toHaveBeenCalledWith(
        {
          permission: {
            name: 'test.permission1',
            attributes: {},
          },
        },
        undefined,
      );
      expect(policy.handle).toHaveBeenCalledWith(
        {
          permission: {
            name: 'test.permission2',
            attributes: {},
          },
        },
        undefined,
      );

      expect(response.body).toEqual([
        { id: '123', result: AuthorizeResult.DENY },
        { id: '234', result: AuthorizeResult.DENY },
      ]);
    });

    it('resolves identity from the Authorization header', async () => {
      const token = 'test-token';
      const response = await request(app)
        .post('/authorize')
        .auth(token, { type: 'bearer' })
        .send([
          {
            id: '123',
            permission: {
              name: 'test.permission',
              attributes: {},
            },
          },
        ]);

      expect(response.status).toEqual(200);
      expect(policy.handle).toHaveBeenCalledWith(
        {
          permission: {
            name: 'test.permission',
            attributes: {},
          },
        },
        { id: 'test-user', token: 'test-token' },
      );
      expect(response.body).toEqual([
        { id: '123', result: AuthorizeResult.ALLOW },
      ]);
    });

    describe('conditional policy result', () => {
      beforeEach(() => {
        policy.handle.mockResolvedValue({
          result: AuthorizeResult.CONDITIONAL,
          pluginId: 'test-plugin',
          resourceType: 'test-resource-1',
          conditions: {
            anyOf: [{ rule: 'test-rule', params: ['abc'] }],
          },
        });
      });

      it('returns conditions if no resourceRef is supplied', async () => {
        const response = await request(app)
          .post('/authorize')
          .send([
            {
              id: '123',
              permission: {
                name: 'test.permission',
                resourceType: 'test-resource-1',
                attributes: {},
              },
            },
          ]);

        expect(response.status).toEqual(200);
        expect(response.body).toEqual([
          {
            id: '123',
            result: AuthorizeResult.CONDITIONAL,
            conditions: { anyOf: [{ rule: 'test-rule', params: ['abc'] }] },
          },
        ]);
      });

      it.each<ApplyConditionsResponseEntry['result']>([
        AuthorizeResult.ALLOW,
        AuthorizeResult.DENY,
      ])(
        'applies conditions and returns %s if resourceRef is supplied',
        async result => {
          mockApplyConditions.mockResolvedValueOnce([
            {
              id: '123',
              result,
            },
            {
              id: '234',
              result,
            },
          ]);

          const response = await request(app)
            .post('/authorize')
            .auth('test-token', { type: 'bearer' })
            .send([
              {
                id: '123',
                resourceRef: 'test/resource',
                permission: {
                  name: 'test.permission',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
              },
              {
                id: '234',
                resourceRef: 'test/resource',
                permission: {
                  name: 'test.permission',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
              },
            ]);

          expect(mockApplyConditions).toHaveBeenCalledWith(
            [
              expect.objectContaining({
                id: '123',
                result: AuthorizeResult.CONDITIONAL,
                pluginId: 'test-plugin',
                resourceType: 'test-resource-1',
                resourceRef: 'test/resource',
                conditions: { anyOf: [{ rule: 'test-rule', params: ['abc'] }] },
              }),
              expect.objectContaining({
                id: '234',
                pluginId: 'test-plugin',
                resourceType: 'test-resource-1',
                resourceRef: 'test/resource',
                conditions: { anyOf: [{ rule: 'test-rule', params: ['abc'] }] },
              }),
            ],
            'Bearer test-token',
          );

          expect(response.status).toEqual(200);
          expect(response.body).toEqual([
            {
              id: '123',
              result,
            },
            {
              id: '234',
              result,
            },
          ]);
        },
      );
    });

    it.each([
      undefined,
      '',
      {},
      [{ permission: { name: 'test.permission', attributes: {} } }],
      [{ id: '123' }],
      [{ id: '123', permission: { name: 'test.permission' } }],
      [{ id: '123', permission: { attributes: { invalid: 'attribute' } } }],
    ])('returns a 400 error for invalid request %#', async requestBody => {
      const response = await request(app).post('/authorize').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            message: expect.stringMatching(/invalid/i),
          }),
        }),
      );
    });

    it('returns a 500 error if the policy returns a different resourceType', async () => {
      policy.handle.mockResolvedValueOnce({
        result: AuthorizeResult.CONDITIONAL,
        pluginId: 'test-plugin',
        resourceType: 'test-resource-2',
        conditions: {},
      });

      const response = await request(app)
        .post('/authorize')
        .send([
          {
            id: '123',
            permission: {
              name: 'test.permission',
              resourceType: 'test-resource-1',
              attributes: {},
            },
          },
        ]);

      expect(response.status).toEqual(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            message: expect.stringMatching(/invalid resource conditions/i),
          }),
        }),
      );
    });
  });
});
