/*
 * Copyright 2022 The Backstage Authors
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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { createRouter } from './router';
import { PluginTaskScheduler } from '@backstage/backend-tasks';

const mockedAuthorize: jest.MockedFunction<PermissionEvaluator['authorize']> =
  jest.fn();
const mockedPermissionQuery: jest.MockedFunction<
  PermissionEvaluator['authorizeConditional']
> = jest.fn();

const permissionEvaluator: PermissionEvaluator = {
  authorize: mockedAuthorize,
  authorizeConditional: mockedPermissionQuery,
};

describe('createRouter', () => {
  let app: express.Express;

  const taskScheduler1 = {
    pluginId: 'taskScheduler1',
    getScheduledTasks: async () => {
      return [{ id: 'test-task', scope: 'global', settings: { version: 2 } }];
    },
    triggerTask: async (_: string) => {
      return;
    },
  } as unknown as PluginTaskScheduler;

  const taskScheduler2 = {
    pluginId: 'taskScheduler2',
    getScheduledTasks: async () => {
      return [
        { id: 'test-task2', scope: 'global', settings: { version: 2 } },
        { id: 'test-task3', scope: 'global', settings: { version: 2 } },
      ];
    },
    triggerTask: async (task: string) => {
      throw new Error(`Failed to start task ${task}`);
    },
  } as unknown as PluginTaskScheduler;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: new ConfigReader({
        healthCheck: {
          endpoint: [
            {
              name: '',
              type: '',
              target: '',
            },
          ],
        },
      }),
      permissions: permissionEvaluator,
      taskSchedulers: [taskScheduler1, taskScheduler2],
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /tasks', () => {
    it('returns tasks', async () => {
      mockedAuthorize.mockImplementation(async () => [
        { result: AuthorizeResult.ALLOW },
      ]);

      const response = await request(app).get('/tasks');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          id: 'test-task',
          scope: 'global',
          settings: { version: 2 },
          scheduler: 'taskScheduler1',
        },
        {
          id: 'test-task2',
          scope: 'global',
          settings: { version: 2 },
          scheduler: 'taskScheduler2',
        },
        {
          id: 'test-task3',
          scope: 'global',
          settings: { version: 2 },
          scheduler: 'taskScheduler2',
        },
      ]);
    });
  });

  describe('POST /tasks', () => {
    it('run task successfully', async () => {
      mockedAuthorize.mockImplementation(async () => [
        { result: AuthorizeResult.ALLOW },
      ]);

      const response = await request(app).post(
        '/tasks/taskScheduler1/test-task',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });

    it('fail to run task', async () => {
      mockedAuthorize.mockImplementation(async () => [
        { result: AuthorizeResult.ALLOW },
      ]);

      const response = await request(app).post(
        '/tasks/taskScheduler2/test-task2',
      );
      expect(response.status).toEqual(500);
    });
  });
});
