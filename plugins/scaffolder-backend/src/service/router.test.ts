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

const mockAccess = jest.fn();
jest.doMock('fs-extra', () => ({
  access: mockAccess,
  promises: {
    access: mockAccess,
  },
  constants: {
    F_OK: 0,
    W_OK: 1,
  },
  mkdir: jest.fn(),
  remove: jest.fn(),
}));

import {
  DatabaseManager,
  DockerContainerRunner,
  getVoidLogger,
  PluginDatabaseManager,
  UrlReaders,
} from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { TemplateEntityV1beta2 } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
/**
 * TODO: The following should import directly from the router file.
 * Due to a circular dependency between this plugin and the
 * plugin-scaffolder-backend-module-cookiecutter plugin, it results in an error:
 * TypeError: _pluginscaffolderbackend.createTemplateAction is not a function
 */
import { createRouter } from '../index';
import { StorageTaskBroker } from '../scaffolder/tasks/StorageTaskBroker';

jest.mock('../scaffolder/tasks');

const MockStorageTaskBroker: jest.MockedClass<typeof StorageTaskBroker> =
  StorageTaskBroker as any;

const createCatalogClient = (templates: any[] = []) =>
  ({
    getEntities: async () => ({ items: templates }),
  } as CatalogApi);

function createDatabase(): PluginDatabaseManager {
  return DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('scaffolder');
}

const mockUrlReader = UrlReaders.default({
  logger: getVoidLogger(),
  config: new ConfigReader({}),
});

describe('createRouter', () => {
  let app: express.Express;
  const template: TemplateEntityV1beta2 = {
    apiVersion: 'backstage.io/v1beta2',
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
      steps: [],
      parameters: {
        type: 'object',
        required: ['required'],
        properties: {
          required: {
            type: 'string',
            description: 'Required parameter',
          },
        },
      },
    },
  };

  beforeEach(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: new ConfigReader({}),
      database: createDatabase(),
      catalogClient: createCatalogClient([template]),
      containerRunner: new DockerContainerRunner({} as any),
      reader: mockUrlReader,
    });
    app = express().use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /v2/actions', () => {
    it('lists available actions', async () => {
      const response = await request(app).get('/v2/actions').send();
      expect(response.status).toEqual(200);
      expect(response.body[0].id).toBeDefined();
      expect(response.body.length).toBeGreaterThan(8);
    });
  });

  describe('POST /v2/tasks', () => {
    it('rejects template values which do not match the template schema definition', async () => {
      const response = await request(app)
        .post('/v2/tasks')
        .send({
          templateName: 'create-react-app-template',
          values: {
            storePath: 'https://github.com/backstage/backstage',
          },
        });

      expect(response.status).toEqual(400);
    });

    it('return the template id', async () => {
      MockStorageTaskBroker.prototype.dispatch.mockResolvedValue({
        taskId: 'a-random-id',
      });

      const response = await request(app)
        .post('/v2/tasks')
        .send({
          templateName: 'create-react-app-template',
          values: {
            required: 'required-value',
          },
        });

      expect(response.body.id).toBe('a-random-id');
      expect(response.status).toEqual(201);
    });
  });

  describe('GET /v2/tasks/:taskId', () => {
    it('does not divulge secrets', async () => {
      MockStorageTaskBroker.prototype.get.mockResolvedValue({
        id: 'a-random-id',
        spec: {} as any,
        status: 'completed',
        createdAt: '',
        secrets: { token: 'secret' },
      });

      const response = await request(app).get(`/v2/tasks/a-random-id`);
      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('completed');
      expect(response.body.secrets).toBeUndefined();
    });
  });

  describe('GET /v2/tasks/:taskId/eventstream', () => {
    it('should return log messages', async () => {
      const unsubscribe = jest.fn();
      MockStorageTaskBroker.prototype.observe.mockImplementation(
        ({ taskId }, callback) => {
          // emit after this function returned
          setImmediate(() => {
            callback(undefined, {
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
            callback(undefined, {
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

          return unsubscribe;
        },
      );

      let statusCode: any = undefined;
      let headers: any = {};
      const responseDataFn = jest.fn();

      const req = request(app)
        .get('/v2/tasks/a-random-id/eventstream')
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
      expect(responseDataFn).toBeCalledTimes(2);
      expect(responseDataFn).toBeCalledWith(`event: log
data: {"id":0,"taskId":"a-random-id","type":"log","createdAt":"","body":{"message":"My log message"}}

`);
      expect(responseDataFn).toBeCalledWith(`event: completion
data: {"id":1,"taskId":"a-random-id","type":"completion","createdAt":"","body":{"message":"Finished!"}}

`);

      expect(MockStorageTaskBroker.prototype.observe).toBeCalledTimes(1);
      expect(MockStorageTaskBroker.prototype.observe).toBeCalledWith(
        { taskId: 'a-random-id' },
        expect.any(Function),
      );

      expect(unsubscribe).toBeCalledTimes(1);
    });

    it('should return log messages with after query', async () => {
      const unsubscribe = jest.fn();
      MockStorageTaskBroker.prototype.observe.mockImplementation(
        ({ taskId }, callback) => {
          setImmediate(() => {
            callback(undefined, {
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
          return unsubscribe;
        },
      );

      let statusCode: any = undefined;
      let headers: any = {};

      const req = request(app)
        .get('/v2/tasks/a-random-id/eventstream')
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

      expect(MockStorageTaskBroker.prototype.observe).toBeCalledTimes(1);
      expect(MockStorageTaskBroker.prototype.observe).toBeCalledWith(
        { taskId: 'a-random-id', after: 10 },
        expect.any(Function),
      );

      expect(unsubscribe).toBeCalledTimes(1);
    });
  });

  describe('GET /v2/tasks/:taskId/events', () => {
    it('should return log messages', async () => {
      const unsubscribe = jest.fn();
      MockStorageTaskBroker.prototype.observe.mockImplementation(
        ({ taskId }, callback) => {
          callback(undefined, {
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
          return unsubscribe;
        },
      );

      const response = await request(app).get('/v2/tasks/a-random-id/events');

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

      expect(MockStorageTaskBroker.prototype.observe).toBeCalledTimes(1);
      expect(MockStorageTaskBroker.prototype.observe).toBeCalledWith(
        { taskId: 'a-random-id' },
        expect.any(Function),
      );
      expect(unsubscribe).toBeCalledTimes(1);
    });

    it('should return log messages with after query', async () => {
      const unsubscribe = jest.fn();
      MockStorageTaskBroker.prototype.observe.mockImplementation(
        (_, callback) => {
          callback(undefined, { events: [] });
          return unsubscribe;
        },
      );

      const response = await request(app)
        .get('/v2/tasks/a-random-id/events')
        .query({ after: 10 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);

      expect(MockStorageTaskBroker.prototype.observe).toBeCalledTimes(1);
      expect(MockStorageTaskBroker.prototype.observe).toBeCalledWith(
        { taskId: 'a-random-id', after: 10 },
        expect.any(Function),
      );
      expect(unsubscribe).toBeCalledTimes(1);
    });
  });
});
