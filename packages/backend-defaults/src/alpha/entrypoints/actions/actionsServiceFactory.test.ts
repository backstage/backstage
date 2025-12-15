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
  mockCredentials,
  mockServices,
  registerMswTestHooks,
  ServiceFactoryTester,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { actionsRegistryServiceFactory } from '../actionsRegistry';
import { httpRouterServiceFactory } from '../../../entrypoints/httpRouter';
import { actionsServiceFactory } from './actionsServiceFactory';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { json } from 'express';
import Router from 'express-promise-router';
import request from 'supertest';
import { ActionsServiceAction } from '@backstage/backend-plugin-api/alpha';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { actionsServiceRef } from '@backstage/backend-plugin-api/alpha';

const server = setupServer();

describe('actionsServiceFactory', () => {
  describe('client', () => {
    registerMswTestHooks(server);
    const mockActionsListEndpoint = jest.fn();
    const mockNotFoundActionsListEndpoint = jest.fn();

    const defaultServices = [
      mockServices.rootConfig.factory({
        data: {
          backend: {
            actions: {
              pluginSources: ['my-plugin', 'not-found-plugin'],
            },
          },
        },
      }),
      actionsServiceFactory,
      httpRouterServiceFactory,
      mockServices.httpAuth.factory({
        defaultCredentials: mockCredentials.service('user:default/mock'),
      }),
      mockServices.discovery.factory(),
      actionsRegistryServiceFactory,
    ];

    const mockActionsDefinition: ActionsServiceAction = {
      description: 'my mock description',
      id: 'my-plugin:test',
      name: 'testy',
      title: 'Test',
      schema: {
        input: {},
        output: {},
      },
      attributes: {
        destructive: false,
        idempotent: false,
        readOnly: false,
      },
    };

    beforeEach(() => {
      server.use(
        http.get(
          'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
          mockActionsListEndpoint.mockImplementation(() =>
            HttpResponse.json({
              actions: [mockActionsDefinition],
            }),
          ),
        ),
        http.get(
          'http://localhost:0/api/not-found-plugin/.backstage/actions/v1/actions',
          mockNotFoundActionsListEndpoint.mockImplementation(
            () => new HttpResponse(null, { status: 404 }),
          ),
        ),
      );
    });

    describe('list', () => {
      it('should list all plugins in config to find actions and handle failures gracefully', async () => {
        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions).toEqual([mockActionsDefinition]);

        expect(mockActionsListEndpoint).toHaveBeenCalledTimes(1);
        expect(mockNotFoundActionsListEndpoint).toHaveBeenCalledTimes(1);
      });
    });

    describe('invoke', () => {
      it('should invoke the action and return the output', async () => {
        server.use(
          http.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            () => HttpResponse.json({ output: { ok: true } }),
          ),
        );
        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        const { output } = await subject.invoke({
          id: 'my-plugin:test',
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(output).toEqual({ ok: true });
      });

      it('should throw a 404 if the action does not exist', async () => {
        server.use(
          http.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            () => new HttpResponse(null, { status: 404 }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        await expect(
          subject.invoke({
            id: 'my-plugin:test',
            credentials: mockCredentials.service('user:default/mock'),
          }),
        ).rejects.toThrow('404');
      });

      it('should throw a 400 if the action returns an invalid input', async () => {
        server.use(
          http.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            () => new HttpResponse(null, { status: 400 }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        await expect(
          subject.invoke({
            id: 'my-plugin:test',
            credentials: mockCredentials.service('user:default/mock'),
          }),
        ).rejects.toThrow('400');
      });
    });

    describe('integration', () => {
      beforeAll(() => {
        // disable the msw server for this test.
        server.close();
      });

      const features = [
        actionsServiceFactory,
        httpRouterServiceFactory,
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.service('user:default/mock'),
        }),
        actionsRegistryServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              actions: { pluginSources: ['plugin-with-action'] },
            },
          },
        }),

        createBackendPlugin({
          pluginId: 'plugin-with-action',
          register({ registerInit }) {
            registerInit({
              deps: { actionsRegistry: actionsRegistryServiceRef },
              async init({ actionsRegistry }) {
                actionsRegistry.register({
                  name: 'with-validation',
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
                        string: z.string(),
                      }),
                  },
                  action: async ({ input }) => {
                    return {
                      output: {
                        ok: true,
                        string: `hello ${input.name}`,
                      },
                    };
                  },
                });
              },
            });
          },
        }),
        createBackendPlugin({
          pluginId: 'test-harness',
          register({ registerInit }) {
            registerInit({
              deps: {
                actionsService: actionsServiceRef,
                router: coreServices.httpRouter,
                httpAuth: coreServices.httpAuth,
              },
              async init({ actionsService, router, httpAuth }) {
                const innerRouter = Router();
                innerRouter.use(json());
                router.use(innerRouter);

                innerRouter.post('/invoke', async (req, res) => {
                  const { id, input } = req.body;
                  const response = await actionsService.invoke({
                    id,
                    input,
                    credentials: await httpAuth.credentials(req),
                  });
                  res.json(response);
                });

                innerRouter.get('/actions', async (req, res) => {
                  const response = await actionsService.list({
                    credentials: await httpAuth.credentials(req),
                  });

                  res.json(response);
                });
              },
            });
          },
        }),
      ];

      it('should list the actions and return the output', async () => {
        const { server: testHarnessServer } = await startTestBackend({
          features,
        });

        const { body, status } = await request(testHarnessServer).get(
          '/api/test-harness/actions',
        );

        expect(status).toBe(200);
        expect(body).toEqual({
          actions: [
            {
              description: 'Test',
              id: 'plugin-with-action:with-validation',
              name: 'with-validation',
              schema: {
                input: {
                  $schema: 'http://json-schema.org/draft-07/schema#',
                  additionalProperties: false,
                  properties: {
                    name: {
                      type: 'string',
                    },
                  },
                  required: ['name'],
                  type: 'object',
                },
                output: {
                  $schema: 'http://json-schema.org/draft-07/schema#',
                  additionalProperties: false,
                  properties: {
                    ok: {
                      type: 'boolean',
                    },
                    string: {
                      type: 'string',
                    },
                  },
                  required: ['ok', 'string'],
                  type: 'object',
                },
              },
              attributes: {
                destructive: true,
                idempotent: false,
                readOnly: false,
              },
              title: 'Test',
            },
          ],
        });
      });

      it('should invoke the action and return the output', async () => {
        const { server: testHarnessServer } = await startTestBackend({
          features,
        });

        const { body, status } = await request(testHarnessServer)
          .post('/api/test-harness/invoke')
          .send({
            id: 'plugin-with-action:with-validation',
            input: {
              name: 'world',
            },
          });

        expect(body).toEqual({ output: { ok: true, string: 'hello world' } });
        expect(status).toBe(200);
      });
    });
  });
});
