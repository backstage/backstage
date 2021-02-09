/*
 * Copyright 2020 Spotify AB
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
  SingleConnectionDatabaseManager,
  PluginDatabaseManager,
  getVoidLogger,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { Templaters, Preparers, Publishers } from '../scaffolder';
import Docker from 'dockerode';

jest.mock('dockerode');

const generateEntityClient: any = (template: any) => ({
  findTemplate: () => Promise.resolve(template),
});

function createDatabase(): PluginDatabaseManager {
  return SingleConnectionDatabaseManager.fromConfig(
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

describe('createRouter - working directory', () => {
  const mockPrepare = jest.fn();
  const mockPreparers = new Preparers();

  beforeAll(() => {
    const mockPreparer = {
      prepare: mockPrepare,
    };
    mockPreparers.register('dev.azure.com', mockPreparer);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const workDirConfig = (path: string) => ({
    backend: {
      workingDirectory: path,
    },
  });

  const template = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Template',
    metadata: {
      annotations: {
        'backstage.io/managed-by-location': 'url:https://dev.azure.com',
      },
    },
    spec: {
      owner: 'template@backstage.io',
      path: '.',
      schema: {},
    },
  };

  const mockedEntityClient = generateEntityClient(template);
  it('should throw an error when working directory does not exist or is not writable', async () => {
    mockAccess.mockImplementation(() => {
      throw new Error('access error');
    });

    await expect(
      createRouter({
        logger: getVoidLogger(),
        preparers: new Preparers(),
        templaters: new Templaters(),
        publishers: new Publishers(),
        config: new ConfigReader(workDirConfig('/path')),
        dockerClient: new Docker(),
        entityClient: mockedEntityClient,
        database: createDatabase(),
      }),
    ).rejects.toThrow('access error');
  });

  it('should use the working directory when configured', async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      preparers: mockPreparers,
      templaters: new Templaters(),
      publishers: new Publishers(),
      config: new ConfigReader(workDirConfig('/path')),
      dockerClient: new Docker(),
      entityClient: mockedEntityClient,
      database: createDatabase(),
    });

    const app = express().use(router);
    await request(app)
      .post('/v1/jobs')
      .send({
        templateName: '',
        values: {
          storePath: 'https://github.com/backstage/good',
        },
      });

    expect(mockPrepare).toBeCalledWith({
      logger: expect.anything(),
      workspacePath: expect.stringContaining('path'),
      url: expect.anything(),
    });
  });

  it('should not pass along anything when no working directory is configured', async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      preparers: mockPreparers,
      templaters: new Templaters(),
      publishers: new Publishers(),
      config: new ConfigReader({}),
      dockerClient: new Docker(),
      entityClient: mockedEntityClient,
      database: createDatabase(),
    });

    const app = express().use(router);
    await request(app)
      .post('/v1/jobs')
      .send({
        templateName: '',
        values: {
          storePath: 'https://github.com/backstage/goodrepo',
        },
      });

    expect(mockPrepare).toBeCalledWith({
      logger: expect.anything(),
      workspacePath: expect.anything(),
      url: expect.anything(),
    });
  });
});

describe('createRouter', () => {
  let app: express.Express;
  const template = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Template',
    metadata: {
      description: 'Create a new CRA website project',
      name: 'create-react-app-template',
      tags: ['experimental', 'react', 'cra'],
      title: 'Create React App Template',
    },
    spec: {
      owner: 'web@example.com',
      path: '.',
      schema: {
        properties: {
          component_id: {
            description: 'Unique name of the component',
            title: 'Name',
            type: 'string',
          },
          description: {
            description: 'Description of the component',
            title: 'Description',
            type: 'string',
          },
          use_typescript: {
            default: true,
            description: 'Include TypeScript',
            title: 'Use TypeScript',
            type: 'boolean',
          },
        },
        required: ['component_id', 'use_typescript'],
      },
      templater: 'cra',
      type: 'website',
    },
  };

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      preparers: new Preparers(),
      templaters: new Templaters(),
      publishers: new Publishers(),
      config: new ConfigReader({}),
      dockerClient: new Docker(),
      entityClient: generateEntityClient(template),
      database: createDatabase(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /v1/jobs', () => {
    it('rejects template values which do not match the template schema definition', async () => {
      const response = await request(app)
        .post('/v1/jobs')
        .send({
          templateName: '',
          values: {
            storePath: 'https://github.com/backstage/backstage',
          },
        });

      expect(response.status).toEqual(400);
    });
  });
});
