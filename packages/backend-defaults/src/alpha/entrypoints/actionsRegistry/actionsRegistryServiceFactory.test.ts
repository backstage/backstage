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
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { httpRouterServiceFactory } from '../../../entrypoints/httpRouter';
import request from 'supertest';
import { actionsRegistryServiceFactory } from './actionsRegistryServiceFactory';
import { InputError } from '@backstage/errors';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

describe('actionsRegistryServiceFactory', () => {
  const defaultServices = [
    actionsRegistryServiceFactory,
    httpRouterServiceFactory,
    mockServices.httpAuth.factory({
      defaultCredentials: mockCredentials.service('user:default/mock'),
    }),
  ];

  describe('typescript tests', () => {
    it('should properly infer the input types', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
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
                  return { output: { ok: true } };
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
              actionsRegistry: actionsRegistryServiceRef,
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
                  return { output: { ok: 'bo' } };
                },
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });
  });

  describe('/.backstage/actions/v1/actions', () => {
    it('should allow registering of actions', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
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
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
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

    it('should set default attributes', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            attributes: {
              destructive: true,
              idempotent: false,
              readOnly: false,
            },
          },
        ],
      });
    });

    it('should allow setting attributes', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                attributes: {
                  destructive: false,
                  idempotent: true,
                  readOnly: true,
                },
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            title: 'Test',
            description: 'Test',
            attributes: {
              destructive: false,
              idempotent: true,
              readOnly: true,
            },
          },
        ],
      });
    });

    it('should forces registration of input and output schema as objects', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  // @ts-expect-error - z.undefined is not a valid schema
                  input: z => z.undefined(),
                  // @ts-expect-error - z.string is not a valid schema
                  output: z => z.string(),
                },
                // @ts-expect-error - output is not a valid, needs to be an object
                action: async () => ({ output: 'ok' }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
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

  describe('/.backstage/actions/v1/actions/:actionId/invoke', () => {
    const mockAction = jest.fn();

    beforeEach(() => {
      mockAction.mockResolvedValue({ output: { ok: true } });
    });

    const pluginSubject = createBackendPlugin({
      pluginId: 'my-plugin',
      register(reg) {
        reg.registerInit({
          deps: {
            actionsRegistry: actionsRegistryServiceRef,
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
        '/api/my-plugin/.backstage/actions/v1/actions/test/invoke',
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
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
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
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
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
            type: 'service',
            subject: 'user:default/mock',
          },
        },
        logger: expect.anything(),
      });
    });

    it('should throw an error if the action is invoked by a user', async () => {
      const testServices = [
        actionsRegistryServiceFactory,
        httpRouterServiceFactory,
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.user(),
        }),
      ];

      const { server } = await startTestBackend({
        features: [pluginSubject, ...testServices],
      });

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(403);
      expect(body).toMatchObject({
        error: {
          message: 'Actions must be invoked by a service, not a user',
        },
      });
    });

    it('should validate the output of the action if provided', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      mockAction.mockResolvedValue({ ok: 'blob' });

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
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
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(200);
      expect(body).toMatchObject({ output: { ok: true } });
    });

    it('should return the error from the action if it throws', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      mockAction.mockRejectedValue(new InputError('test'));

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: {
          message: expect.stringContaining(
            'Failed execution of action "my-plugin:test"',
          ),
        },
      });
    });
  });
});
