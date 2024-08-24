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

import { ServerPermissionClient } from './ServerPermissionClient';
import {
  IdentifiedPermissionMessage,
  AuthorizeResult,
  createPermission,
  DefinitivePolicyDecision,
  ConditionalPolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  mockCredentials,
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { setupServer } from 'msw/node';
import { RestContext, rest } from 'msw';

const server = setupServer();

const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';

const testBasicPermission = createPermission({
  name: 'test.permission',
  attributes: {
    action: 'create',
  },
});

const testResourcePermission = createPermission({
  name: 'test.permission-2',
  attributes: {},
  resourceType: 'resource-type',
});

const config = new ConfigReader({
  permission: { enabled: true },
  backend: { auth: { keys: [{ secret: 'a-secret-key' }] } },
});

describe('ServerPermissionClient', () => {
  registerMswTestHooks(server);

  const discovery = mockServices.discovery.mock();

  discovery.getBaseUrl.mockResolvedValue(mockBaseUrl);
  discovery.getExternalBaseUrl.mockResolvedValue(mockBaseUrl);

  describe('authorize', () => {
    let mockAuthorizeHandler: jest.Mock;

    beforeEach(() => {
      mockAuthorizeHandler = jest.fn((req, res, { json }: RestContext) => {
        const responses = req.body.items.map(
          (r: IdentifiedPermissionMessage<DefinitivePolicyDecision>) => ({
            id: r.id,
            result: AuthorizeResult.ALLOW,
          }),
        );

        return res(json({ items: responses }));
      });

      server.use(rest.post(`${mockBaseUrl}/authorize`, mockAuthorizeHandler));
    });

    it('should bypass the permission backend if permissions are disabled', async () => {
      const client = ServerPermissionClient.fromConfig(new ConfigReader({}), {
        discovery,
        auth: mockServices.auth(),
      });

      await client.authorize(
        [
          {
            permission: testBasicPermission,
          },
        ],
        { credentials: mockCredentials.none() },
      );

      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });

    it('should bypass the permission backend if permissions are enabled and request has valid server credentials', async () => {
      const client = ServerPermissionClient.fromConfig(config, {
        discovery,
        auth: mockServices.auth(),
      });

      await client.authorize([{ permission: testBasicPermission }], {
        credentials: mockCredentials.service(),
      });

      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });

    it('should call the permission backend if permissions are enabled and request does not have valid server credentials', async () => {
      const client = ServerPermissionClient.fromConfig(config, {
        discovery,
        auth: mockServices.auth(),
      });

      await client.authorize([{ permission: testBasicPermission }], {
        credentials: mockCredentials.user(),
      });

      expect(mockAuthorizeHandler).toHaveBeenCalled();
      expect(
        mockAuthorizeHandler.mock.calls[0][0].headers.get('authorization'),
      ).toBe(
        mockCredentials.service.header({
          onBehalfOf: mockCredentials.user(),
          targetPluginId: 'permission',
        }),
      );
    });
  });

  describe('authorizeConditional', () => {
    let mockAuthorizeHandler: jest.Mock;

    beforeEach(() => {
      mockAuthorizeHandler = jest.fn((req, res, { json }: RestContext) => {
        const responses = req.body.items.map(
          (r: IdentifiedPermissionMessage<ConditionalPolicyDecision>) => ({
            id: r.id,
            result: AuthorizeResult.ALLOW,
          }),
        );

        return res(json({ items: responses }));
      });

      server.use(rest.post(`${mockBaseUrl}/authorize`, mockAuthorizeHandler));
    });

    it('should bypass the permission backend if permissions are disabled', async () => {
      const client = ServerPermissionClient.fromConfig(new ConfigReader({}), {
        discovery,
        auth: mockServices.auth(),
      });

      await client.authorizeConditional(
        [{ permission: testResourcePermission }],
        {
          credentials: mockCredentials.none(),
        },
      );

      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });

    it('should bypass the permission backend if permissions are enabled and request has valid server credentials', async () => {
      const client = ServerPermissionClient.fromConfig(config, {
        discovery,
        auth: mockServices.auth(),
      });

      await client.authorizeConditional(
        [{ permission: testResourcePermission }],
        {
          credentials: mockCredentials.service(),
        },
      );

      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });

    it('should call the permission backend if permissions are enabled and request does not have valid server credentials', async () => {
      const client = ServerPermissionClient.fromConfig(config, {
        discovery,
        auth: mockServices.auth(),
      });

      await client.authorizeConditional(
        [{ permission: testResourcePermission }],
        {
          credentials: mockCredentials.user(),
        },
      );

      expect(mockAuthorizeHandler).toHaveBeenCalled();
      expect(
        mockAuthorizeHandler.mock.calls[0][0].headers.get('authorization'),
      ).toBe(
        mockCredentials.service.header({
          onBehalfOf: mockCredentials.user(),
          targetPluginId: 'permission',
        }),
      );
    });
  });

  describe('with access restrictions', () => {
    it.each([{ enabled: true }, { enabled: false }])(
      'short circuits the response when using a service principal, applying the relevant access restrictions if present, when permissions %p',
      async permissionConfig => {
        const client = ServerPermissionClient.fromConfig(
          new ConfigReader({
            permission: permissionConfig,
          }),
          {
            discovery,
            auth: mockServices.auth(),
          },
        );

        // no restrictions for the given plugin
        await expect(
          client.authorize(
            [
              {
                permission: createPermission({
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {}),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.ALLOW }]);
        await expect(
          client.authorizeConditional(
            [
              {
                resourceRef: undefined as any,
                permission: createPermission({
                  resourceType: 'test',
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {}),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.ALLOW }]);

        // matching permission name
        await expect(
          client.authorize(
            [
              {
                permission: createPermission({
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionNames: ['test.permission', 'other'],
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.ALLOW }]);
        await expect(
          client.authorizeConditional(
            [
              {
                resourceRef: undefined as any,
                permission: createPermission({
                  resourceType: 'test',
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionNames: ['test.permission', 'other'],
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.ALLOW }]);

        // matching attributes
        await expect(
          client.authorize(
            [
              {
                permission: createPermission({
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionAttributes: {
                  action: ['create', 'other' as any],
                },
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.ALLOW }]);
        await expect(
          client.authorizeConditional(
            [
              {
                resourceRef: undefined as any,
                permission: createPermission({
                  resourceType: 'test',
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionAttributes: {
                  action: ['create', 'other' as any],
                },
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.ALLOW }]);

        // matching permission name but not attributes
        await expect(
          client.authorize(
            [
              {
                permission: createPermission({
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionNames: ['test.permission'],
                permissionAttributes: {
                  action: ['other' as any],
                },
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.DENY }]);
        await expect(
          client.authorizeConditional(
            [
              {
                resourceRef: undefined as any,
                permission: createPermission({
                  resourceType: 'test',
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionNames: ['test.permission'],
                permissionAttributes: {
                  action: ['other' as any],
                },
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.DENY }]);

        // matching attributes but not permission name
        await expect(
          client.authorize(
            [
              {
                permission: createPermission({
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionNames: ['wrong-name'],
                permissionAttributes: {
                  action: ['create'],
                },
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.DENY }]);
        await expect(
          client.authorizeConditional(
            [
              {
                resourceRef: undefined as any,
                permission: createPermission({
                  resourceType: 'test',
                  name: 'test.permission',
                  attributes: {
                    action: 'create',
                  },
                }),
              },
            ],
            {
              credentials: mockCredentials.service('foo', {
                permissionNames: ['wrong-name'],
                permissionAttributes: {
                  action: ['create'],
                },
              }),
            },
          ),
        ).resolves.toEqual([{ result: AuthorizeResult.DENY }]);
      },
    );
  });
});
