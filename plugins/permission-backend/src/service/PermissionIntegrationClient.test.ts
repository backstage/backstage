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

import { AddressInfo } from 'net';
import { Server } from 'http';
import express, { Router, RequestHandler } from 'express';
import { RestContext, rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import {
  AuthorizeResult,
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import {
  createPermissionIntegrationRouter,
  createPermissionRule,
} from '@backstage/plugin-permission-node';
import { PermissionIntegrationClient } from './PermissionIntegrationClient';
import { z } from 'zod';

describe('PermissionIntegrationClient', () => {
  describe('applyConditions', () => {
    let server: SetupServerApi;

    const mockConditions: PermissionCriteria<PermissionCondition> = {
      not: {
        allOf: [
          { rule: 'RULE_1', resourceType: 'test-resource', params: {} },
          {
            rule: 'RULE_2',
            resourceType: 'test-resource',
            params: { foo: 'abc' },
          },
        ],
      },
    };

    const mockApplyConditionsHandler = jest.fn(
      (_req, res, { json }: RestContext) => {
        return res(
          json({ items: [{ id: '123', result: AuthorizeResult.ALLOW }] }),
        );
      },
    );

    const mockBaseUrl = 'http://backstage:9191';
    const discovery: PluginEndpointDiscovery = {
      async getBaseUrl(pluginId) {
        return `${mockBaseUrl}/${pluginId}`;
      },
      async getExternalBaseUrl() {
        throw new Error('Not implemented.');
      },
    };

    const client: PermissionIntegrationClient = new PermissionIntegrationClient(
      {
        discovery,
      },
    );

    beforeAll(() => {
      server = setupServer();
      server.listen({ onUnhandledRequest: 'error' });
      server.use(
        rest.post(
          `${mockBaseUrl}/plugin-1/.well-known/backstage/permissions/apply-conditions`,
          mockApplyConditionsHandler,
        ),
      );
    });

    afterAll(() => server.close());

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should make a POST request to the correct endpoint', async () => {
      await client.applyConditions('plugin-1', [
        {
          id: '123',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: mockConditions,
        },
      ]);

      expect(mockApplyConditionsHandler).toHaveBeenCalled();
    });

    it('should include a request body', async () => {
      await client.applyConditions('plugin-1', [
        {
          id: '123',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: mockConditions,
        },
      ]);

      expect(mockApplyConditionsHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            items: [
              {
                id: '123',
                resourceRef: 'testResource1',
                resourceType: 'test-resource',
                conditions: mockConditions,
              },
            ],
          },
        }),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should return the response from the fetch request', async () => {
      const response = await client.applyConditions('plugin-1', [
        {
          id: '123',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: mockConditions,
        },
      ]);

      expect(response).toEqual(
        expect.objectContaining([{ id: '123', result: AuthorizeResult.ALLOW }]),
      );
    });

    it('should not include authorization headers if no token is supplied', async () => {
      await client.applyConditions('plugin-1', [
        {
          id: '123',
          resourceRef: 'testResource1',
          resourceType: 'test-resource',
          conditions: mockConditions,
        },
      ]);

      const request = mockApplyConditionsHandler.mock.calls[0][0];
      expect(request.headers.has('authorization')).toEqual(false);
    });

    it('should include correctly-constructed authorization header if token is supplied', async () => {
      await client.applyConditions(
        'plugin-1',
        [
          {
            id: '123',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: mockConditions,
          },
        ],
        'Bearer fake-token',
      );

      const request = mockApplyConditionsHandler.mock.calls[0][0];
      expect(request.headers.get('authorization')).toEqual('Bearer fake-token');
    });

    it('should forward response errors', async () => {
      mockApplyConditionsHandler.mockImplementationOnce(
        (_req, res, { status }: RestContext) => {
          return res(status(401));
        },
      );

      await expect(
        client.applyConditions('plugin-1', [
          {
            id: '123',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: mockConditions,
          },
        ]),
      ).rejects.toThrow(/401/i);
    });

    it('should reject invalid responses', async () => {
      mockApplyConditionsHandler.mockImplementationOnce(
        (_req, res, { json }: RestContext) => {
          return res(
            json({ items: [{ id: '123', outcome: AuthorizeResult.ALLOW }] }),
          );
        },
      );

      await expect(
        client.applyConditions('plugin-1', [
          {
            id: '123',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: mockConditions,
          },
        ]),
      ).rejects.toThrow(/invalid input/i);
    });

    it('should batch requests to plugin backends', async () => {
      mockApplyConditionsHandler.mockImplementationOnce(
        (_req, res, { json }: RestContext) => {
          return res(
            json({
              items: [
                { id: '123', result: AuthorizeResult.ALLOW },
                { id: '456', result: AuthorizeResult.DENY },
                { id: '789', result: AuthorizeResult.ALLOW },
              ],
            }),
          );
        },
      );

      await expect(
        client.applyConditions('plugin-1', [
          {
            id: '123',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: mockConditions,
          },
          {
            id: '456',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: mockConditions,
          },
          {
            id: '789',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: mockConditions,
          },
        ]),
      ).resolves.toEqual([
        { id: '123', result: AuthorizeResult.ALLOW },
        { id: '456', result: AuthorizeResult.DENY },
        { id: '789', result: AuthorizeResult.ALLOW },
      ]);

      expect(mockApplyConditionsHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration with @backstage/plugin-permission-node', () => {
    let server: Server;
    let client: PermissionIntegrationClient;
    let routerSpy: RequestHandler;

    beforeAll(async () => {
      const router = Router();

      router.use(
        createPermissionIntegrationRouter({
          resourceType: 'test-resource',
          getResources: async resourceRefs =>
            resourceRefs.map(resourceRef => ({
              id: resourceRef,
            })),
          rules: [
            createPermissionRule({
              name: 'RULE_1',
              description: 'Test rule 1',
              resourceType: 'test-resource',
              paramsSchema: z.object({
                input: z.enum(['yes', 'no']),
              }),
              apply: (_resource, { input }) => input === 'yes',
              toQuery: () => {
                throw new Error('Not implemented');
              },
            }),
            createPermissionRule({
              name: 'RULE_2',
              description: 'Test rule 2',
              resourceType: 'test-resource',

              paramsSchema: z.object({
                input: z.enum(['yes', 'no']),
              }),
              apply: (_resource, { input }) => input === 'yes',
              toQuery: () => {
                throw new Error('Not implemented');
              },
            }),
          ],
        }),
      );

      const app = express();

      routerSpy = jest.fn(router);

      app.use('/plugin-1', routerSpy);

      await new Promise<void>(resolve => {
        server = app.listen(resolve);
      });

      const discovery: PluginEndpointDiscovery = {
        async getBaseUrl(pluginId: string) {
          const listenPort = (server.address()! as AddressInfo).port;

          return `http://0.0.0.0:${listenPort}/${pluginId}`;
        },
        async getExternalBaseUrl() {
          throw new Error('Not implemented.');
        },
      };

      client = new PermissionIntegrationClient({
        discovery,
      });
    });

    afterAll(
      async () =>
        new Promise<void>((resolve, reject) =>
          server.close(err => (err ? reject(err) : resolve())),
        ),
    );

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('works for simple conditions', async () => {
      await expect(
        client.applyConditions('plugin-1', [
          {
            id: '123',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: {
              rule: 'RULE_1',
              resourceType: 'test-resource',
              params: {
                input: 'no',
              },
            },
          },
        ]),
      ).resolves.toEqual([{ id: '123', result: AuthorizeResult.DENY }]);
    });

    it('works for complex criteria', async () => {
      await expect(
        client.applyConditions('plugin-1', [
          {
            id: '123',
            resourceRef: 'testResource1',
            resourceType: 'test-resource',
            conditions: {
              allOf: [
                {
                  allOf: [
                    {
                      rule: 'RULE_1',
                      resourceType: 'test-resource',
                      params: {
                        input: 'yes',
                      },
                    },
                    {
                      not: {
                        rule: 'RULE_2',
                        resourceType: 'test-resource',
                        params: {
                          input: 'no',
                        },
                      },
                    },
                  ],
                },
                {
                  not: {
                    allOf: [
                      {
                        rule: 'RULE_1',
                        resourceType: 'test-resource',
                        params: {
                          input: 'no',
                        },
                      },
                      {
                        rule: 'RULE_2',
                        resourceType: 'test-resource',
                        params: {
                          input: 'yes',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ]),
      ).resolves.toEqual([{ id: '123', result: AuthorizeResult.ALLOW }]);
    });
  });
});
