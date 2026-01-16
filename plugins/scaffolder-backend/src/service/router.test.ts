/*
 * Copyright 2020 The Backstage Authors
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

import { DatabaseManager } from '@backstage/backend-defaults/database';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import ObservableImpl from 'zen-observable';

/**
 * TODO: The following should import directly from the router file.
 * Due to a circular dependency between this plugin and the
 * plugin-scaffolder-backend-module-cookiecutter plugin, it results in an error:
 * TypeError: _pluginscaffolderbackend.createTemplateAction is not a function
 */
import { stringifyEntityRef, UserEntity } from '@backstage/catalog-model';
import {
  createTemplateAction,
  TaskBroker,
  TemplateFilter,
  TemplateGlobal,
  SerializedTaskEvent,
} from '@backstage/plugin-scaffolder-node';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { JsonValue } from '@backstage/types';
import { StorageTaskBroker } from '../scaffolder/tasks/StorageTaskBroker';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';
import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import {
  AutocompleteHandler,
  CreatedTemplateFilter,
  CreatedTemplateGlobal,
  createTemplateFilter,
  createTemplateGlobalFunction,
  createTemplateGlobalValue,
} from '@backstage/plugin-scaffolder-node/alpha';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { DatabaseService } from '@backstage/backend-plugin-api';
import { createDebugLogAction } from '../scaffolder/actions/builtin';
import { ScmIntegrations } from '@backstage/integration';
import {
  extractFilterMetadata,
  extractGlobalFunctionMetadata,
  extractGlobalValueMetadata,
} from '../util/templating';
import { createDefaultFilters } from '../lib/templating/filters/createDefaultFilters';
import { createRouter } from './router';
import { DatabaseTaskStore } from '../scaffolder/tasks/DatabaseTaskStore';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';

function createDatabase(): DatabaseService {
  return DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'better-sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('scaffolder', {
    logger: mockServices.logger.mock(),
    lifecycle: mockServices.lifecycle.mock(),
  });
}

const config = new ConfigReader({});

// Returns a new mock template object each time to avoid mutation issues.
// Accepts optional spec overrides that are merged with the base spec.
const generateMockTemplate = (specOverrides?: Record<string, unknown>) => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind: 'Template',
  metadata: {
    description: 'Create a new CRA website project',
    name: 'create-react-app-template',
    tags: ['experimental', 'react', 'cra'],
    title: 'Create React App Template',
    annotations: {
      'backstage.io/managed-by-location': 'url:https://dev.azure.com',
    },
  },
  spec: {
    owner: 'web@example.com',
    type: 'website',
    steps: [
      {
        id: 'step-one',
        name: 'First log',
        action: 'debug:log',
        input: {
          message: 'hello',
        },
      },
      {
        id: 'step-two',
        name: 'Second log',
        action: 'debug:log',
        input: {
          message: 'world',
        },
        'backstage:permissions': {
          tags: ['steps-tag'],
        },
      },
    ],
    parameters: [
      {
        type: 'object',
        required: ['requiredParameter1'],
        properties: {
          requiredParameter1: {
            type: 'string',
            description: 'Required parameter 1',
          },
        },
      },
      {
        type: 'object',
        required: ['requiredParameter2'],
        'backstage:permissions': {
          tags: ['parameters-tag'],
        },
        properties: {
          requiredParameter2: {
            type: 'string',
            description: 'Required parameter 2',
          },
        },
      },
    ],
    ...specOverrides,
  },
});

const mockUser: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'mock',
    annotations: {
      'google.com/email': 'bobby@tables.com',
    },
  },
  spec: {
    profile: {
      displayName: 'Robert Tables of the North',
    },
  },
};

