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
  Permission,
  createPermission,
} from '@backstage/plugin-permission-common';
import {
  ApplyConditionsRequestEntry,
  ApplyConditionsResponseEntry,
} from '@backstage/plugin-permission-node';
import { RootPermissionsRegistryService } from '@backstage/backend-plugin-api/alpha';
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

function createMockRegistry(
  permissions: Record<string, Permission> = {},
): RootPermissionsRegistryService {
  return {
    addPermissions: jest.fn(),
    getPermission: name => permissions[name],
    listPermissions: () =>
      Object.entries(permissions).map(([_, permission]) => ({
        pluginId: 'test',
        permission,
      })),
  };
}

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
      permissionsRegistry: createMockRegistry(),
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
            { id: '123', result },
            { id: '234', result },
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

          expect(response.status).toEqual(200);
          expect(response.body).toEqual({
            items: [
              { id: '123', result },
              { id: '234', result },
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

describe('POST /authorize/by-name', () => {
  const logger = mockServices.logger.mock();

  beforeEach(() => {
    // Earlier `/authorize` tests set sticky `mockResolvedValue` returns on the
    // shared `policy.handle` mock; `clearAllMocks` only clears call history,
    // not implementations. Re-establish the identity-based default so the
    // by-name tests start from a known state.
    policy.handle.mockReset();
    policy.handle.mockImplementation(async (_req, identity) => {
      if (identity) {
        return { result: AuthorizeResult.ALLOW };
      }
      return { result: AuthorizeResult.DENY };
    });
  });

  async function buildApp(
    options: {
      permissions?: Record<string, Permission>;
      credentials?: BackstageCredentials;
    } = {},
  ) {
    const router = await createRouter({
      config: new ConfigReader({ permission: { enabled: true } }),
      logger,
      discovery: mockServices.discovery(),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth({
        defaultCredentials: options.credentials ?? mockCredentials.user(),
      }),
      userInfo: mockServices.userInfo(),
      policy,
      permissionsRegistry: createMockRegistry(options.permissions),
    });
    router.use(middleware.error());
    return express().use(router);
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('hydrates a basic permission and routes through the policy with attributes intact', async () => {
    const permission = createPermission({
      name: 'catalog.entity.create',
      attributes: { action: 'create' },
    });
    const app = await buildApp({
      permissions: { [permission.name]: permission },
    });

    const response = await request(app)
      .post('/authorize/by-name')
      .auth(mockCredentials.user.token(), { type: 'bearer' })
      .send({ items: [{ id: '1', name: permission.name }] });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      items: [{ id: '1', result: AuthorizeResult.ALLOW }],
    });
    expect(policy.handle).toHaveBeenCalledWith(
      { permission },
      expect.objectContaining({ credentials: expect.any(Object) }),
    );
  });

  it('denies unknown permission names and warns', async () => {
    const app = await buildApp({ permissions: {} });

    const response = await request(app)
      .post('/authorize/by-name')
      .auth(mockCredentials.user.token(), { type: 'bearer' })
      .send({ items: [{ id: '1', name: 'unknown.permission' }] });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      items: [{ id: '1', result: AuthorizeResult.DENY }],
    });
    expect(policy.handle).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`'unknown.permission'`),
    );
  });

  it('rejects resource permissions without a resourceRef for direct user calls', async () => {
    const permission = createPermission({
      name: 'catalog.entity.read',
      attributes: { action: 'read' },
      resourceType: 'catalog-entity',
    });
    const app = await buildApp({
      permissions: { [permission.name]: permission },
    });

    const response = await request(app)
      .post('/authorize/by-name')
      .auth(mockCredentials.user.token(), { type: 'bearer' })
      .send({ items: [{ id: '1', name: permission.name }] });

    expect(response.status).toEqual(400);
    expect(response.body.error.message).toMatch(
      /Resource permissions require a resourceRef/i,
    );
  });

  it('forwards a resource permission with resourceRef through applyConditions', async () => {
    const permission = createPermission({
      name: 'catalog.entity.read',
      attributes: { action: 'read' },
      resourceType: 'catalog-entity',
    });
    policy.handle.mockResolvedValueOnce({
      result: AuthorizeResult.CONDITIONAL,
      pluginId: 'catalog',
      resourceType: 'catalog-entity',
      conditions: { rule: 'isOwner', params: ['yes'] },
    });
    mockApplyConditions.mockResolvedValueOnce([
      { id: '1', result: AuthorizeResult.ALLOW },
    ]);

    const app = await buildApp({
      permissions: { [permission.name]: permission },
    });

    const response = await request(app)
      .post('/authorize/by-name')
      .auth(mockCredentials.user.token(), { type: 'bearer' })
      .send({
        items: [
          { id: '1', name: permission.name, resourceRef: 'entity:test/foo' },
        ],
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      items: [{ id: '1', result: AuthorizeResult.ALLOW }],
    });
    expect(mockApplyConditions).toHaveBeenCalledWith(
      'catalog',
      mockCredentials.user(),
      [
        expect.objectContaining({
          id: '1',
          resourceRef: 'entity:test/foo',
          resourceType: 'catalog-entity',
        }),
      ],
    );
  });

  it('preserves request order in the response and mixes known + unknown names', async () => {
    const known = createPermission({
      name: 'known.basic',
      attributes: { action: 'read' },
    });
    const app = await buildApp({
      permissions: { [known.name]: known },
    });

    const response = await request(app)
      .post('/authorize/by-name')
      .auth(mockCredentials.user.token(), { type: 'bearer' })
      .send({
        items: [
          { id: 'a', name: 'unknown.one' },
          { id: 'b', name: known.name },
          { id: 'c', name: 'unknown.two' },
        ],
      });

    expect(response.status).toEqual(200);
    expect(response.body.items.map((i: any) => i.id)).toEqual(['a', 'b', 'c']);
    expect(response.body.items[0].result).toBe(AuthorizeResult.DENY);
    expect(response.body.items[1].result).toBe(AuthorizeResult.ALLOW);
    expect(response.body.items[2].result).toBe(AuthorizeResult.DENY);
  });

  it('returns 400 for an invalid request body', async () => {
    const app = await buildApp();

    const response = await request(app)
      .post('/authorize/by-name')
      .auth(mockCredentials.user.token(), { type: 'bearer' })
      .send({ items: [{ id: 1, name: 42 }] });

    expect(response.status).toEqual(400);
    expect(response.body.error.name).toEqual('InputError');
  });
});
