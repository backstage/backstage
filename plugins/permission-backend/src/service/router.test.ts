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
import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
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
          ? AuthorizeResult.ALLOW
          : AuthorizeResult.DENY,
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
      systemMetadata: { getInstalledPlugins: async () => [] },
      ownPluginId: 'permission',
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

    it('calls the permission policy with batched resourceRef as an array', async () => {
      policy.handle.mockResolvedValueOnce({
        result: AuthorizeResult.CONDITIONAL,
        pluginId: 'test-plugin',
        resourceType: 'test-resource-1',
        conditions: { rule: 'test-rule', params: ['abc'] },
      });

      mockApplyConditions.mockResolvedValueOnce([
        {
          id: '123',
          result: [AuthorizeResult.ALLOW, AuthorizeResult.DENY],
        },
      ]);

      const response = await request(app)
        .post('/authorize')
        .send({
          items: [
            {
              id: '123',
              permission: {
                type: 'resource',
                name: 'test.permission1',
                attributes: {},
                resourceType: 'test-resource-1',
              },
              resourceRef: ['resource:1', 'resource:2'],
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

      expect(mockApplyConditions).toHaveBeenCalledWith(
        'test-plugin',
        expect.any(Object),
        [
          {
            conditions: { params: ['abc'], rule: 'test-rule' },
            id: '123',
            pluginId: 'test-plugin',
            resourceRef: ['resource:1', 'resource:2'],
            resourceType: 'test-resource-1',
            result: 'CONDITIONAL',
          },
        ],
      );

      expect(response.status).toEqual(200);

      expect(policy.handle).toHaveBeenCalledWith(
        {
          permission: {
            type: 'resource',
            name: 'test.permission1',
            attributes: {},
            resourceType: 'test-resource-1',
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

      expect(policy.handle).toHaveBeenCalledTimes(2);

      expect(response.body).toEqual({
        items: [
          { id: '123', result: [AuthorizeResult.ALLOW, AuthorizeResult.DENY] },
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
          .auth(userTokenIssuedByService(), {
            type: 'bearer',
          })
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

      it('leaves conditional results without resourceRef unchanged', async () => {
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
          .auth(userTokenIssuedByService(), { type: 'bearer' })
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
          mockCredentials.user('user:default/spiderman', {
            actor: { subject: 'some-service' },
          }),
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
          mockCredentials.user('user:default/spiderman', {
            actor: { subject: 'some-service' },
          }),
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

      function userTokenIssuedByService() {
        return mockCredentials.user.token('user:default/spiderman', {
          actor: { subject: 'some-service' },
        });
      }
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
      {
        items: [
          {
            id: '123',
            // basic permission can't have resourceRef
            resourceRef: 'resource:1',
            permission: {
              type: 'basic',
              name: 'test.permission',
              attributes: {},
            },
          },
        ],
      },
      {
        items: [
          {
            id: '123',
            resourceRef: ['resource:1'],
            permission: {
              type: 'basic',
              name: 'test.permission',
              attributes: {},
            },
          },
        ],
      },
      {
        items: [
          {
            id: '123',
            resourceRef: [],
            permission: {
              type: 'resource',
              name: 'test.permission',
              attributes: {},
              resourceType: 'test-resource-1',
            },
          },
        ],
      },
    ])('returns a 400 error for invalid request %o', async requestBody => {
      const response = await request(app).post('/authorize').send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.error.name).toEqual('InputError');
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
              resourceRef: 'resource:1',
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

    it(`returns a 400 error if the request doesn't contain resourceRef for credentials not issued by a service`, async () => {
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

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            message: expect.stringMatching(
              /Resource permissions require a resourceRef to be set/i,
            ),
          }),
        }),
      );
    });
  });
});

describe('GET /.well-known/backstage/permissions/installed', () => {
  const installedPath = '/.well-known/backstage/permissions/installed';
  const fetchSpy = jest.spyOn(globalThis, 'fetch');
  const logger = mockServices.logger.mock();

  type MetadataPayload = {
    permissions?: Array<{
      type: 'basic' | 'resource';
      name: string;
      attributes: { action?: string };
      resourceType?: string;
    }>;
  };

  const buildApp = async (
    pluginIds: string[],
    payloads: Record<string, MetadataPayload | { status: number } | 'reject'>,
    configOverrides: Record<string, unknown> = {},
  ) => {
    fetchSpy.mockReset();
    fetchSpy.mockImplementation(async input => {
      const url = typeof input === 'string' ? input : (input as URL).toString();
      const match = url.match(/\/api\/([^/]+)\/\.well-known/);
      const pluginId = match?.[1] ?? '';
      const payload = payloads[pluginId];
      if (payload === 'reject') {
        throw new Error('boom');
      }
      if (payload && 'status' in payload) {
        return new Response(null, { status: payload.status });
      }
      return new Response(JSON.stringify({ rules: [], ...(payload ?? {}) }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });

    const router = await createRouter({
      config: new ConfigReader({
        permission: { enabled: true, ...configOverrides },
      }),
      logger,
      discovery: mockServices.discovery(),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth({
        defaultCredentials: mockCredentials.user(),
      }),
      userInfo: mockServices.userInfo(),
      policy,
      systemMetadata: {
        getInstalledPlugins: async () =>
          pluginIds.map(pluginId => ({ pluginId })),
      },
      ownPluginId: 'permission',
    });
    router.use(middleware.error());
    return express().use(router);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty plugins list when nothing is installed', async () => {
    const app = await buildApp([], {});
    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ plugins: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('aggregates permissions across plugins in deterministic order', async () => {
    const app = await buildApp(['scaffolder', 'catalog'], {
      catalog: {
        permissions: [
          {
            type: 'basic',
            name: 'catalog.entity.create',
            attributes: { action: 'create' },
          },
          {
            type: 'resource',
            name: 'catalog.entity.read',
            attributes: { action: 'read' },
            resourceType: 'catalog-entity',
          },
        ],
      },
      scaffolder: {
        permissions: [
          {
            type: 'basic',
            name: 'scaffolder.task.create',
            attributes: { action: 'create' },
          },
        ],
      },
    });

    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(200);
    expect(response.body.plugins.map((p: any) => p.pluginId)).toEqual([
      'catalog',
      'scaffolder',
    ]);
    const catalog = response.body.plugins[0];
    expect(catalog.permissions).toEqual([
      {
        type: 'basic',
        name: 'catalog.entity.create',
        attributes: { action: 'create' },
      },
      {
        type: 'resource',
        name: 'catalog.entity.read',
        attributes: { action: 'read' },
        resourceType: 'catalog-entity',
      },
    ]);
  });

  it('drops plugins that respond with 404 without warning', async () => {
    const app = await buildApp(['catalog', 'unmounted'], {
      catalog: {
        permissions: [
          { type: 'basic', name: 'a', attributes: { action: 'read' } },
        ],
      },
      unmounted: { status: 404 },
    });

    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(200);
    expect(response.body.plugins).toEqual([
      {
        pluginId: 'catalog',
        permissions: [
          { type: 'basic', name: 'a', attributes: { action: 'read' } },
        ],
      },
      { pluginId: 'unmounted', permissions: [] },
    ]);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('skips fanning out to its own pluginId', async () => {
    const app = await buildApp(['catalog', 'permission'], {
      catalog: {
        permissions: [
          { type: 'basic', name: 'a', attributes: { action: 'read' } },
        ],
      },
      // No 'permission' payload — fetch would return an unknown-plugin response
      // if it were called, which it must not be.
    });

    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(200);
    expect(
      response.body.plugins.map((p: { pluginId: string }) => p.pluginId),
    ).toEqual(['catalog']);
    // Only one fan-out call: catalog. No call for the own 'permission' plugin.
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toEqual(
      expect.stringContaining('/api/catalog/'),
    );
  });

  it('drops plugins that throw and logs a warning', async () => {
    const app = await buildApp(['catalog', 'flaky'], {
      catalog: {
        permissions: [
          { type: 'basic', name: 'a', attributes: { action: 'read' } },
        ],
      },
      flaky: 'reject',
    });

    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(200);
    expect(response.body.plugins.map((p: any) => p.pluginId)).toEqual([
      'catalog',
      'flaky',
    ]);
    expect(response.body.plugins[1].permissions).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`'flaky'`),
      expect.objectContaining({ error: expect.stringContaining('boom') }),
    );
  });

  it('dedupes permission name collisions deterministically and warns', async () => {
    const app = await buildApp(['plugin-b', 'plugin-a'], {
      'plugin-a': {
        permissions: [
          {
            type: 'basic',
            name: 'shared.name',
            attributes: { action: 'read' },
          },
        ],
      },
      'plugin-b': {
        permissions: [
          {
            type: 'basic',
            name: 'shared.name',
            attributes: { action: 'create' },
          },
        ],
      },
    });

    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(200);
    // Sorted plugin ids: plugin-a wins, plugin-b's duplicate is dropped.
    expect(response.body.plugins[0].permissions).toHaveLength(1);
    expect(response.body.plugins[0].permissions[0].attributes.action).toBe(
      'read',
    );
    expect(response.body.plugins[1].permissions).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`Duplicate permission name 'shared.name'`),
    );
  });

  it('returns 404 and never fans out when permission.installedPermissions.enabled is false', async () => {
    const app = await buildApp(
      ['catalog'],
      {
        catalog: {
          permissions: [
            { type: 'basic', name: 'a', attributes: { action: 'read' } },
          ],
        },
      },
      { installedPermissions: { enabled: false } },
    );

    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(404);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('caches the aggregated result on success', async () => {
    const app = await buildApp(['catalog'], {
      catalog: {
        permissions: [
          { type: 'basic', name: 'a', attributes: { action: 'read' } },
        ],
      },
    });

    await request(app).get(installedPath);
    await request(app).get(installedPath);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('round-trips Permission objects produced by createPermission() — basic with attributes and resource permissions — without losing fields', async () => {
    // Use the real public helper rather than literals so we catch any drift
    // between createPermission() output and the wire format.
    const catalogCreate = createPermission({
      name: 'catalog.entity.create',
      attributes: { action: 'create' },
    });
    const catalogRead = createPermission({
      name: 'catalog.entity.read',
      attributes: { action: 'read' },
      resourceType: 'catalog-entity',
    });
    const catalogUpdate = createPermission({
      name: 'catalog.entity.update',
      attributes: { action: 'update' },
      resourceType: 'catalog-entity',
    });
    const catalogDelete = createPermission({
      name: 'catalog.entity.delete',
      attributes: { action: 'delete' },
      resourceType: 'catalog-entity',
    });
    const scaffolderExecute = createPermission({
      name: 'scaffolder.task.create',
      attributes: { action: 'create' },
    });

    const app = await buildApp(['catalog', 'scaffolder'], {
      catalog: {
        permissions: [catalogCreate, catalogRead, catalogUpdate, catalogDelete],
      },
      scaffolder: { permissions: [scaffolderExecute] },
    });

    const response = await request(app).get(installedPath);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      plugins: [
        {
          pluginId: 'catalog',
          permissions: [
            catalogCreate,
            catalogRead,
            catalogUpdate,
            catalogDelete,
          ],
        },
        {
          pluginId: 'scaffolder',
          permissions: [scaffolderExecute],
        },
      ],
    });
    // Spot-check the discriminator fields explicitly so a future refactor of
    // createPermission can't quietly drop attributes or resourceType from the
    // wire format.
    const flat = response.body.plugins.flatMap((p: any) => p.permissions);
    expect(flat).toHaveLength(5);
    for (const permission of flat) {
      expect(permission.attributes).toBeDefined();
      expect(typeof permission.attributes.action).toBe('string');
    }
    const resourcePerms = flat.filter((p: any) => p.type === 'resource');
    expect(resourcePerms).toHaveLength(3);
    for (const permission of resourcePerms) {
      expect(permission.resourceType).toBe('catalog-entity');
    }
  });
});