const createTestRouter = async (
  overrides: {
    additionalTemplateFilters?:
      | Record<string, TemplateFilter>
      | CreatedTemplateFilter<any, any>[];
    additionalTemplateGlobals?:
      | Record<string, TemplateGlobal>
      | CreatedTemplateGlobal[];
    autocompleteHandlers?: Record<string, AutocompleteHandler>;
    actionsRegistry?: ActionsService;
    entities?: any[];
  } = {},
) => {
  const logger = mockServices.logger.mock({
    child: () => logger,
  });

  const databaseTaskStore = await DatabaseTaskStore.create({
    database: createDatabase(),
  });

  const taskBroker = new StorageTaskBroker(databaseTaskStore, logger, config);

  jest.spyOn(taskBroker, 'dispatch');
  jest.spyOn(taskBroker, 'claim');
  jest.spyOn(taskBroker, 'cancel');
  jest.spyOn(taskBroker, 'retry');
  jest.spyOn(taskBroker, 'list');
  jest.spyOn(taskBroker, 'get');
  jest.spyOn(taskBroker, 'vacuumTasks');
  jest.spyOn(taskBroker, 'event$');

  const entities = overrides.entities ?? [generateMockTemplate(), mockUser];
  const catalog = catalogServiceMock({ entities });
  const permissions = mockServices.permissions();
  const auth = mockServices.auth();
  const httpAuth = mockServices.httpAuth();
  const events = mockServices.events();

  const router = await createRouter({
    logger,
    config: new ConfigReader({}),
    database: createDatabase(),
    catalog,
    taskBroker,
    permissions,
    auth,
    httpAuth,
    events,
    additionalTemplateFilters: overrides.additionalTemplateFilters,
    additionalTemplateGlobals: overrides.additionalTemplateGlobals,
    autocompleteHandlers: overrides.autocompleteHandlers,
    actions: [
      createTemplateAction({
        id: 'test',
        description: 'test',
        schema: {
          input: z =>
            z.object({
              test: z.string(),
            }),
        },
        handler: async () => {},
      }),
      createDebugLogAction(),
    ],
    actionsRegistry: overrides.actionsRegistry ?? actionsRegistryServiceMock(),
  });

  router.use(mockErrorHandler());
  const wrappedRouter = await wrapServer(express().use(router));
  return {
    router: wrappedRouter,
    unwrappedRouter: router,
    logger,
    taskBroker,
    permissions,
    catalog,
  };
};

