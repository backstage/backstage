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
import { startTestBackend } from '../wiring';
import { mockServices } from './mockServices';
import { mockCredentials } from './mockCredentials';
import { Router } from 'express';
import supertest from 'supertest';

describe('MockActionsRegistry', () => {
  it('should be able to register and invoke actions', async () => {
    const registry = mockServices.actionsRegistry();

    registry.register({
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
            name: z.string(),
          }),
      },
      action: async ({ input }) => ({ output: { name: input.name } }),
    });

    const result = await registry.invoke({
      id: 'testing:test',
      input: { name: 'test' },
    });

    expect(result).toEqual({ output: { name: 'test' } });
  });

  it('should throw an error when the input is invalid to the action', async () => {
    const registry = mockServices.actionsRegistry();

    registry.register({
      name: 'test',
      title: 'Test',
      description: 'Test',
      schema: {
        input: z => z.object({ name: z.string() }),
        output: z => z.object({ name: z.string() }),
      },
      action: async ({ input }) => ({ output: { name: input.name } }),
    });

    await expect(
      registry.invoke({ id: 'testing:test', input: { name: 1 } }),
    ).rejects.toThrow('Invalid input to action "testing:test"');
  });

  it('should throw an error when the action is not found', async () => {
    const registry = mockServices.actionsRegistry();

    await expect(registry.invoke({ id: 'test' })).rejects.toThrow(
      'Action "test" not found, available actions: none',
    );
  });

  it('should throw an error when the action is not found with recommended actions', async () => {
    const registry = mockServices.actionsRegistry();

    registry.register({
      name: 'test',
      title: 'Test',
      description: 'Test',
      schema: {
        input: z => z.object({ name: z.string() }),
        output: z => z.object({ name: z.string() }),
      },
      action: async ({ input }) => ({ output: { name: input.name } }),
    });

    await expect(registry.invoke({ id: 'test' })).rejects.toThrow(
      'Action "test" not found, available actions: "testing:test"',
    );
  });

  it('should throw an error when the output is invalid', async () => {
    const registry = mockServices.actionsRegistry();

    registry.register({
      name: 'test',
      title: 'Test',
      description: 'Test',
      schema: {
        input: z => z.object({ name: z.number() }),
        output: z => z.object({ name: z.string() }),
      },
      // @ts-expect-error - we want to test the error case
      action: async ({ input }) => ({ output: { name: input.name } }),
    });

    await expect(
      registry.invoke({ id: 'testing:test', input: { name: 1 } }),
    ).rejects.toThrow('Invalid output from action "testing:test"');
  });

  it('should list the actions correctly', async () => {
    const registry = mockServices.actionsRegistry();

    registry.register({
      name: 'test',
      title: 'Test',
      description: 'Test',
      schema: {
        input: z => z.object({ name: z.string() }),
        output: z => z.object({ name: z.string() }),
      },
      action: async ({ input }) => ({ output: { name: input.name } }),
    });

    const result = await registry.list();

    expect(result).toMatchObject({
      actions: [
        {
          id: 'testing:test',
          name: 'test',
          title: 'Test',
          description: 'Test',
          attributes: {
            destructive: false,
            idempotent: false,
            readOnly: false,
          },
          schema: {
            input: {
              type: 'object',
              properties: {
                name: { type: 'string' },
              },
            },
            output: {
              type: 'object',
              properties: {
                name: { type: 'string' },
              },
            },
          },
        },
      ],
    });
  });

  describe('mockServices.actions + mockService.actionsRegistry', () => {
    it('should be able to register and invoke actions', async () => {
      const pluginWithAction = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: { actionsRegistry: coreServices.actionsRegistry },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z => z.object({ name: z.string() }),
                  output: z => z.object({ name: z.string() }),
                },
                action: async ({ input }) => {
                  expect(input).toEqual({ name: 'test' });
                  return { output: { name: input.name } };
                },
              });
            },
          });
        },
      });

      const pluginToCallAction = createBackendPlugin({
        pluginId: 'my-plugin-to-call-action',
        register(reg) {
          reg.registerInit({
            deps: {
              actions: coreServices.actions,
              router: coreServices.httpRouter,
            },
            async init({ actions, router }) {
              const testRouter = Router();
              router.use(testRouter);

              testRouter.post('/test', async (_, res) => {
                const { output } = await actions.invoke({
                  id: 'my-plugin:test',
                  input: { name: 'test' },
                  credentials: mockCredentials.service(),
                });

                res.json(output);
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginWithAction, pluginToCallAction],
      });

      const { body, status } = await supertest(server).post(
        '/api/my-plugin-to-call-action/test',
      );

      expect(status).toBe(200);
      expect(body).toEqual({ name: 'test' });
    });
  });
});
