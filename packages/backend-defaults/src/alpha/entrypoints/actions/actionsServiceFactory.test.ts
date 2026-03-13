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
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { actionsRegistryServiceFactory } from '../actionsRegistry';
import { httpRouterServiceFactory } from '../../../entrypoints/httpRouter';
import { actionsServiceFactory } from './actionsServiceFactory';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
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
        rest.get(
          'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
          mockActionsListEndpoint.mockImplementation((_req, res, ctx) =>
            res(
              ctx.json({
                actions: [mockActionsDefinition],
              }),
            ),
          ),
        ),
        rest.get(
          'http://localhost:0/api/not-found-plugin/.backstage/actions/v1/actions',
          mockNotFoundActionsListEndpoint.mockImplementation((_req, res, ctx) =>
            res(ctx.status(404)),
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

      it('should filter actions based on include patterns', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:get-entity',
            name: 'get-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:delete-entity',
            name: 'delete-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'other-plugin:get-thing',
            name: 'get-thing',
          },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(
                ctx.json({
                  actions: multipleActions.filter(a =>
                    a.id.startsWith('my-plugin:'),
                  ),
                }),
              ),
          ),
          rest.get(
            'http://localhost:0/api/other-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(
                ctx.json({
                  actions: multipleActions.filter(a =>
                    a.id.startsWith('other-plugin:'),
                  ),
                }),
              ),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin', 'other-plugin'],
                    filter: {
                      include: [{ id: 'my-plugin:*' }],
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual([
          'my-plugin:get-entity',
          'my-plugin:delete-entity',
        ]);
      });

      it('should filter actions based on exclude patterns', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:get-entity',
            name: 'get-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:delete-entity',
            name: 'delete-entity',
          },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) => res(ctx.json({ actions: multipleActions })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      exclude: [{ id: '*:delete-*' }],
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual(['my-plugin:get-entity']);
      });

      it('should have exclude take precedence over include', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:get-entity',
            name: 'get-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:delete-entity',
            name: 'delete-entity',
          },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) => res(ctx.json({ actions: multipleActions })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      include: [{ id: 'my-plugin:*' }],
                      exclude: [{ id: 'my-plugin:delete-entity' }],
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual(['my-plugin:get-entity']);
      });

      it('should always apply exclude rules even when action matches include', async () => {
        // This tests that exclude is checked FIRST and always wins,
        // regardless of whether the action would match an include rule
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:safe-action',
            name: 'safe-action',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:dangerous-action',
            name: 'dangerous-action',
            attributes: {
              destructive: true,
              readOnly: false,
              idempotent: false,
            },
          },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) => res(ctx.json({ actions: multipleActions })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      // Include all my-plugin actions
                      include: [{ id: 'my-plugin:*' }],
                      // But exclude any destructive ones
                      exclude: [{ attributes: { destructive: true } }],
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        // dangerous-action matches include (my-plugin:*) but is excluded due to destructive: true
        expect(actions.map(a => a.id)).toEqual(['my-plugin:safe-action']);
      });

      it('should filter actions based on attribute constraints', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:read-action',
            name: 'read-action',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:write-action',
            name: 'write-action',
            attributes: {
              destructive: true,
              readOnly: false,
              idempotent: false,
            },
          },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) => res(ctx.json({ actions: multipleActions })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      include: [
                        {
                          attributes: {
                            readOnly: true,
                          },
                        },
                      ],
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual(['my-plugin:read-action']);
      });

      it('should combine pattern and attribute filtering with AND logic', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:safe-read',
            name: 'safe-read',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:dangerous-read',
            name: 'dangerous-read',
            attributes: {
              destructive: true,
              readOnly: true,
              idempotent: false,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'other-plugin:safe-read',
            name: 'safe-read',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(
                ctx.json({
                  actions: multipleActions.filter(a =>
                    a.id.startsWith('my-plugin:'),
                  ),
                }),
              ),
          ),
          rest.get(
            'http://localhost:0/api/other-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(
                ctx.json({
                  actions: multipleActions.filter(a =>
                    a.id.startsWith('other-plugin:'),
                  ),
                }),
              ),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin', 'other-plugin'],
                    filter: {
                      include: [
                        {
                          id: 'my-plugin:*',
                          attributes: {
                            destructive: false,
                          },
                        },
                      ],
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        // Only my-plugin:safe-read matches: my-plugin:* pattern AND destructive: false
        expect(actions.map(a => a.id)).toEqual(['my-plugin:safe-read']);
      });

      it('should return all actions when no filter config is provided', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:action-one',
            name: 'action-one',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:action-two',
            name: 'action-two',
          },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) => res(ctx.json({ actions: multipleActions })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    // No filter config
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual([
          'my-plugin:action-one',
          'my-plugin:action-two',
        ]);
      });
    });

    describe('overrides', () => {
      it('should override action title and description from config', async () => {
        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(ctx.json({ actions: [mockActionsDefinition] })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    overrides: {
                      'my-plugin:test': {
                        title: 'Custom Title',
                        description: 'Custom Description',
                      },
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions[0].title).toBe('Custom Title');
        expect(actions[0].description).toBe('Custom Description');
        expect(actions[0].id).toBe('my-plugin:test');
      });

      it('should override schema title and description from config', async () => {
        const actionWithSchema: ActionsServiceAction = {
          ...mockActionsDefinition,
          schema: {
            input: { type: 'object', title: 'Original Input' },
            output: { type: 'object', title: 'Original Output' },
          },
        };

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) => res(ctx.json({ actions: [actionWithSchema] })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    overrides: {
                      'my-plugin:test': {
                        schema: {
                          input: {
                            title: 'Custom Input Title',
                            description: 'Custom input desc',
                          },
                          output: {
                            title: 'Custom Output Title',
                          },
                        },
                      },
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions[0].schema.input.title).toBe('Custom Input Title');
        expect(actions[0].schema.input.description).toBe('Custom input desc');
        expect(actions[0].schema.output.title).toBe('Custom Output Title');
      });

      it('should filter actions denied by config visibilityPermission', async () => {
        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(ctx.json({ actions: [mockActionsDefinition] })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    overrides: {
                      'my-plugin:test': {
                        visibilityPermission: {
                          name: 'custom.permission',
                          attributes: { action: 'read' },
                        },
                      },
                    },
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
            mockServices.permissions.factory({
              result: AuthorizeResult.DENY,
            }),
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions).toHaveLength(0);
      });

      it('should not affect actions without overrides', async () => {
        const multipleActions: ActionsServiceAction[] = [
          { ...mockActionsDefinition, id: 'my-plugin:action-a', name: 'a' },
          { ...mockActionsDefinition, id: 'my-plugin:action-b', name: 'b' },
        ];

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) => res(ctx.json({ actions: multipleActions })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    overrides: {
                      'my-plugin:action-a': {
                        title: 'Overridden',
                      },
                    },
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
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions[0].title).toBe('Overridden');
        expect(actions[1].title).toBe('Test');
      });
    });

    describe('permissions', () => {
      it('should filter actions with a registry-defined visibilityPermission when denied', async () => {
        const actionWithPermission = {
          ...mockActionsDefinition,
          visibilityPermission: {
            name: 'test.action.use',
            attributes: {},
          },
        };

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(ctx.json({ actions: [actionWithPermission] })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            ...defaultServices,
            mockServices.permissions.factory({
              result: AuthorizeResult.DENY,
            }),
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions).toHaveLength(0);
      });

      it('should allow config visibilityPermission to replace the registry one', async () => {
        const actionWithPermission = {
          ...mockActionsDefinition,
          visibilityPermission: {
            name: 'original.permission',
            attributes: {},
          },
        };

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(ctx.json({ actions: [actionWithPermission] })),
          ),
        );

        const permissionsMock = mockServices.permissions.mock({
          authorize: async requests => {
            return requests.map(req => ({
              result:
                req.permission.name === 'replacement.permission'
                  ? AuthorizeResult.ALLOW
                  : AuthorizeResult.DENY,
            }));
          },
        });

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    overrides: {
                      'my-plugin:test': {
                        visibilityPermission: {
                          name: 'replacement.permission',
                          attributes: {},
                        },
                      },
                    },
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
            permissionsMock.factory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions).toHaveLength(1);
        expect(permissionsMock.authorize).toHaveBeenCalledWith(
          [
            expect.objectContaining({
              permission: expect.objectContaining({
                name: 'replacement.permission',
              }),
            }),
          ],
          expect.anything(),
        );
      });

      it('should not leak visibilityPermission in the list response', async () => {
        const actionWithPermission = {
          ...mockActionsDefinition,
          visibilityPermission: {
            name: 'test.action.use',
            attributes: {},
          },
        };

        server.use(
          rest.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            (_req, res, ctx) =>
              res(ctx.json({ actions: [actionWithPermission] })),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions[0]).not.toHaveProperty('visibilityPermission');
      });
    });

    describe('invoke', () => {
      it('should invoke the action and return the output', async () => {
        server.use(
          rest.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            (_req, res, ctx) => res(ctx.json({ output: { ok: true } })),
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
          rest.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            (_req, res, ctx) => res(ctx.status(404)),
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
          rest.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            (_req, res, ctx) => res(ctx.status(400)),
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
