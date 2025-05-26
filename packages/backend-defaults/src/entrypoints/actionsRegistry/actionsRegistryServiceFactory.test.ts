/*
 * Copyright 2025 The Backstage Authors
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
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { httpRouterServiceFactory } from '../httpRouter';
import request from 'supertest';
import { actionsRegistryServiceFactory } from './actionsRegistryServiceFactory';

describe('actionsRegistryServiceFactory', () => {
  const defaultServices = [
    actionsRegistryServiceFactory,
    httpRouterServiceFactory,
    mockServices.httpAuth.factory({
      defaultCredentials: mockCredentials.user(),
    }),
  ];

  describe('typescript tests', () => {
    it('should properly infer the input types', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: coreServices.actionsRegistry,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z =>
                    z.object({
                      test: z.string(),
                    }),
                  output: z =>
                    z.object({
                      ok: z.boolean(),
                    }),
                },
                action: async ({ input: { test } }) => {
                  // @ts-expect-error - test is not a boolean
                  const _t: boolean = test;
                  return { ok: true };
                },
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });

    it('should properly infer the output types', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: coreServices.actionsRegistry,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z =>
                    z.object({
                      test: z.string(),
                    }),
                  output: z =>
                    z.object({
                      ok: z.boolean(),
                    }),
                },
                // @ts-expect-error - ok is not a boolean
                action: async () => {
                  return { ok: 'bo' };
                },
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });
  });

  describe('/.backstage/v1/actions', () => {
    it('should allow registering of actions', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: coreServices.actionsRegistry,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z =>
                    z.object({
                      name: z.string(),
                    }),
                  output: z =>
                    z.object({
                      ok: z.boolean(),
                    }),
                },
                action: async () => ({ ok: true }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            title: 'Test',
            description: 'Test',
            schema: {
              input: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                },
              },
              output: {
                type: 'object',
                properties: {
                  ok: {
                    type: 'boolean',
                  },
                },
              },
            },
          },
        ],
      });
    });

    it('should allow registering of actions with no schema', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: coreServices.actionsRegistry,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                action: async () => ({ ok: true }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            title: 'Test',
            description: 'Test',
            schema: {
              input: {},
              output: {},
            },
          },
        ],
      });
    });
  });

  describe('/.backstage/v1/actions/:actionId/invoke', () => {
    const mockAction = jest.fn();

    beforeEach(() => {
      mockAction.mockResolvedValue({ ok: true });
    });

    const pluginSubject = createBackendPlugin({
      pluginId: 'my-plugin',
      register(reg) {
        reg.registerInit({
          deps: {
            actionsRegistry: coreServices.actionsRegistry,
          },
          async init({ actionsRegistry }) {
            actionsRegistry.register({
              name: 'test',
              title: 'Test',
              description: 'Test',
              schema: {
                input: z =>
                  z.object({
                    name: z.string(),
                  }),
                output: z =>
                  z.object({
                    ok: z.boolean(),
                  }),
              },
              action: mockAction,
            });
          },
        });
      },
    });

    it('should throw an error if the action is not found', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).post(
        '/api/my-plugin/.backstage/v1/actions/test/invoke',
      );

      expect(status).toBe(404);
      expect(body).toMatchObject({
        error: {
          message: 'Action "test" not found',
        },
      });
    });

    it('should throw an error if the action input does not match the schema', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server)
        .post('/api/my-plugin/.backstage/v1/actions/my-plugin:test/invoke')
        .send({
          name: 123,
        });

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: {
          message: expect.stringMatching(
            'Invalid input to action "my-plugin:test"',
          ),
        },
      });
    });

    it('should call the action with the input', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      await request(server)
        .post('/api/my-plugin/.backstage/v1/actions/my-plugin:test/invoke')
        .send({
          name: 'test',
        });

      expect(mockAction).toHaveBeenCalledWith({
        input: {
          name: 'test',
        },
        credentials: {
          $$type: '@backstage/BackstageCredentials',
          principal: {
            type: 'user',
            userEntityRef: 'user:default/mock',
          },
        },
        logger: expect.anything(),
      });
    });

    it('should validate the output of the action if provided', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      mockAction.mockResolvedValue({ ok: 'blob' });

      const { body, status } = await request(server)
        .post('/api/my-plugin/.backstage/v1/actions/my-plugin:test/invoke')
        .send({
          name: 'test',
        });

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: {
          message: expect.stringMatching(
            'Invalid output from action "my-plugin:test"',
          ),
        },
      });
    });

    it('should return the output of the action', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server)
        .post('/api/my-plugin/.backstage/v1/actions/my-plugin:test/invoke')
        .send({
          name: 'test',
        });

      expect(status).toBe(200);
      expect(body).toMatchObject({ response: { ok: true } });
    });
  });
});
