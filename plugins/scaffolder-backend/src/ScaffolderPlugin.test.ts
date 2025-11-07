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
import { IncomingMessage } from 'http';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { scaffolderAutocompleteExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

import { scaffolderPlugin } from './ScaffolderPlugin';

describe('scaffolderPlugin', () => {
  const mockTemplateEntity = {
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
    },
  } satisfies TemplateEntityV1beta3;

  it('supports fetching template parameters schema', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    const { body, status } = await request(server).get(
      '/api/scaffolder/v2/templates/default/template/create-react-app-template/parameter-schema',
    );

    expect(status).toBe(200);

    expect(body).toMatchObject({
      description: 'Create a new CRA website project',
      steps: [
        {
          schema: {
            properties: {
              requiredParameter1: {
                description: 'Required parameter 1',
                type: 'string',
              },
            },
            required: ['requiredParameter1'],
            type: 'object',
          },
          title: 'Please enter the following information',
        },
        {
          schema: {
            'backstage:permissions': { tags: ['parameters-tag'] },
            properties: {
              requiredParameter2: {
                description: 'Required parameter 2',
                type: 'string',
              },
            },
            required: ['requiredParameter2'],
            type: 'object',
          },
          title: 'Please enter the following information',
        },
      ],
      title: 'Create React App Template',
    });
  });

  it('supports listing actions', async () => {
    const { server } = await startTestBackend({
      features: [scaffolderPlugin],
    });

    const { body, status } = await request(server).get(
      '/api/scaffolder/v2/actions',
    );

    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Array);

    const actionSchema = {
      id: expect.any(String),
      description: expect.any(String),
      examples: expect.any(Array),
      schema: expect.any(Object),
    };

    // General cursory check
    body.forEach((action: any) => expect(action).toMatchObject(actionSchema));

    expect(body).toContainEqual({
      id: 'fetch:plain',
      description:
        'Downloads content and places it in the workspace, or optionally in a subdirectory specified by the `targetPath` input option.',
      examples: [
        {
          description: 'Downloads content and places it in the workspace.',
          example:
            'steps:\n  - action: fetch:plain\n    id: fetch-plain\n    name: Fetch plain\n    input:\n      url: https://github.com/backstage/community/tree/main/backstage-community-sessions/assets\n',
        },
        {
          description:
            'Optionally, if you would prefer the data to be downloaded to a subdirectory in the workspace you may specify the ‘targetPath’ input option.',
          example:
            'steps:\n  - action: fetch:plain\n    id: fetch-plain\n    name: Fetch plain\n    input:\n      url: https://github.com/backstage/community/tree/main/backstage-community-sessions/assets\n      targetPath: fetched-data\n',
        },
      ],
      schema: {
        input: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description:
                'Relative path or absolute URL pointing to the directory tree to fetch',
            },
            targetPath: {
              type: 'string',
              description:
                'Target path within the working directory to download the contents to.',
            },
            token: {
              type: 'string',
              description:
                'An optional token to use for authentication when reading the resources.',
            },
          },
          required: ['url'],
          additionalProperties: false,
          $schema: 'http://json-schema.org/draft-07/schema#',
        },
      },
    });
  });

  it('supports listing tasks', async () => {
    const { server } = await startTestBackend({
      features: [scaffolderPlugin],
    });

    const { body, status } = await request(server).get(
      '/api/scaffolder/v2/tasks',
    );

    expect(status).toBe(200);
    expect(body).toMatchObject({ tasks: [], totalTasks: 0 });
  });

  it('rejects creating tasks if template schema definition mismatches', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
      .send({
        templateRef: stringifyEntityRef({
          kind: 'template',
          name: 'create-react-app-template',
        }),
        values: {
          storePath: 'https://github.com/backstage/backstage',
        },
      });

    expect(response.status).toBe(400);
  });

  it('supports creating tasks', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tasks: expect.any(Array),
      totalTasks: 1,
    });

    const { tasks } = response.body;
    expect(tasks.length).toBe(1);
    expect(tasks).toContainEqual({
      createdAt: expect.any(String),
      createdBy: 'user:default/mock',
      id: taskId,
      lastHeartbeatAt: expect.any(String),
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        output: {},
        parameters: {
          requiredParameter1: 'required-value-1',
          requiredParameter2: 'required-value-2',
        },
        steps: [
          {
            action: 'debug:log',
            id: 'step-one',
            input: { message: 'hello' },
            name: 'First log',
          },
          {
            action: 'debug:log',
            'backstage:permissions': { tags: ['steps-tag'] },
            id: 'step-two',
            input: { message: 'world' },
            name: 'Second log',
          },
        ],
        templateInfo: {
          baseUrl: 'https://dev.azure.com',
          entity: {
            metadata: {
              annotations: {
                'backstage.io/managed-by-location': 'url:https://dev.azure.com',
              },
              description: 'Create a new CRA website project',
              name: 'create-react-app-template',
              tags: ['experimental', 'react', 'cra'],
              title: 'Create React App Template',
            },
          },
          entityRef: 'template:default/create-react-app-template',
        },
        user: { ref: 'user:default/mock' },
      },
      status: 'completed',
    });
  });

  it('emits auditlog containing user identifier when backstage auth is passed', async () => {
    const mockLogger = mockServices.logger.mock();
    mockLogger.child.mockReturnValue(mockLogger);
    const loggerSpy = jest.spyOn(mockLogger, 'info');

    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
        mockLogger.factory,
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    expect(loggerSpy).toHaveBeenCalledTimes(10);
    expect(loggerSpy).toHaveBeenNthCalledWith(
      3,
      'Scaffolding task for template:default/create-react-app-template created by user:default/mock',
    );
  });

  it('supports fetching a task by ID', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to lookup
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    // Get the task by ID
    response = await request(server).get(`/api/scaffolder/v2/tasks/${taskId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      createdAt: expect.any(String),
      createdBy: 'user:default/mock',
      id: taskId,
      lastHeartbeatAt: expect.any(String),
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        output: {},
        parameters: {
          requiredParameter1: 'required-value-1',
          requiredParameter2: 'required-value-2',
        },
        steps: [
          {
            action: 'debug:log',
            id: 'step-one',
            input: { message: 'hello' },
            name: 'First log',
          },
          {
            action: 'debug:log',
            'backstage:permissions': { tags: ['steps-tag'] },
            id: 'step-two',
            input: { message: 'world' },
            name: 'Second log',
          },
        ],
        templateInfo: {
          baseUrl: 'https://dev.azure.com',
          entity: {
            metadata: {
              annotations: {
                'backstage.io/managed-by-location': 'url:https://dev.azure.com',
              },
              description: 'Create a new CRA website project',
              name: 'create-react-app-template',
              tags: ['experimental', 'react', 'cra'],
              title: 'Create React App Template',
            },
          },
          entityRef: 'template:default/create-react-app-template',
        },
        user: {
          ref: 'user:default/mock',
        },
      },
      status: 'completed',
    });
    expect(response.body.secrets).toBeUndefined();
  });

  it('supports listing tasks using a filter', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to lookup
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    // Confirm non-matching `createdBy` filter does not return any results
    let { body, status } = await request(server).get(
      '/api/scaffolder/v2/tasks?createdBy=user:default/foo&status=completed&limit=1&offset=0&order=desc:created_at',
    );

    expect(status).toBe(200);
    expect(body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Confirm matching `createdBy` filter returns the expected result
    ({ body, status } = await request(server).get(
      '/api/scaffolder/v2/tasks?createdBy=user:default/mock&status=completed&limit=1&offset=0&order=desc:created_at',
    ));

    expect(status).toBe(200);
    expect(body).toMatchObject({
      tasks: [
        {
          createdAt: expect.any(String),
          createdBy: 'user:default/mock',
          id: taskId,
          lastHeartbeatAt: expect.any(String),
          spec: {
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            output: {},
            parameters: {
              requiredParameter1: 'required-value-1',
              requiredParameter2: 'required-value-2',
            },
            steps: [
              {
                action: 'debug:log',
                id: 'step-one',
                input: { message: 'hello' },
                name: 'First log',
              },
              {
                action: 'debug:log',
                'backstage:permissions': { tags: ['steps-tag'] },
                id: 'step-two',
                input: { message: 'world' },
                name: 'Second log',
              },
            ],
            templateInfo: {
              baseUrl: 'https://dev.azure.com',
              entity: {
                metadata: {
                  annotations: {
                    'backstage.io/managed-by-location':
                      'url:https://dev.azure.com',
                  },
                  description: 'Create a new CRA website project',
                  name: 'create-react-app-template',
                  tags: ['experimental', 'react', 'cra'],
                  title: 'Create React App Template',
                },
              },
              entityRef: 'template:default/create-react-app-template',
            },
            user: { ref: 'user:default/mock' },
          },
          status: 'completed',
        },
      ],
      totalTasks: 1,
    });
  });

  it('supports canceling a task by ID', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to cancel
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    // Cancel the task by ID
    response = await request(server).post(
      `/api/scaffolder/v2/tasks/${taskId}/cancel`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'cancelled',
    });
  });

  it('supports retrying a task by ID', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to retry
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    // Retry the task by ID
    response = await request(server)
      .post(`/api/scaffolder/v2/tasks/${taskId}/retry`)
      .send({});

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: taskId });

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });
  });

  it('supports fetching event stream for a task', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to fetch event stream for
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    let statusCode: IncomingMessage['statusCode'] = undefined;
    let headers: IncomingMessage['headers'] = {};
    const responseDataFn = jest.fn();

    // Get event stream for the task
    const req = request(server)
      .get(`/api/scaffolder/v2/tasks/${taskId}/eventstream`)
      .set('accept', 'text/event-stream')
      .parse((res, _) => {
        ({ statusCode, headers } = res as unknown as IncomingMessage);

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
    expect(responseDataFn).toHaveBeenCalledTimes(10);
    expect(responseDataFn).toHaveBeenLastCalledWith(
      expect.stringContaining(taskId),
    );
    expect(responseDataFn).toHaveBeenLastCalledWith(
      expect.stringContaining('event: completion'),
    );
  });

  it('supports fetching event stream for a task with after query', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to fetch event stream for
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    let statusCode: IncomingMessage['statusCode'] = undefined;
    let headers: IncomingMessage['headers'] = {};
    const responseDataFn = jest.fn();

    // Get event stream for the task
    const req = request(server)
      .get(`/api/scaffolder/v2/tasks/${taskId}/eventstream`)
      .query({ after: 8 }) // out of 10 events
      .set('accept', 'text/event-stream')
      .parse((res, _) => {
        ({ statusCode, headers } = res as unknown as IncomingMessage);

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
    expect(responseDataFn).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(taskId),
    );
    expect(responseDataFn).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('event: log'),
    );
    expect(responseDataFn).toHaveBeenLastCalledWith(
      expect.stringContaining(taskId),
    );
    expect(responseDataFn).toHaveBeenLastCalledWith(
      expect.stringContaining('event: completion'),
    );
  });

  it('supports fetching events for a task', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to fetch events for
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    // Get events for the task
    response = await request(server).get(
      `/api/scaffolder/v2/tasks/${taskId}/events`,
    );

    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(10);
    expect(response.body).toContainEqual({
      body: { message: 'Starting up task with 2 steps' },
      id: 1,
      isTaskRecoverable: false,
      taskId: taskId,
      type: 'log',
      createdAt: expect.any(String),
    });
    expect(response.body).toContainEqual({
      body: { message: 'Run completed with status: completed', output: {} },
      id: 10,
      isTaskRecoverable: false,
      taskId: taskId,
      type: 'completion',
      createdAt: expect.any(String),
    });
  });

  it('supports fetching events for a task with after query', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    // Confirm no tasks are present
    let response = await request(server).get('/api/scaffolder/v2/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ tasks: [], totalTasks: 0 });

    // Create a task to fetch events for
    response = await request(server)
      .post('/api/scaffolder/v2/tasks')
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

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(String) });

    const { id: taskId } = response.body;

    // Wait for task to complete
    await waitForExpect(async () => {
      response = await request(server).get(
        `/api/scaffolder/v2/tasks/${taskId}`,
      );

      expect(response.body).toMatchObject({
        status: 'completed',
      });
    });

    // Get events for the task
    response = await request(server)
      .get(`/api/scaffolder/v2/tasks/${taskId}/events`)
      .query({ after: 8 }); // out of 10 events

    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toContainEqual({
      body: {
        message: 'Finished step Second log',
        status: 'completed',
        stepId: 'step-two',
      },
      createdAt: expect.any(String),
      id: 9,
      isTaskRecoverable: false,
      taskId: taskId,
      type: 'log',
    });
    expect(response.body).toContainEqual({
      body: { message: 'Run completed with status: completed', output: {} },
      createdAt: expect.any(String),
      id: 10,
      isTaskRecoverable: false,
      taskId: taskId,
      type: 'completion',
    });
  });

  it('supports performing a dry-run of a template', async () => {
    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        catalogServiceMock.factory({
          entities: [mockTemplateEntity],
        }),
      ],
    });

    const { body, status } = await request(server)
      .post('/api/scaffolder/v2/dry-run')
      .auth(mockCredentials.user.token(), { type: 'bearer' })
      .send({
        template: mockTemplateEntity,
        values: {
          requiredParameter1: 'required-value-1',
          requiredParameter2: 'required-value-2',
        },
        directoryContents: [],
      });

    expect(status).toBe(200);
    expect(body).toMatchObject({
      log: [
        { body: { message: 'Starting up task with 3 steps' } },
        {
          body: {
            stepId: 'step-one',
            status: 'processing',
            message: 'Beginning step First log',
          },
        },
        {
          body: {
            stepId: 'step-one',
            message:
              '\u001b[32minfo\u001b[39m: Running debug:log in dry-run mode with inputs (secrets redacted): {\n  "message": "hello"\n}',
          },
        },
        {
          body: {
            stepId: 'step-one',
            message: '\u001b[32minfo\u001b[39m: {\n  "message": "hello"\n}',
          },
        },
        {
          body: {
            stepId: 'step-one',
            message: '\u001b[32minfo\u001b[39m: hello',
          },
        },
        {
          body: {
            stepId: 'step-one',
            status: 'completed',
            message: 'Finished step First log',
          },
        },
        {
          body: {
            stepId: 'step-two',
            status: 'processing',
            message: 'Beginning step Second log',
          },
        },
        {
          body: {
            stepId: 'step-two',
            message:
              '\u001b[32minfo\u001b[39m: Running debug:log in dry-run mode with inputs (secrets redacted): {\n  "message": "world"\n}',
          },
        },
        {
          body: {
            stepId: 'step-two',
            message: '\u001b[32minfo\u001b[39m: {\n  "message": "world"\n}',
          },
        },
        {
          body: {
            stepId: 'step-two',
            message: '\u001b[32minfo\u001b[39m: world',
          },
        },
        {
          body: {
            stepId: 'step-two',
            status: 'completed',
            message: 'Finished step Second log',
          },
        },
      ],
      directoryContents: [],
      output: {},
      steps: [
        {
          id: 'step-one',
          name: 'First log',
          action: 'debug:log',
          input: { message: 'hello' },
        },
        {
          id: 'step-two',
          name: 'Second log',
          action: 'debug:log',
          input: { message: 'world' },
          'backstage:permissions': { tags: ['steps-tag'] },
        },
      ],
    });
  });

  it('supports performing an autocomplete for a given provider and resource', async () => {
    const handleAutocompleteRequest = jest.fn().mockResolvedValue({
      results: [{ title: 'blob' }],
    });

    const mockContext = { mock: 'context' };
    const mockToken = 'mocktoken';

    const { server } = await startTestBackend({
      features: [
        scaffolderPlugin,
        createBackendModule({
          pluginId: 'scaffolder',
          moduleId: 'custom-extensions',
          register(env) {
            env.registerInit({
              deps: {
                scaffolder: scaffolderAutocompleteExtensionPoint,
              },
              async init({ scaffolder }) {
                scaffolder.addAutocompleteProvider({
                  id: 'test-provider',
                  handler: handleAutocompleteRequest,
                });
              },
            });
          },
        }),
      ],
    });

    const { body, status } = await request(server)
      .post('/api/scaffolder/v2/autocomplete/test-provider/my-resource')
      .send({
        token: mockToken,
        context: mockContext,
      });

    expect(status).toBe(200);
    expect(body).toMatchObject({ results: [{ title: 'blob' }] });

    expect(handleAutocompleteRequest).toHaveBeenCalledWith({
      context: mockContext,
      resource: 'my-resource',
      token: mockToken,
    });
  });

  it('supports listing templating extensions', async () => {
    const { server } = await startTestBackend({
      features: [scaffolderPlugin],
    });

    const { body, status } = await request(server).get(
      '/api/scaffolder/v2/templating-extensions',
    );

    expect(status).toBe(200);
    expect(body).toMatchObject({
      filters: expect.objectContaining({
        parseRepoUrl: expect.objectContaining({
          description: expect.any(String),
          examples: expect.any(Array),
          schema: expect.objectContaining({
            input: expect.any(Object),
            output: expect.any(Object),
          }),
        }),
        parseEntityRef: expect.objectContaining({
          description: expect.any(String),
          examples: expect.any(Array),
          schema: expect.objectContaining({
            input: expect.any(Object),
            output: expect.any(Object),
          }),
        }),
        pick: expect.objectContaining({
          description: expect.any(String),
          examples: expect.any(Array),
          schema: expect.objectContaining({
            input: expect.any(Object),
            output: expect.any(Object),
          }),
        }),
        projectSlug: expect.objectContaining({
          description: expect.any(String),
          examples: expect.any(Array),
          schema: expect.objectContaining({
            input: expect.any(Object),
            output: expect.any(Object),
          }),
        }),
      }),
      globals: { functions: {}, values: {} },
    });
  });
});