describe('scaffolder router', () => {
  const credentials = mockCredentials.user();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v2/actions', () => {
    it('lists available actions', async () => {
      const { router } = await createTestRouter();
      const response = await request(router).get('/v2/actions').send();
      expect(response.status).toEqual(200);
      expect(response.body[0].id).toBeDefined();
      expect(response.body.length).toBe(2);
    });

    it('should include actions from the remote actions registry', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'my-demo-action',
        title: 'Test',
        description: 'Test',
        schema: {
          input: z => z.object({ name: z.string() }),
          output: z => z.object({ name: z.string() }),
        },
        action: async () => ({ output: { name: 'test' } }),
      });
      const { router } = await createTestRouter({
        actionsRegistry: mockActionsRegistry,
      });
      const response = await request(router).get('/v2/actions').send();

      expect(response.status).toEqual(200);
      expect(response.body.length).toBe(3);

      expect(response.body).toContainEqual({
        description: 'Test',
        examples: [],
        id: 'test:my-demo-action',
        schema: {
          input: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            additionalProperties: false,
            properties: { name: { type: 'string' } },
            required: ['name'],
            type: 'object',
          },
          output: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            additionalProperties: false,
            properties: { name: { type: 'string' } },
            required: ['name'],
            type: 'object',
          },
        },
      });
    });
  });

  describe('GET /v2/templating-extensions', () => {
    it('lists template filters and globals', async () => {
      const { router } = await createTestRouter();
      const response = await request(router)
        .get('/v2/templating-extensions')
        .send();
      expect(response.status).toEqual(200);
      const integrations = ScmIntegrations.fromConfig(config);

      expect(response.body).toMatchObject({
        filters: {
          ...extractFilterMetadata(createDefaultFilters({ integrations })),
        },
        globals: {
          functions: {},
          values: {},
        },
      });
    });

    it('should include legacy template filters in templating extensions', async () => {
      const { router } = await createTestRouter({
        additionalTemplateFilters: {
          foo: (s: JsonValue) => s,
          bar: (bar: JsonValue) => !!bar,
          baz: (what: JsonValue, ever: JsonValue) =>
            String(what) + String(ever),
        } as Record<string, TemplateFilter>,
      });

      const response = await request(router)
        .get('/v2/templating-extensions')
        .send();
      expect(response.status).toEqual(200);

      const integrations = ScmIntegrations.fromConfig(config);

      expect(response.body).toMatchObject({
        filters: {
          ...extractFilterMetadata(createDefaultFilters({ integrations })),
          ...extractFilterMetadata({
            foo: (s: JsonValue) => s,
            bar: (bar: JsonValue) => !!bar,
            baz: (what: JsonValue, ever: JsonValue) =>
              String(what) + String(ever),
          }),
        },
        globals: {
          functions: {},
          values: {},
        },
      });
    });

    it('should include created template filters in templating extensions', async () => {
      const { router } = await createTestRouter({
        additionalTemplateFilters: [
          createTemplateFilter({
            id: 'foo',
            schema: z =>
              z
                .function()
                .args(z.any().describe('a value'))
                .returns(z.any().describe('same value')),
            filter: s => s,
          }),
          createTemplateFilter({
            id: 'bar',
            filter: bar => !!bar,
          }),
          createTemplateFilter({
            id: 'baz',
            description: 'append the argument to the incoming value',
            schema: z =>
              z
                .function()
                .args(
                  z.string(),
                  z.string().describe('value to append to input'),
                )
                .returns(z.string().describe('input+suffix')),
            filter: (what, ever) => what + ever,
          }),
          createTemplateFilter({
            id: 'blah',
            schema: z =>
              z
                .function()
                .args(
                  z.number(),
                  z.number().describe('factor by which to multiply input'),
                  z
                    .number()
                    .describe('addend by which to increase input * factor'),
                ),
            filter: (base, factor, addend) => base * factor + addend,
          }),
        ],
      });

      const response = await request(router)
        .get('/v2/templating-extensions')
        .send();

      expect(response.status).toEqual(200);

      const integrations = ScmIntegrations.fromConfig(config);

      expect(response.body.filters).toMatchObject({
        ...extractFilterMetadata(createDefaultFilters({ integrations })),
        foo: expect.any(Object),
        bar: expect.any(Object),
        baz: expect.any(Object),
        blah: expect.any(Object),
      });
    });

    it('should include legacy template globals in templating extensions', async () => {
      const { router } = await createTestRouter({
        additionalTemplateGlobals: {
          nul: null,
          nop: (x: JsonValue) => x,
        } as Record<string, TemplateGlobal>,
      });

      const response = await request(router)
        .get('/v2/templating-extensions')
        .send();

      expect(response.status).toEqual(200);

      expect(response.body.globals).toMatchObject({
        functions: extractGlobalFunctionMetadata({
          nul: null,
          nop: (x: JsonValue) => x,
        }),
        values: extractGlobalValueMetadata({
          nul: null,
          nop: (x: JsonValue) => x,
        }),
      });
    });

    it('should include created template globals in templating extensions', async () => {
      const { router } = await createTestRouter({
        additionalTemplateGlobals: [
          createTemplateGlobalValue({
            id: 'nul',
            description: 'null value',
            value: null,
          }),
          createTemplateGlobalFunction({
            id: 'nop',
            description: 'nop function',
            schema: z =>
              z
                .function()
                .args(z.any().describe('input'))
                .returns(z.any().describe('output')),
            fn: (x: JsonValue) => x,
          }),
        ],
      });
      const response = await request(router)
        .get('/v2/templating-extensions')
        .send();
      expect(response.status).toEqual(200);

      expect(response.body.globals).toMatchObject({
        functions: expect.objectContaining({
          nop: expect.any(Object),
        }),
        values: expect.objectContaining({
          nul: expect.any(Object),
        }),
      });
    });
  });

  describe('GET /v2/templates/:namespace/:kind/:name/parameter-schema', () => {
    it('returns the parameter schema', async () => {
      const { router, permissions } = await createTestRouter();
      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementationOnce(async () => [
          {
            result: AuthorizeResult.ALLOW,
          },
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);
      const response = await request(router)
        .get(
          '/v2/templates/default/Template/create-react-app-template/parameter-schema',
        )
        .send();

      expect(response.status).toEqual(200);

      expect(response.body).toEqual({
        title: 'Create React App Template',
        description: 'Create a new CRA website project',
        steps: [
          {
            title: 'Please enter the following information',
            schema: {
              required: ['requiredParameter1'],
              type: 'object',
              properties: {
                requiredParameter1: {
                  description: 'Required parameter 1',
                  type: 'string',
                },
              },
            },
          },
          {
            title: 'Please enter the following information',
            schema: {
              type: 'object',
              required: ['requiredParameter2'],
              'backstage:permissions': {
                tags: ['parameters-tag'],
              },
              properties: {
                requiredParameter2: {
                  type: 'string',
                  description: 'Required parameter 2',
                },
              },
            },
          },
        ],
      });
    });

    it('filters parameters that the user is not authorized to see', async () => {
      const { router, permissions } = await createTestRouter();
      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementationOnce(async () => [
          {
            result: AuthorizeResult.DENY,
          },
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);

      const response = await request(router)
        .get(
          '/v2/templates/default/Template/create-react-app-template/parameter-schema',
        )
        .send();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        title: 'Create React App Template',
        description: 'Create a new CRA website project',
        steps: [],
      });
    });

    it('filters parameters that the user is not authorized to see in case of conditional decision', async () => {
      const { permissions, router } = await createTestRouter();
      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementation(async () => [
          {
            conditions: {
              resourceType: 'scaffolder-template',
              rule: 'HAS_TAG',
              params: { tag: 'parameters-tag' },
            },
            pluginId: 'scaffolder',
            resourceType: 'scaffolder-template',
            result: AuthorizeResult.CONDITIONAL,
          },
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);

      const response = await request(router)
        .get(
          '/v2/templates/default/Template/create-react-app-template/parameter-schema',
        )
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        title: 'Create React App Template',
        description: 'Create a new CRA website project',
        steps: [
          {
            title: 'Please enter the following information',
            schema: {
              type: 'object',
              required: ['requiredParameter2'],
              'backstage:permissions': {
                tags: ['parameters-tag'],
              },
              properties: {
                requiredParameter2: {
                  type: 'string',
                  description: 'Required parameter 2',
                },
              },
            },
          },
        ],
      });
    });
  });

  describe('POST /v2/tasks', () => {
    it('rejects template values which do not match the template schema definition', async () => {
      const { router } = await createTestRouter();
      const response = await request(router)
        .post('/v2/tasks')
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            storePath: 'https://github.com/backstage/backstage',
          },
        });

      expect(response.status).toEqual(400);
    });

    it('rejects when required secrets are missing', async () => {
      const templateWithSecrets = generateMockTemplate({
        secrets: {
          type: 'object',
          required: ['NPM_TOKEN'],
          properties: {
            NPM_TOKEN: { type: 'string' },
          },
        },
      });

      const { router } = await createTestRouter({
        entities: [templateWithSecrets, mockUser],
      });

      const response = await request(router)
        .post('/v2/tasks')
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
          // No secrets provided
        });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            property: 'secrets',
            message: 'secrets.NPM_TOKEN is required',
          }),
        ]),
      );
    });

    it('rejects when required secrets are missing without explicit type', async () => {
      const templateWithSecrets = generateMockTemplate({
        secrets: {
          // No explicit type: 'object' - should still work
          required: ['NPM_TOKEN'],
          properties: {
            NPM_TOKEN: { type: 'string' },
          },
        },
      });

      const { router } = await createTestRouter({
        entities: [templateWithSecrets, mockUser],
      });

      const response = await request(router)
        .post('/v2/tasks')
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
          // No secrets provided
        });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            property: 'secrets',
            message: 'secrets.NPM_TOKEN is required',
          }),
        ]),
      );
    });

    it('accepts valid secrets matching the schema', async () => {
      const templateWithSecrets = generateMockTemplate({
        secrets: {
          type: 'object',
          required: ['NPM_TOKEN'],
          properties: {
            NPM_TOKEN: { type: 'string' },
          },
        },
      });

      const { router, taskBroker } = await createTestRouter({
        entities: [templateWithSecrets, mockUser],
      });
      const broker = taskBroker.dispatch as jest.Mocked<TaskBroker>['dispatch'];

      broker.mockResolvedValue({
        taskId: 'a-random-id',
      });

      const response = await request(router)
        .post('/v2/tasks')
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
          secrets: {
            NPM_TOKEN: 'my-secret-token',
          },
        });

      expect(response.status).toEqual(201);
      expect(response.body.id).toBe('a-random-id');
    });

    it('return the template id', async () => {
      const { router, taskBroker } = await createTestRouter();
      const broker = taskBroker.dispatch as jest.Mocked<TaskBroker>['dispatch'];

      broker.mockResolvedValue({
        taskId: 'a-random-id',
      });

      const response = await request(router)
        .post('/v2/tasks')
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
        });

      expect(response.status).toEqual(201);
      expect(response.body.id).toBe('a-random-id');
    });

    it('should call the broker with a correct spec', async () => {
      const { router, taskBroker } = await createTestRouter();
      const broker = taskBroker.dispatch as jest.Mocked<TaskBroker>['dispatch'];
      const mockToken = mockCredentials.user.token();
      const mockTemplate = generateMockTemplate();

      await request(router)
        .post('/v2/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
        });

      expect(broker).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: 'user:default/mock',
          secrets: {
            __initiatorCredentials: JSON.stringify({
              ...credentials,
              token: mockToken,
            }),
            backstageToken: mockToken,
          },
          spec: {
            apiVersion: mockTemplate.apiVersion,
            steps: mockTemplate.spec.steps.map((step, index) => ({
              ...step,
              id: step.id ?? `step-${index + 1}`,
              name: step.name ?? step.action,
            })),
            output: {},
            parameters: {
              requiredParameter1: 'required-value-1',
              requiredParameter2: 'required-value-2',
            },
            user: {
              entity: mockUser,
              ref: 'user:default/mock',
            },
            templateInfo: {
              entityRef: stringifyEntityRef({
                kind: 'Template',
                namespace: 'Default',
                name: mockTemplate.metadata?.name,
              }),
              baseUrl: 'https://dev.azure.com',
              entity: {
                metadata: mockTemplate.metadata,
              },
            },
          },
        }),
      );
    });

    it('should emit auditlog containing user identifier when backstage auth is passed', async () => {
      const { logger, router } = await createTestRouter();
      const mockToken = mockCredentials.user.token();

      const { status, body } = await request(router)
        .post('/v2/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
        });

      expect(status).toBe(201);
      expect(body).toMatchObject({
        id: expect.any(String),
      });
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(
        'Scaffolding task for template:default/create-react-app-template created by user:default/mock',
      );
    });

    it('filters steps that the user is not authorized to see', async () => {
      const { router, permissions, taskBroker } = await createTestRouter();
      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementation(async () => [
          {
            result: AuthorizeResult.ALLOW,
          },
          {
            result: AuthorizeResult.DENY,
          },
        ]);

      const broker = taskBroker.dispatch as jest.Mocked<TaskBroker>['dispatch'];
      const mockTemplate = generateMockTemplate();

      await request(router)
        .post('/v2/tasks')
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
        });
      expect(broker).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: 'user:default/mock',
          secrets: {
            __initiatorCredentials: JSON.stringify({
              ...credentials,
              token: mockCredentials.user.token(),
            }),
            backstageToken: mockCredentials.user.token(),
          },

          spec: {
            apiVersion: mockTemplate.apiVersion,
            steps: [],
            output: {},
            parameters: {
              requiredParameter1: 'required-value-1',
              requiredParameter2: 'required-value-2',
            },
            user: {
              entity: mockUser,
              ref: 'user:default/mock',
            },
            templateInfo: {
              entityRef: stringifyEntityRef({
                kind: 'Template',
                namespace: 'Default',
                name: mockTemplate.metadata?.name,
              }),
              baseUrl: 'https://dev.azure.com',
              entity: {
                metadata: mockTemplate.metadata,
              },
            },
          },
        }),
      );
    });

    it('filters steps that the user is not authorized to see in case of conditional decision', async () => {
      const { permissions, router, taskBroker } = await createTestRouter();
      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementation(async () => [
          {
            result: AuthorizeResult.ALLOW,
          },
          {
            conditions: {
              resourceType: 'scaffolder-template',
              rule: 'HAS_TAG',
              params: { tag: 'steps-tag' },
            },
            pluginId: 'scaffolder',
            resourceType: 'scaffolder-template',
            result: AuthorizeResult.CONDITIONAL,
          },
        ]);

      const broker = taskBroker.dispatch as jest.Mocked<TaskBroker>['dispatch'];
      const mockTemplate = generateMockTemplate();
      await request(router)
        .post('/v2/tasks')
        .send({
          templateRef: stringifyEntityRef({
            kind: 'template',
            name: 'create-react-app-template',
          }),
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
        });
      expect(broker).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: 'user:default/mock',
          secrets: {
            __initiatorCredentials: JSON.stringify({
              ...credentials,
              token: mockCredentials.user.token(),
            }),
            backstageToken: mockCredentials.user.token(),
          },

          spec: {
            apiVersion: mockTemplate.apiVersion,
            steps: [
              {
                id: 'step-two',
                name: 'Second log',
                action: 'debug:log',
                input: {
                  message: 'world',
                },
                'backstage:permissions': {
                  tags: ['steps-tag'],
                },
              },
            ],
            output: {},
            parameters: {
              requiredParameter1: 'required-value-1',
              requiredParameter2: 'required-value-2',
            },
            user: {
              entity: mockUser,
              ref: 'user:default/mock',
            },
            templateInfo: {
              entityRef: stringifyEntityRef({
                kind: 'Template',
                namespace: 'Default',
                name: mockTemplate.metadata?.name,
              }),
              baseUrl: 'https://dev.azure.com',
              entity: {
                metadata: mockTemplate.metadata,
              },
            },
          },
        }),
      );
    });
  });

  describe('GET /v2/tasks', () => {
    it('return all tasks', async () => {
      const { router, taskBroker } = await createTestRouter();
      (
        taskBroker.list as jest.Mocked<Required<TaskBroker>>['list']
      ).mockResolvedValue({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as TaskSpec,
            status: 'completed',
            createdAt: '',
            createdBy: '',
          },
        ],
        totalTasks: 1,
      });

      const response = await request(router).get(`/v2/tasks`);
      expect(taskBroker.list).toHaveBeenCalledWith({
        filters: {},
        pagination: {},
      });
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as TaskSpec,
            status: 'completed',
            createdAt: '',
            createdBy: '',
          },
        ],
        totalTasks: 1,
      });
    });

    it('return filtered tasks', async () => {
      const { router, taskBroker } = await createTestRouter();
      (
        taskBroker.list as jest.Mocked<Required<TaskBroker>>['list']
      ).mockResolvedValue({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as TaskSpec,
            status: 'completed',
            createdAt: '',
            createdBy: 'user:default/foo',
          },
        ],
        totalTasks: 1,
      });

      const response = await request(router).get(
        `/v2/tasks?createdBy=user:default/foo&createdBy=user:default/bar&status=completed&status=open&limit=1&offset=0&order=desc:created_at`,
      );

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as TaskSpec,
            status: 'completed',
            createdAt: '',
            createdBy: 'user:default/foo',
          },
        ],
        totalTasks: 1,
      });
      expect(taskBroker.list).toHaveBeenCalledWith({
        filters: {
          createdBy: ['user:default/foo', 'user:default/bar'],
          status: ['completed', 'open'],
        },
        pagination: {
          limit: 1,
          offset: 0,
        },
        order: [{ order: 'desc', field: 'created_at' }],
      });
    });

    it('disallows users from seeing tasks they do not own', async () => {
      const { router, taskBroker, permissions } = await createTestRouter();
      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementationOnce(async () => [
          {
            conditions: {
              resourceType: 'scaffolder-task',
              rule: 'IS_TASK_OWNER',
              params: { createdBy: ['user'] },
            },
            pluginId: 'scaffolder',
            resourceType: 'scaffolder-task',
            result: AuthorizeResult.CONDITIONAL,
          },
        ]);
      const response = await request(router).get(
        `/v2/tasks?createdBy=not-user`,
      );
      expect(taskBroker.list).toHaveBeenCalledWith({
        filters: { createdBy: ['not-user'], status: undefined },
        order: undefined,
        pagination: { limit: undefined, offset: undefined },
        permissionFilters: { key: 'created_by', values: ['user'] },
      });
      expect(response.status).toBe(200);
      expect(response.body.totalTasks).toBe(0);
      expect(response.body.tasks).toEqual([]);
    });
  });

  describe('GET /v2/tasks/:taskId', () => {
    it('does not divulge secrets', async () => {
      const { router, taskBroker } = await createTestRouter();
      (taskBroker.get as jest.Mocked<TaskBroker>['get']).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as TaskSpec,
        status: 'completed',
        createdAt: '',
        secrets: {
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });

      const response = await request(router).get(`/v2/tasks/a-random-id`);
      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('completed');
      expect(response.body.secrets).toBeUndefined();
    });
    it('disallows users from seeing tasks they do not own', async () => {
      const { router, permissions, taskBroker } = await createTestRouter();
      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementationOnce(async () => [
          {
            conditions: {
              resourceType: 'scaffolder-task',
              rule: 'IS_TASK_OWNER',
              params: { createdBy: ['user'] },
            },
            pluginId: 'scaffolder',
            resourceType: 'scaffolder-task',
            result: AuthorizeResult.CONDITIONAL,
          },
        ]);
      (taskBroker.get as jest.Mocked<TaskBroker>['get']).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: 'not-user',
      });

      const response = await request(router).get(`/v2/tasks/a-random-id`);
      expect(taskBroker.get).toHaveBeenCalledWith('a-random-id');
      expect(response.error).not.toBeFalsy();
    });
  });

  describe('GET /v2/tasks/:taskId/eventstream', () => {
    it('should return log messages', async () => {
      const { unwrappedRouter: router, taskBroker } = await createTestRouter();
      (taskBroker.get as jest.Mocked<TaskBroker>['get']).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      let subscriber: ZenObservable.SubscriptionObserver<{
        events: SerializedTaskEvent[];
      }>;
      (
        taskBroker.event$ as jest.Mocked<TaskBroker>['event$']
      ).mockImplementation(({ taskId }) => {
        return new ObservableImpl(observer => {
          subscriber = observer;
          setImmediate(() => {
            observer.next({
              events: [
                {
                  id: 0,
                  taskId,
                  type: 'log',
                  createdAt: '',
                  body: { message: 'My log message' },
                },
              ],
            });
            observer.next({
              events: [
                {
                  id: 1,
                  taskId,
                  type: 'completion',
                  createdAt: '',
                  body: { message: 'Finished!' },
                },
              ],
            });
          });
        });
        // emit after this function returned
      });

      let statusCode: number | undefined = undefined;
      let headers: Record<string, string> = {};
      const responseDataFn = jest.fn();

      const req = request(router)
        .get('/v2/tasks/a-random-id/eventstream')
        .set('accept', 'text/event-stream')
        .parse((res, _) => {
          ({ statusCode, headers } = res as unknown as {
            statusCode: number;
            headers: Record<string, string>;
          });

          res.on('data', chunk => {
            responseDataFn(chunk.toString());

            // the server expects the client to abort the request
            if (chunk.includes('completion')) {
              req.abort();
            }
          });
        });

      // wait for the request to finish
      await req.catch(() => {
        // ignore 'aborted' error
      });

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toBe('text/event-stream');
      expect(responseDataFn).toHaveBeenCalledTimes(2);
      expect(responseDataFn).toHaveBeenCalledWith(`event: log
data: {"id":0,"taskId":"a-random-id","type":"log","createdAt":"","body":{"message":"My log message"}}

`);
      expect(responseDataFn).toHaveBeenCalledWith(`event: completion
data: {"id":1,"taskId":"a-random-id","type":"completion","createdAt":"","body":{"message":"Finished!"}}

`);

      expect(taskBroker.event$).toHaveBeenCalledTimes(1);
      expect(taskBroker.event$).toHaveBeenCalledWith({
        taskId: 'a-random-id',
      });
      expect(subscriber!.closed).toBe(true);
    });

    it('should return log messages with after query', async () => {
      const { unwrappedRouter: router, taskBroker } = await createTestRouter();
      (taskBroker.get as jest.Mocked<TaskBroker>['get']).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      let subscriber: ZenObservable.SubscriptionObserver<{
        events: SerializedTaskEvent[];
      }>;
      (
        taskBroker.event$ as jest.Mocked<TaskBroker>['event$']
      ).mockImplementation(({ taskId }) => {
        return new ObservableImpl(observer => {
          subscriber = observer;
          setImmediate(() => {
            observer.next({
              events: [
                {
                  id: 1,
                  taskId,
                  type: 'completion',
                  createdAt: '',
                  body: { message: 'Finished!' },
                },
              ],
            });
          });
        });
      });

      let statusCode: number | undefined = undefined;
      let headers: Record<string, string> = {};

      const req = request(router)
        .get('/v2/tasks/a-random-id/eventstream')
        .query({ after: 10 })
        .set('accept', 'text/event-stream')
        .parse((res, _) => {
          ({ statusCode, headers } = res as unknown as {
            statusCode: number;
            headers: Record<string, string>;
          });

          res.on('data', () => {
            // close immediately
            req.abort();
          });
        });

      // wait for the request to finish
      await req.catch(() => {
        // ignore 'aborted' error
      });

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toBe('text/event-stream');

      expect(taskBroker.event$).toHaveBeenCalledTimes(1);
      expect(taskBroker.event$).toHaveBeenCalledWith({
        taskId: 'a-random-id',
        after: 10,
      });

      expect(subscriber!.closed).toBe(true);
    });
  });

  describe('GET /v2/tasks/:taskId/events', () => {
    it('should return log messages', async () => {
      const { router, taskBroker } = await createTestRouter();
      (taskBroker.get as jest.Mocked<TaskBroker>['get']).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      let subscriber: ZenObservable.SubscriptionObserver<{
        events: SerializedTaskEvent[];
      }>;
      (
        taskBroker.event$ as jest.Mocked<TaskBroker>['event$']
      ).mockImplementation(({ taskId }) => {
        return new ObservableImpl(observer => {
          subscriber = observer;
          observer.next({
            events: [
              {
                id: 0,
                taskId,
                type: 'log',
                createdAt: '',
                body: { message: 'My log message' },
              },
              {
                id: 1,
                taskId,
                type: 'completion',
                createdAt: '',
                body: { message: 'Finished!' },
              },
            ],
          });
        });
      });

      const response = await request(router).get(
        '/v2/tasks/a-random-id/events',
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          id: 0,
          taskId: 'a-random-id',
          type: 'log',
          createdAt: '',
          body: { message: 'My log message' },
        },
        {
          id: 1,
          taskId: 'a-random-id',
          type: 'completion',
          createdAt: '',
          body: { message: 'Finished!' },
        },
      ]);

      expect(taskBroker.event$).toHaveBeenCalledTimes(1);
      expect(taskBroker.event$).toHaveBeenCalledWith({
        taskId: 'a-random-id',
      });
      expect(subscriber!.closed).toBe(true);
    });

    it('should return log messages with after query', async () => {
      const { router, taskBroker } = await createTestRouter();
      (taskBroker.get as jest.Mocked<TaskBroker>['get']).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      let subscriber: ZenObservable.SubscriptionObserver<{
        events: SerializedTaskEvent[];
      }>;
      (
        taskBroker.event$ as jest.Mocked<TaskBroker>['event$']
      ).mockImplementation(() => {
        return new ObservableImpl(observer => {
          subscriber = observer;
          observer.next({ events: [] });
        });
      });

      const response = await request(router)
        .get('/v2/tasks/a-random-id/events')
        .query({ after: 10 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);

      expect(taskBroker.event$).toHaveBeenCalledTimes(1);
      expect(taskBroker.event$).toHaveBeenCalledWith({
        taskId: 'a-random-id',
        after: 10,
      });
      expect(subscriber!.closed).toBe(true);
    });
    it('disallows users from seeing events for tasks they do not own', async () => {
      const { permissions, router, taskBroker } = await createTestRouter();

      jest
        .spyOn(permissions, 'authorizeConditional')
        .mockImplementationOnce(async () => [
          {
            conditions: {
              resourceType: 'scaffolder-task',
              rule: 'IS_TASK_OWNER',
              params: { createdBy: ['user'] },
            },
            pluginId: 'scaffolder',
            resourceType: 'scaffolder-task',
            result: AuthorizeResult.CONDITIONAL,
          },
        ]);
      (taskBroker.get as jest.Mocked<TaskBroker>['get']).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: 'not-user',
      });

      const response = await request(router).get(
        `/v2/tasks/a-random-id/events`,
      );
      expect(taskBroker.get).toHaveBeenCalledWith('a-random-id');
      expect(response.error).not.toBeFalsy();
    });
  });

  describe('POST /v2/dry-run', () => {
    it('should get user entity', async () => {
      const { router, catalog } = await createTestRouter();
      const mockToken = mockCredentials.user.token();
      const mockTemplate = generateMockTemplate();

      // Spy on the catalog method to verify it's called correctly
      const getEntityByRefSpy = jest.spyOn(catalog, 'getEntityByRef');

      await request(router)
        .post('/v2/dry-run')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          template: mockTemplate,
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
          directoryContents: [],
        });

      expect(getEntityByRefSpy).toHaveBeenCalledTimes(1);

      expect(getEntityByRefSpy).toHaveBeenCalledWith(
        'user:default/mock',
        expect.anything(),
      );
    });

    it('rejects when required secrets are missing', async () => {
      const { router } = await createTestRouter();
      const mockToken = mockCredentials.user.token();

      const templateWithSecrets = generateMockTemplate({
        secrets: {
          type: 'object',
          required: ['NPM_TOKEN'],
          properties: {
            NPM_TOKEN: { type: 'string' },
          },
        },
      });

      const response = await request(router)
        .post('/v2/dry-run')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          template: templateWithSecrets,
          values: {
            requiredParameter1: 'required-value-1',
            requiredParameter2: 'required-value-2',
          },
          directoryContents: [],
          // No secrets provided
        });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            property: 'secrets',
            message: 'secrets.NPM_TOKEN is required',
          }),
        ]),
      );
    });

    it('allows payloads up to 10MB', async () => {
      const { unwrappedRouter } = await createTestRouter();
      const mockToken = mockCredentials.user.token();
      const mockTemplate = generateMockTemplate();

      const response = await request(unwrappedRouter)
        .post('/v2/dry-run')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          template: mockTemplate,
          values: {
            requiredParameter1: 'A'.repeat(9 * 1024 * 1024), // ~9MB
            requiredParameter2: 'required-value-2',
          },
          directoryContents: [],
        });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /v2/autocomplete/:provider/:resource', () => {
    it('should throw an error when the provider is not registered', async () => {
      const handleAutocompleteRequest = jest.fn().mockResolvedValue({
        results: [{ title: 'blob' }],
      });
      const { router } = await createTestRouter({
        autocompleteHandlers: {
          'test-provider': handleAutocompleteRequest,
        },
      });

      const response = await request(router)
        .post('/v2/autocomplete/unknown-provider/resource')
        .send({
          token: 'token',
          context: {},
        });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: {
            message: 'Unsupported provider: unknown-provider',
            name: 'InputError',
          },
        }),
      );
    });

    it('should call the autocomplete handler', async () => {
      const handleAutocompleteRequest = jest.fn().mockResolvedValue({
        results: [{ id: 'a-random-id', title: 'blob' }],
      });

      const { router } = await createTestRouter({
        autocompleteHandlers: {
          'test-provider': handleAutocompleteRequest,
        },
      });

      const context = { mock: 'context' };
      const mockToken = 'mocktoken';

      const response = await request(router)
        .post('/v2/autocomplete/test-provider/resource')
        .send({
          token: mockToken,
          context,
        });

      expect(response.status).toEqual(200);

      expect(response.body).toEqual({
        results: [{ id: 'a-random-id', title: 'blob' }],
      });
      expect(handleAutocompleteRequest).toHaveBeenCalledWith({
        token: mockToken,
        context,
        resource: 'resource',
      });
    });
  });
});
