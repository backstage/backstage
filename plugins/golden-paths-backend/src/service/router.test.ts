/*
 * Copyright 2026 The Backstage Authors
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
import { ConfigReader } from '@backstage/config';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';
import express from 'express';
import request from 'supertest';
import ObservableImpl from 'zen-observable';
import {
  parseEntityRef,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { createRouter, DatabaseTaskStore, TaskBroker } from '../index';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  mockCredentials,
  mockServices,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import {
  DatabaseService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { StorageTaskBroker } from '../golden-paths/tasks/StorageTaskBroker';
import { ScaffolderClient } from '../client/ScaffolderClient';

const authorize = require('../util/authorizeGoldenPath');

const defaultLogger = mockServices.logger.mock();

const mockAccess = jest.fn();

const getMockGoldenPath = (): GoldenPathEntityV1beta1 => ({
  apiVersion: 'backstage.io/v1beta1',
  kind: 'GoldenPath',
  metadata: {
    name: 'example-golden-path',
    description: 'Example of golden path',
    tags: ['example', 'test'],
    title: 'Example Golden Path',
    annotations: {
      'backstage.io/managed-by-location': 'url:https://dev.azure.com',
    },
  },
  spec: {
    owner: 'me',
    type: 'migration',
    parameters: [
      {
        type: 'object',
        required: ['requiredParameter'],
        properties: {
          requiredParameter: {
            type: 'string',
            description: 'Required parameter',
          },
        },
      },
      {
        type: 'object',
        required: [],
        'backstage:permissions': {
          tags: ['parameters-tag'],
        },
        properties: {
          optionalParameter: {
            type: 'string',
            description: 'Optional parameter',
          },
        },
      },
    ],
    steps: [
      {
        id: 'step-one',
        name: 'First step',
        template: 'template:default/example-template',
        input: {
          message: 'hello',
        },
      },
      {
        id: 'step-two',
        name: 'Second step',
        template: 'template:test/example-template',
        input: {
          message: 'hello',
        },
        'backstage:permissions': {
          tags: ['steps-tag'],
        },
      },
    ],
  },
});

const getMockNotAuthorizedGoldenPath = (): GoldenPathEntityV1beta1 => ({
  apiVersion: 'backstage.io/v1beta1',
  kind: 'GoldenPath',
  metadata: {
    name: 'example-golden-path',
    description: 'Example of golden path',
    tags: ['example', 'test'],
    title: 'Example Golden Path',
    annotations: {
      'backstage.io/managed-by-location': 'url:https://dev.azure.com',
    },
  },
  spec: {
    owner: 'me',
    type: 'migration',
    parameters: [],
    steps: [],
  },
});

const getMockAuthorizedConditionallyGoldenPath =
  (): GoldenPathEntityV1beta1 => ({
    apiVersion: 'backstage.io/v1beta1',
    kind: 'GoldenPath',
    metadata: {
      name: 'example-golden-path',
      description: 'Example of golden path',
      tags: ['example', 'test'],
      title: 'Example Golden Path',
      annotations: {
        'backstage.io/managed-by-location': 'url:https://dev.azure.com',
      },
    },
    spec: {
      owner: 'me',
      type: 'migration',
      parameters: [
        {
          type: 'object',
          required: [],
          'backstage:permissions': {
            tags: ['parameters-tag'],
          },
          properties: {
            optionalParameter: {
              type: 'string',
              description: 'Optional parameter',
            },
          },
        },
      ],
      steps: [
        {
          id: 'step-two',
          name: 'Second step',
          template: 'template:test/example-template',
          input: {
            message: 'hello',
          },
          'backstage:permissions': {
            tags: ['steps-tag'],
          },
        },
      ],
    },
  });

const mockUser: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'guest',
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

const catalogClient = catalogServiceMock.mock();

catalogClient.getEntityByRef.mockImplementation(async ref => {
  const { kind } = parseEntityRef(ref);

  if (kind.toLocaleLowerCase() === 'goldenpath') {
    return getMockGoldenPath();
  }

  if (kind.toLocaleLowerCase() === 'user') {
    return mockUser;
  }

  throw new Error(`no mock found for kind: ${kind}`);
});

jest.mock('@backstage/catalog-client', () => ({
  getEntityByRef: jest.fn(),
  CatalogClient: jest.fn().mockImplementation(() => {
    return catalogClient;
  }),
}));

jest.mock('@backstage/plugin-permission-node', () => ({
  ...jest.requireActual('@backstage/plugin-permission-node'),
  createConditionAuthorizer: jest.fn(),
}));

jest.mock('../util/checkPermissions.ts', () => ({
  checkPermission: jest.fn(),
  checkResourcePermission: jest.fn(),
}));

jest.mock('../util/authorizeGoldenPath', () => ({
  authorizeGoldenPath: jest.fn(),
}));

jest.mock('fs-extra', () => ({
  access: (...args: any[]) => mockAccess(...args),
  promises: {
    access: (...args: any[]) => mockAccess(...args),
  },
  constants: {
    F_OK: 0,
    W_OK: 1,
  },
  mkdir: jest.fn(),
  remove: jest.fn(),
}));

const databases = TestDatabases.create({
  ids: ['SQLITE_3'],
});

async function createDatabase(): Promise<DatabaseService> {
  const [[id]] = databases.eachSupportedId();
  const knex = await databases.init(id);

  return mockServices.database.mock({
    async getClient() {
      return knex;
    },
  });
}

const config = new ConfigReader({});

describe('createRouter', () => {
  let app: express.Express;
  let taskBroker: TaskBroker;
  const permissionApi = {
    authorize: jest.fn(),
    authorizeConditional: jest.fn(),
  } as unknown as PermissionEvaluator;
  const auth = mockServices.auth();
  const httpAuth = mockServices.httpAuth();
  const discovery = mockServices.discovery();
  const credentials = mockCredentials.user();
  const token = mockCredentials.service.token({
    onBehalfOf: credentials,
    targetPluginId: 'catalog',
  });
  const permissionsRegistry = mockServices.permissionsRegistry.mock();

  beforeEach(async () => {
    const databaseTaskStore = await DatabaseTaskStore.create({
      database: await createDatabase(),
      logger: defaultLogger,
    });
    const scaffolderClient = new ScaffolderClient({
      discoveryApi: discovery,
    });

    taskBroker = new StorageTaskBroker(databaseTaskStore, scaffolderClient);

    jest.spyOn(taskBroker, 'insertTask');
    jest.spyOn(taskBroker, 'getTask');
    jest.spyOn(taskBroker, 'getTasks');
    jest.spyOn(taskBroker, 'getTaskStepEvents');
    jest.spyOn(taskBroker, 'completeTask');
    jest.spyOn(taskBroker, 'cancelTask');
    jest.spyOn(taskBroker, 'getTaskStatuses');
    jest.spyOn(taskBroker, 'upsertTaskStep');
    jest.spyOn(taskBroker, 'getTaskStepId');
    jest.spyOn(taskBroker, 'upsertTaskStepStatus');
    jest.spyOn(taskBroker, 'getTaskStepStatus');
    jest.spyOn(taskBroker, 'getTaskStepEvents');
    jest.spyOn(taskBroker, 'getTaskStep');

    const router = await createRouter({
      logger: defaultLogger,
      config,
      database: await createDatabase(),
      taskBroker,
      permissions: permissionApi as unknown as PermissionsService,
      permissionsRegistry,
      auth,
      httpAuth,
      discovery,
    });
    app = express().use(router);

    jest
      .spyOn(permissionApi, 'authorizeConditional')
      .mockImplementation(async () => [
        {
          result: AuthorizeResult.ALLOW,
        },
        {
          result: AuthorizeResult.ALLOW,
        },
      ]);
    jest.spyOn(permissionApi, 'authorize').mockImplementation(async () => [
      {
        result: AuthorizeResult.ALLOW,
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /goldenpaths/:namespace/:kind/:name/parameter-schema', () => {
    it('returns the parameter schema', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(getMockGoldenPath());

      const response = await request(app)
        .get(
          '/goldenpaths/default/goldenpath/example-golden-path/parameter-schema',
        )
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        title: 'Example Golden Path',
        description: 'Example of golden path',
        steps: [
          {
            title: 'Please enter the following information',
            schema: {
              required: ['requiredParameter'],
              type: 'object',
              properties: {
                requiredParameter: {
                  description: 'Required parameter',
                  type: 'string',
                },
              },
            },
          },
          {
            title: 'Please enter the following information',
            schema: {
              type: 'object',
              required: [],
              'backstage:permissions': {
                tags: ['parameters-tag'],
              },
              properties: {
                optionalParameter: {
                  type: 'string',
                  description: 'Optional parameter',
                },
              },
            },
          },
        ],
      });
    });

    it('filters parameters that the user is not authorized to see', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(
        getMockNotAuthorizedGoldenPath(),
      );
      jest
        .spyOn(permissionApi, 'authorizeConditional')
        .mockImplementationOnce(async () => [
          {
            result: AuthorizeResult.DENY,
          },
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);
      const response = await request(app)
        .get(
          '/goldenpaths/default/goldenpath/example-golden-path/parameter-schema',
        )
        .send();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        title: 'Example Golden Path',
        description: 'Example of golden path',
        steps: [],
      });
    });

    it('filters parameters that the user is not authorized to see in case of conditional decision', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(
        getMockAuthorizedConditionallyGoldenPath(),
      );
      jest
        .spyOn(permissionApi, 'authorizeConditional')
        .mockImplementationOnce(async () => [
          {
            conditions: {
              resourceType: 'goldenpaths-goldenpath',
              rule: 'HAS_TAG',
              params: { tag: 'parameters-tag' },
            },
            pluginId: 'golden-paths',
            resourceType: 'goldenpaths-goldenpath',
            result: AuthorizeResult.CONDITIONAL,
          },
          {
            result: AuthorizeResult.ALLOW,
          },
        ]);
      const response = await request(app)
        .get(
          '/goldenpaths/default/goldenpath/example-golden-path/parameter-schema',
        )
        .send();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        title: 'Example Golden Path',
        description: 'Example of golden path',
        steps: [
          {
            title: 'Please enter the following information',
            schema: {
              type: 'object',
              required: [],
              'backstage:permissions': {
                tags: ['parameters-tag'],
              },
              properties: {
                optionalParameter: {
                  type: 'string',
                  description: 'Optional parameter',
                },
              },
            },
          },
        ],
      });
    });
  });

  describe('POST /tasks', () => {
    it('rejects golden path values which do not match the golden path schema definition', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(getMockGoldenPath());
      const response = await request(app)
        .post('/tasks')
        .send({
          goldenPathRef: stringifyEntityRef({
            kind: 'goldenpath',
            name: 'example-golden-path',
          }),
          values: {
            wrongParameter: 'wrongValue',
          },
        });

      expect(response.status).toEqual(400);
    });

    it('filters steps that the user is not authorized to see', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(
        getMockNotAuthorizedGoldenPath(),
      );
      jest
        .spyOn(permissionApi, 'authorizeConditional')
        .mockImplementation(async () => [
          {
            result: AuthorizeResult.ALLOW,
          },
          {
            result: AuthorizeResult.DENY,
          },
        ]);

      const broker =
        taskBroker.insertTask as jest.Mocked<TaskBroker>['insertTask'];
      const mockGoldenPath = getMockGoldenPath();

      await request(app)
        .post('/tasks')
        .send({
          goldenPathRef: stringifyEntityRef({
            kind: 'goldenpath',
            name: 'example-golden-path',
          }),
          values: {
            requiredParameter: 'required-value',
            optionalParameter: 'optional-value',
          },
        });
      expect(broker).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: 'user:default/mock',
          secrets: {
            backstageToken: token,
            __initiatorCredentials: JSON.stringify({
              ...credentials,
              // credentials.token is nonenumerable and will not be serialized, so we need to add it explicitly
              token: (credentials as any).token,
            }),
          },

          spec: {
            apiVersion: mockGoldenPath.apiVersion,
            steps: [],
            parameters: {
              requiredParameter: 'required-value',
              optionalParameter: 'optional-value',
            },
            user: {
              entity: mockUser,
              ref: 'user:default/mock',
            },
            goldenPathInfo: {
              entityRef: stringifyEntityRef({
                kind: 'GoldenPath',
                namespace: 'Default',
                name: mockGoldenPath.metadata?.name,
              }),
              baseUrl: 'https://dev.azure.com',
              entity: {
                metadata: mockGoldenPath.metadata,
              },
            },
          },
        }),
      );
    });

    it('filters steps that the user is not authorized to see in case of conditional decision', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(
        getMockAuthorizedConditionallyGoldenPath(),
      );
      jest
        .spyOn(permissionApi, 'authorizeConditional')
        .mockImplementation(async () => [
          {
            result: AuthorizeResult.ALLOW,
          },
          {
            conditions: {
              resourceType: 'goldenpaths-goldenpath',
              rule: 'HAS_TAG',
              params: { tag: 'steps-tag' },
            },
            pluginId: 'golden-paths',
            resourceType: 'goldenpaths-goldenpath',
            result: AuthorizeResult.CONDITIONAL,
          },
        ]);

      const broker =
        taskBroker.insertTask as jest.Mocked<TaskBroker>['insertTask'];
      const mockGoldenPath = getMockGoldenPath();
      await request(app)
        .post('/tasks')
        .send({
          goldenPathRef: stringifyEntityRef({
            kind: 'goldenpath',
            name: 'example-golden-path',
          }),
          values: {
            requiredParameter: 'required-value',
            optionalParameter: 'optional-value',
          },
        });
      expect(broker).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: 'user:default/mock',
          secrets: {
            backstageToken: token,
            __initiatorCredentials: JSON.stringify({
              ...credentials,
              // credentials.token is nonenumerable and will not be serialized, so we need to add it explicitly
              token: (credentials as any).token,
            }),
          },

          spec: {
            apiVersion: mockGoldenPath.apiVersion,
            steps: [
              {
                id: 'step-two',
                name: 'Second step',
                template: 'template:test/example-template',
                input: {
                  message: 'hello',
                },
                'backstage:permissions': {
                  tags: ['steps-tag'],
                },
              },
            ],
            parameters: {
              requiredParameter: 'required-value',
              optionalParameter: 'optional-value',
            },
            user: {
              entity: mockUser,
              ref: 'user:default/mock',
            },
            goldenPathInfo: {
              entityRef: stringifyEntityRef({
                kind: 'GoldenPath',
                namespace: 'Default',
                name: mockGoldenPath.metadata?.name,
              }),
              baseUrl: 'https://dev.azure.com',
              entity: {
                metadata: mockGoldenPath.metadata,
              },
            },
          },
        }),
      );
    });

    it('return the step id', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(getMockGoldenPath());
      const broker =
        taskBroker.insertTask as jest.Mocked<TaskBroker>['insertTask'];
      broker.mockResolvedValue({
        taskId: 'a-random-id',
      });

      const response = await request(app)
        .post('/tasks')
        .send({
          goldenPathRef: stringifyEntityRef({
            kind: 'goldenpath',
            name: 'example-golden-path',
          }),
          values: {
            requiredParameter: 'required-value',
            optionalParameter: 'optional-value',
          },
        });

      expect(response.body.id).toBe('a-random-id');
      expect(response.status).toEqual(201);
    });

    it('!!!!should call the broker with a correct spec', async () => {
      authorize.authorizeGoldenPath.mockResolvedValueOnce(getMockGoldenPath());
      const broker =
        taskBroker.insertTask as jest.Mocked<TaskBroker>['insertTask'];
      const mockToken = mockCredentials.user.token();
      const mockGoldenPath = getMockGoldenPath();

      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          goldenPathRef: stringifyEntityRef({
            kind: 'goldenpath',
            name: 'example-golden-path',
          }),
          values: {
            requiredParameter: 'required-value',
            optionalParameter: 'optional-value',
          },
        });

      expect(broker).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: 'user:default/mock',
          secrets: {
            backstageToken: token,
            __initiatorCredentials: JSON.stringify({
              ...credentials,
              // credentials.token is nonenumerable and will not be serialized, so we need to add it explicitly
              token: (credentials as any).token,
            }),
          },

          spec: {
            apiVersion: mockGoldenPath.apiVersion,
            steps: mockGoldenPath.spec.steps.map((step, index) => ({
              ...step,
              id: step.id ?? `step-${index + 1}`,
              name: step.name ?? step.template,
            })),
            parameters: {
              requiredParameter: 'required-value',
              optionalParameter: 'optional-value',
            },
            user: {
              entity: mockUser,
              ref: 'user:default/mock',
            },
            goldenPathInfo: {
              entityRef: stringifyEntityRef({
                kind: 'GoldenPath',
                namespace: 'Default',
                name: mockGoldenPath.metadata?.name,
              }),
              baseUrl: 'https://dev.azure.com',
              entity: {
                metadata: mockGoldenPath.metadata,
              },
            },
          },
        }),
      );
    });
  });

  describe('GET /tasks', () => {
    it('return all tasks', async () => {
      (
        taskBroker.getTasks as jest.Mocked<Required<TaskBroker>>['getTasks']
      ).mockResolvedValue({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as any,
            status: 'completed',
            createdAt: '',
            createdBy: '',
          },
        ],
        totalTasks: 1,
      });

      const response = await request(app).get(`/tasks`);
      expect(taskBroker.getTasks).toHaveBeenCalledWith({
        filters: {},
        pagination: {},
      });
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as any,
            status: 'completed',
            createdAt: '',
            createdBy: '',
          },
        ],
        totalTasks: 1,
      });
    });

    it('return filtered tasks', async () => {
      (
        taskBroker.getTasks as jest.Mocked<Required<TaskBroker>>['getTasks']
      ).mockResolvedValue({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as any,
            status: 'completed',
            createdAt: '',
            createdBy: 'user:default/foo',
          },
        ],
        totalTasks: 1,
      });

      const response = await request(app).get(
        `/tasks?createdBy=user:default/foo&createdBy=user:default/bar&status=completed&status=processing&limit=1&offset=0&order=desc:created_at`,
      );

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        tasks: [
          {
            id: 'a-random-id',
            spec: {} as any,
            status: 'completed',
            createdAt: '',
            createdBy: 'user:default/foo',
          },
        ],
        totalTasks: 1,
      });
      expect(taskBroker.getTasks).toHaveBeenCalledWith({
        filters: {
          createdBy: ['user:default/foo', 'user:default/bar'],
          status: ['completed', 'processing'],
        },
        pagination: {
          limit: 1,
          offset: 0,
        },
        order: [{ order: 'desc', field: 'created_at' }],
      });
    });
  });

  describe('GET /tasks/:taskId', () => {
    it('does not divulge secrets', async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });

      const response = await request(app).get(`/tasks/a-random-id`);
      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('completed');
      expect(response.body.secrets).toBeUndefined();
    });
  });

  describe('POST /tasks/:taskId/complete', () => {
    it("complete the task and return it's status", async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.completeTask as jest.Mocked<
          Required<TaskBroker>
        >['completeTask']
      ).mockImplementation();

      const response = await request(app).post(`/tasks/a-random-id/complete`);
      expect(taskBroker.completeTask).toHaveBeenCalledWith('a-random-id');
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        status: 'completed',
      });
    });
  });

  describe('POST /tasks/:taskId/cancel', () => {
    it("cancel the task and return it's status", async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.cancelTask as jest.Mocked<Required<TaskBroker>>['cancelTask']
      ).mockImplementation();

      const response = await request(app).post(`/tasks/a-random-id/cancel`);
      expect(taskBroker.cancelTask).toHaveBeenCalledWith(
        expect.objectContaining({ taskId: 'a-random-id' }),
      );
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        status: 'cancelled',
      });
    });
  });

  describe('GET /tasks/:taskId/statuses', () => {
    it('list the task statuses', async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.getTaskStatuses as jest.Mocked<
          Required<TaskBroker>
        >['getTaskStatuses']
      ).mockResolvedValue([
        {
          taskId: 'a-random-id',
          templateId: 'first-template',
          status: 'completed',
        },
        {
          taskId: 'a-random-id',
          templateId: 'second-template',
          status: 'processing',
        },
      ]);

      const response = await request(app).get(`/tasks/a-random-id/statuses`);
      expect(taskBroker.getTaskStatuses).toHaveBeenCalledWith('a-random-id');
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        statuses: [
          {
            taskId: 'a-random-id',
            templateId: 'first-template',
            status: 'completed',
          },
          {
            taskId: 'a-random-id',
            templateId: 'second-template',
            status: 'processing',
          },
        ],
      });
    });
  });

  describe('POST /tasks/:taskId/templates/:templateId', () => {
    it('update the task step reference', async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.upsertTaskStep as jest.Mocked<
          Required<TaskBroker>
        >['upsertTaskStep']
      ).mockImplementation();

      const response = await request(app)
        .post(`/tasks/a-random-id/templates/firstTemplate`)
        .send({
          templateRef: 'template:development/dummy-template',
          values: {
            message: 'test',
          },
          secrets: {},
        });
      expect(taskBroker.upsertTaskStep).toHaveBeenCalledWith(
        'a-random-id',
        'firstTemplate',
        {
          secrets: {},
          templateRef: 'template:development/dummy-template',
          values: { message: 'test' },
        },
        expect.anything(),
      );
      expect(response.status).toEqual(200);
    });
  });

  describe('GET /tasks/:taskId/templates/:templateId', () => {
    it('return task step ID', async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.getTaskStepId as jest.Mocked<TaskBroker>['getTaskStepId']
      ).mockResolvedValue('step-id');

      const response = await request(app).get(
        `/tasks/a-random-id/templates/firstTemplate`,
      );

      expect(taskBroker.getTaskStepId).toHaveBeenCalledWith({
        taskId: 'a-random-id',
        templateId: 'firstTemplate',
      });
      expect(response.status).toEqual(200);
      expect(response.body.id).toBe('step-id');
    });
  });

  describe('POST /tasks/:taskId/templates/:templateId/status', () => {
    it("store task step status and return it's value", async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.upsertTaskStepStatus as jest.Mocked<
          Required<TaskBroker>
        >['upsertTaskStepStatus']
      ).mockResolvedValue('completed');

      const response = await request(app)
        .post(`/tasks/a-random-id/templates/firstTemplate/status`)
        .send({
          status: 'completed',
        });
      expect(taskBroker.upsertTaskStepStatus).toHaveBeenCalledWith({
        taskId: 'a-random-id',
        templateId: 'firstTemplate',
        status: 'completed',
      });
      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('completed');
    });
  });

  describe('GET /tasks/:taskId/templates/:templateId/status', () => {
    it('get status for task step', async () => {
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.getTaskStepStatus as jest.Mocked<
          Required<TaskBroker>
        >['getTaskStepStatus']
      ).mockResolvedValue('completed');

      const response = await request(app).get(
        `/tasks/a-random-id/templates/firstTemplate/status`,
      );

      expect(taskBroker.getTaskStepStatus).toHaveBeenCalledWith({
        taskId: 'a-random-id',
        templateId: 'firstTemplate',
      });
      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('completed');
    });
  });

  describe('GET /tasks/:taskId/steps/:stepId/eventstream', () => {
    it('should return log messages', async () => {
      let subscriber: ZenObservable.SubscriptionObserver<any>;
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.getTaskStep as jest.Mocked<
          Required<TaskBroker>
        >['getTaskStep']
      ).mockResolvedValue({
        taskId: 'a-random-id',
        templateId: 'firstTemplate',
        stepId: 'step-id',
      });
      (
        taskBroker.upsertTaskStepStatus as jest.Mocked<
          Required<TaskBroker>
        >['upsertTaskStepStatus']
      ).mockResolvedValue('completed');
      (
        taskBroker.getTaskStepEvents as jest.Mocked<TaskBroker>['getTaskStepEvents']
      ).mockImplementation(({ stepId }) => {
        return new ObservableImpl(observer => {
          subscriber = observer;
          setImmediate(() => {
            observer.next({
              events: [
                {
                  id: 0,
                  taskId: stepId,
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
                  taskId: stepId,
                  type: 'completion',
                  createdAt: '',
                  body: { message: 'completed' },
                },
              ],
            });
          });
        });
        // emit after this function returned
      });

      let statusCode: any = undefined;
      let headers: any = {};
      const responseDataFn = jest.fn();

      const req = request(app)
        .get('/tasks/a-random-id/steps/step-id/eventstream')
        .set('accept', 'text/event-stream')
        .parse((res, _) => {
          ({ statusCode, headers } = res as any);

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
data: {"id":0,"taskId":"step-id","type":"log","createdAt":"","body":{"message":"My log message"}}

`);
      expect(responseDataFn).toHaveBeenCalledWith(`event: completion
data: {"id":1,"taskId":"step-id","type":"completion","createdAt":"","body":{"message":"completed"}}

`);

      expect(taskBroker.getTaskStep).toHaveBeenCalledTimes(1);
      expect(taskBroker.getTaskStep).toHaveBeenCalledWith('step-id');

      expect(taskBroker.getTaskStepEvents).toHaveBeenCalledTimes(1);
      expect(taskBroker.getTaskStepEvents).toHaveBeenCalledWith(
        expect.objectContaining({ stepId: 'step-id' }),
      );
      expect(subscriber!.closed).toBe(true);

      expect(taskBroker.upsertTaskStepStatus).toHaveBeenCalledTimes(1);
      expect(taskBroker.upsertTaskStepStatus).toHaveBeenCalledWith({
        taskId: 'a-random-id',
        templateId: 'firstTemplate',
        status: 'completed',
      });
    });

    it('should return log messages with after query', async () => {
      let subscriber: ZenObservable.SubscriptionObserver<any>;
      (
        taskBroker.getTask as jest.Mocked<TaskBroker>['getTask']
      ).mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: {
          backstageToken: token,
          __initiatorCredentials: JSON.stringify(credentials),
        },
        createdBy: '',
      });
      (
        taskBroker.getTaskStep as jest.Mocked<
          Required<TaskBroker>
        >['getTaskStep']
      ).mockResolvedValue({
        taskId: 'a-random-id',
        templateId: 'firstTemplate',
        stepId: 'step-id',
      });
      (
        taskBroker.upsertTaskStepStatus as jest.Mocked<
          Required<TaskBroker>
        >['upsertTaskStepStatus']
      ).mockResolvedValue('completed');
      (
        taskBroker.getTaskStepEvents as jest.Mocked<TaskBroker>['getTaskStepEvents']
      ).mockImplementation(({ stepId }) => {
        return new ObservableImpl(observer => {
          subscriber = observer;
          setImmediate(() => {
            observer.next({
              events: [
                {
                  id: 1,
                  taskId: stepId,
                  type: 'completion',
                  createdAt: '',
                  body: { message: 'completed' },
                },
              ],
            });
          });
        });
      });

      let statusCode: any = undefined;
      let headers: any = {};

      const req = request(app)
        .get('/tasks/a-random-id/steps/step-id/eventstream')
        .query({ after: 10 })
        .set('accept', 'text/event-stream')
        .parse((res, _) => {
          ({ statusCode, headers } = res as any);

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

      expect(taskBroker.getTaskStepEvents).toHaveBeenCalledTimes(1);
      expect(taskBroker.getTaskStepEvents).toHaveBeenCalledWith({
        stepId: 'step-id',
        after: 10,
        headers: expect.anything(),
      });

      expect(subscriber!.closed).toBe(true);
    });
  });
});
