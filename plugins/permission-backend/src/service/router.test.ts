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
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  ApplyConditionsRequestEntry,
  ApplyConditionsResponseEntry,
} from '@backstage/plugin-permission-node';
import { PermissionIntegrationClient } from './PermissionIntegrationClient';

import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';

const mockApplyConditions: jest.MockedFunction<
  InstanceType<typeof PermissionIntegrationClient>['applyConditions']
> = jest.fn(
  async (
    _pluginId: string,
    _credentials: BackstageCredentials,
    decisions: readonly ApplyConditionsRequestEntry[],
  ) =>
    decisions.map(decision => ({
      id: decision.id,
      result:
        (decision.conditions as any).params[0] === 'yes'
          ? (AuthorizeResult.ALLOW as const)
          : (AuthorizeResult.DENY as const),
    })),
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

const middleware = MiddlewareFactory.create({
  logger: mockServices.logger.mock(),
  config: mockServices.rootConfig(),
});

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      config: new ConfigReader({ permission: { enabled: true } }),
      logger: mockServices.logger.mock(),
      discovery: mockServices.discovery(),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth({
        defaultCredentials: mockCredentials.none(),
      }),
      userInfo: mockServices.userInfo(),
      policy,
    });
    router.use(middleware.error());
    app = express().use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        .send({
          items: [
            {
              id: '123',
              permission: {
                type: 'basic',
                name: 'test.permission1',
                attributes: {},
              },
            },
            {
              id: '234',
              permission: {
                type: 'basic',
                name: 'test.permission2',
                attributes: {},
              },
            },
          ],
        });

      expect(response.status).toEqual(200);

      expect(policy.handle).toHaveBeenCalledWith(
        {
          permission: {
            type: 'basic',
            name: 'test.permission1',
            attributes: {},
          },
        },
        undefined,
      );
      expect(policy.handle).toHaveBeenCalledWith(
        {
          permission: {
            type: 'basic',
            name: 'test.permission2',
            attributes: {},
          },
        },
        undefined,
      );

      expect(response.body).toEqual({
        items: [
          { id: '123', result: AuthorizeResult.DENY },
          { id: '234', result: AuthorizeResult.DENY },
        ],
      });
    });

    it('resolves identity from the Authorization header', async () => {
      const response = await request(app)
        .post('/authorize')
        .auth(mockCredentials.user.token(), { type: 'bearer' })
        .send({
          items: [
            {
              id: '123',
              permission: {
                type: 'basic',
                name: 'test.permission',
                attributes: {},
              },
            },
          ],
        });

      expect(response.status).toEqual(200);
      expect(policy.handle).toHaveBeenCalledWith(
        {
          permission: {
            type: 'basic',
            name: 'test.permission',
            attributes: {},
          },
        },
        {
          token: mockCredentials.service.token({
            onBehalfOf: mockCredentials.user(),
            targetPluginId: 'catalog',
          }),
          identity: {
            type: 'user',
            userEntityRef: mockCredentials.user().principal.userEntityRef,
            ownershipEntityRefs: [
              mockCredentials.user().principal.userEntityRef,
            ],
          },
          info: {
            userEntityRef: mockCredentials.user().principal.userEntityRef,
            ownershipEntityRefs: [
              mockCredentials.user().principal.userEntityRef,
            ],
          },
          credentials: mockCredentials.user(),
        },
      );
      expect(response.body).toEqual({
        items: [{ id: '123', result: AuthorizeResult.ALLOW }],
      });
    });

    describe('conditional policy result', () => {
      it('returns conditions if no resourceRef is supplied', async () => {
        policy.handle.mockResolvedValueOnce({
          result: AuthorizeResult.CONDITIONAL,
          pluginId: 'test-plugin',
          resourceType: 'test-resource-1',
          conditions: { rule: 'test-rule', params: ['abc'] },
        });

        const response = await request(app)
          .post('/authorize')
          .send({
            items: [
              {
                id: '123',
                permission: {
                  type: 'resource',
                  name: 'test.permission',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
              },
            ],
          });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          items: [
            {
              id: '123',
              result: AuthorizeResult.CONDITIONAL,
              pluginId: 'test-plugin',
              resourceType: 'test-resource-1',
              conditions: { rule: 'test-rule', params: ['abc'] },
            },
          ],
        });
      });

      it('makes separate batched requests to multiple plugin backends', async () => {
        policy.handle
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-1',
            resourceType: 'test-resource-1',
            conditions: { rule: 'test-rule', params: ['yes'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-2',
            resourceType: 'test-resource-2',
            conditions: { rule: 'test-rule', params: ['yes'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-1',
            resourceType: 'test-resource-1',
            conditions: { rule: 'test-rule', params: ['no'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-2',
            resourceType: 'test-resource-2',
            conditions: { rule: 'test-rule', params: ['no'] },
          });

        const response = await request(app)
          .post('/authorize')
          .auth(mockCredentials.user.token(), { type: 'bearer' })
          .send({
            items: [
              {
                id: '123',
                permission: {
                  type: 'resource',
                  name: 'test.permission.1',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
                resourceRef: 'resource:1',
              },
              {
                id: '234',
                permission: {
                  type: 'resource',
                  name: 'test.permission.2',
                  resourceType: 'test-resource-2',
                  attributes: {},
                },
                resourceRef: 'resource:2',
              },
              {
                id: '345',
                permission: {
                  type: 'resource',
                  name: 'test.permission.3',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
                resourceRef: 'resource:3',
              },
              {
                id: '456',
                permission: {
                  type: 'resource',
                  name: 'test.permission.4',
                  resourceType: 'test-resource-2',
                  attributes: {},
                },
                resourceRef: 'resource:4',
              },
            ],
          });

        expect(mockApplyConditions).toHaveBeenCalledWith(
          'plugin-1',
          mockCredentials.user(),
          [
            expect.objectContaining({
              id: '123',
              resourceType: 'test-resource-1',
              resourceRef: 'resource:1',
              conditions: { rule: 'test-rule', params: ['yes'] },
            }),
            expect.objectContaining({
              id: '345',
              resourceType: 'test-resource-1',
              resourceRef: 'resource:3',
              conditions: { rule: 'test-rule', params: ['no'] },
            }),
          ],
        );

        expect(mockApplyConditions).toHaveBeenCalledWith(
          'plugin-2',
          mockCredentials.user(),
          [
            expect.objectContaining({
              id: '234',
              resourceType: 'test-resource-2',
              resourceRef: 'resource:2',
              conditions: { rule: 'test-rule', params: ['yes'] },
            }),
            expect.objectContaining({
              id: '456',
              resourceType: 'test-resource-2',
              resourceRef: 'resource:4',
              conditions: { rule: 'test-rule', params: ['no'] },
            }),
          ],
        );

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          items: [
            { id: '123', result: AuthorizeResult.ALLOW },
            { id: '234', result: AuthorizeResult.ALLOW },
            { id: '345', result: AuthorizeResult.DENY },
            { id: '456', result: AuthorizeResult.DENY },
          ],
        });
      });

      it('leaves definitive results unchanged', async () => {
        policy.handle
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-1',
            resourceType: 'test-resource-1',
            conditions: { rule: 'test-rule', params: ['no'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-2',
            resourceType: 'test-resource-2',
            conditions: { rule: 'test-rule', params: ['no'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.ALLOW,
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-1',
            resourceType: 'test-resource-1',
            conditions: { rule: 'test-rule', params: ['yes'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-2',
            resourceType: 'test-resource-2',
            conditions: { rule: 'test-rule', params: ['yes'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.DENY,
          });

        const response = await request(app)
          .post('/authorize')
          .auth(mockCredentials.user.token(), { type: 'bearer' })
          .send({
            items: [
              {
                id: '123',
                permission: {
                  type: 'resource',
                  name: 'test.permission.1',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
                resourceRef: 'resource:1',
              },
              {
                id: '234',
                permission: {
                  type: 'resource',
                  name: 'test.permission.2',
                  resourceType: 'test-resource-2',
                  attributes: {},
                },
                resourceRef: 'resource:2',
              },
              {
                id: '345',
                permission: {
                  type: 'resource',
                  name: 'test.permission.3',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
                resourceRef: 'resource:3',
              },
              {
                id: '456',
                permission: {
                  type: 'resource',
                  name: 'test.permission.4',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
                resourceRef: 'resource:4',
              },
              {
                id: '567',
                permission: {
                  type: 'resource',
                  name: 'test.permission.5',
                  resourceType: 'test-resource-2',
                  attributes: {},
                },
                resourceRef: 'resource:5',
              },
              {
                id: '678',
                permission: {
                  type: 'basic',
                  name: 'test.permission.6',
                  attributes: {},
                },
              },
            ],
          });

        expect(mockApplyConditions).toHaveBeenCalledWith(
          'plugin-1',
          mockCredentials.user(),
          [
            expect.objectContaining({
              id: '123',
              resourceType: 'test-resource-1',
              resourceRef: 'resource:1',
              conditions: { rule: 'test-rule', params: ['no'] },
            }),
            expect.objectContaining({
              id: '456',
              resourceType: 'test-resource-1',
              resourceRef: 'resource:4',
              conditions: { rule: 'test-rule', params: ['yes'] },
            }),
          ],
        );

        expect(mockApplyConditions).toHaveBeenCalledWith(
          'plugin-2',
          mockCredentials.user(),
          [
            expect.objectContaining({
              id: '234',
              resourceType: 'test-resource-2',
              resourceRef: 'resource:2',
              conditions: { rule: 'test-rule', params: ['no'] },
            }),
            expect.objectContaining({
              id: '567',
              resourceType: 'test-resource-2',
              resourceRef: 'resource:5',
              conditions: { rule: 'test-rule', params: ['yes'] },
            }),
          ],
        );

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          items: [
            { id: '123', result: AuthorizeResult.DENY },
            { id: '234', result: AuthorizeResult.DENY },
            { id: '345', result: AuthorizeResult.ALLOW },
            { id: '456', result: AuthorizeResult.ALLOW },
            { id: '567', result: AuthorizeResult.ALLOW },
            { id: '678', result: AuthorizeResult.DENY },
          ],
        });
      });

      it('leaves conditional results without resourceRefs unchanged', async () => {
        policy.handle
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-1',
            resourceType: 'test-resource-1',
            conditions: { rule: 'test-rule', params: ['yes'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-2',
            resourceType: 'test-resource-2',
            conditions: { rule: 'test-rule', params: ['yes'] },
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.ALLOW,
          })
          .mockResolvedValueOnce({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'plugin-1',
            resourceType: 'test-resource-1',
            conditions: { rule: 'test-rule', params: ['abc'] },
          });

        const response = await request(app)
          .post('/authorize')
          .auth(mockCredentials.user.token(), { type: 'bearer' })
          .send({
            items: [
              {
                id: '123',
                permission: {
                  type: 'resource',
                  name: 'test.permission.1',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
                resourceRef: 'resource:1',
              },
              {
                id: '234',
                permission: {
                  type: 'resource',
                  name: 'test.permission.2',
                  resourceType: 'test-resource-2',
                  attributes: {},
                },
                resourceRef: 'resource:2',
              },
              {
                id: '345',
                permission: {
                  type: 'resource',
                  name: 'test.permission.3',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
                resourceRef: 'resource:3',
              },
              {
                id: '456',
                permission: {
                  type: 'resource',
                  name: 'test.permission.4',
                  resourceType: 'test-resource-1',
                  attributes: {},
                },
              },
            ],
          });

        expect(mockApplyConditions).toHaveBeenCalledWith(
          'plugin-1',
          mockCredentials.user(),
          [
            expect.objectContaining({
              id: '123',
              resourceType: 'test-resource-1',
              resourceRef: 'resource:1',
              conditions: { rule: 'test-rule', params: ['yes'] },
            }),
          ],
        );

        expect(mockApplyConditions).toHaveBeenCalledWith(
          'plugin-2',
          mockCredentials.user(),
          [
            expect.objectContaining({
              id: '234',
              resourceType: 'test-resource-2',
              resourceRef: 'resource:2',
              conditions: { rule: 'test-rule', params: ['yes'] },
            }),
          ],
        );

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          items: [
            { id: '123', result: AuthorizeResult.ALLOW },
            { id: '234', result: AuthorizeResult.ALLOW },
            { id: '345', result: AuthorizeResult.ALLOW },
            {
              id: '456',
              result: AuthorizeResult.CONDITIONAL,
              pluginId: 'plugin-1',
              resourceType: 'test-resource-1',
              conditions: { rule: 'test-rule', params: ['abc'] },
            },
          ],
        });
      });

      it.each<[ApplyConditionsResponseEntry['result'], string]>([
        [AuthorizeResult.ALLOW, 'yes'],
        [AuthorizeResult.DENY, 'no'],
      ])(
        'applies conditions and returns %s if resourceRef is supplied',
        async (result, params) => {
          policy.handle.mockResolvedValue({
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'test-plugin',
            resourceType: 'test-resource-1',
            conditions: { rule: 'test-rule', params },
          });

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
            .auth(mockCredentials.user.token(), { type: 'bearer' })
            .send({
              items: [
                {
                  id: '123',
                  resourceRef: 'test/resource',
                  permission: {
                    type: 'resource',
                    name: 'test.permission',
                    resourceType: 'test-resource-1',
                    attributes: {},
                  },
                },
                {
                  id: '234',
                  resourceRef: 'test/resource',
                  permission: {
                    type: 'resource',
                    name: 'test.permission',
                    resourceType: 'test-resource-1',
                    attributes: {},
                  },
                },
              ],
            });

          expect(mockApplyConditions).toHaveBeenCalledWith(
            'test-plugin',
            mockCredentials.user(),
            [
              expect.objectContaining({
                id: '123',
                resourceType: 'test-resource-1',
                resourceRef: 'test/resource',
                conditions: { rule: 'test-rule', params },
              }),
              expect.objectContaining({
                id: '234',
                resourceType: 'test-resource-1',
                resourceRef: 'test/resource',
                conditions: { rule: 'test-rule', params },
              }),
            ],
          );

          expect(response.status).toEqual(200);
          expect(response.body).toEqual({
            items: [
              {
                id: '123',
                result,
              },
              {
                id: '234',
                result,
              },
            ],
          });
        },
      );
    });

    it.each([
      undefined,
      '',
      {},
      [
        {
          permission: {
            type: 'basic',
            name: 'test.permission',
            attributes: {},
          },
        },
      ],
      {
        items: [
          {
            permission: {
              type: 'basic',
              name: 'test.permission',
              attributes: {},
            },
          },
        ],
      },
      { items: [{ id: '123' }] },
      {
        items: [
          {
            id: '123',
            permission: { name: 'test.permission', attributes: {} },
          },
        ],
      },
      { items: [{ id: '123', permission: { type: 'basic', attributes: {} } }] },
      { items: [{ id: '123', permission: { type: 'basic' } }] },
      {
        items: [
          { id: '123', permission: { attributes: { invalid: 'attribute' } } },
        ],
      },
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
        .send({
          items: [
            {
              id: '123',
              permission: {
                type: 'resource',
                name: 'test.permission',
                resourceType: 'test-resource-1',
                attributes: {},
              },
            },
          ],
        });

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
