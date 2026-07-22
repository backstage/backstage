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
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ScaffolderClient } from './ScaffolderClient';
import {
  ScaffolderClientCancelTaskOptions,
  ScaffolderClientListEventsOptions,
} from './types';
import { JsonObject } from '@backstage/types';
import { IncomingHttpHeaders } from 'node:http';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as any;

describe('ScaffolderClient', () => {
  const discoveryApi: DiscoveryApi = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007'),
  };

  const client = new ScaffolderClient({ discoveryApi });

  describe('createTaskExecution', () => {
    it('should create a task execution and return the task ID', async () => {
      const body: JsonObject = { key: 'value' };
      const headers: IncomingHttpHeaders = { authorization: 'Bearer token' };
      const response = { data: { id: 'taskId' } };

      mockedAxios.post.mockResolvedValue(response);

      const taskId = await client.createTaskExecution(body, headers);

      expect(taskId).toBe('taskId');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:7007/v2/tasks',
        body,
        { headers: { Authorization: 'Bearer token' } },
      );
    });
  });

  describe('listEvents', () => {
    it('should list events for a given task', async () => {
      const options: ScaffolderClientListEventsOptions = {
        taskId: 'taskId',
        headers: { authorization: 'Bearer token' },
      };
      const response = {
        status: 200,
        statusText: 'OK',
        data: [
          {
            id: 'id',
            isTaskRecoverable: true,
            taskId: 'taskId',
            body: { message: 'message', error: null },
            type: 'completion',
            createdAt: '2025-02-20',
          },
        ],
      };

      mockedAxios.mockResolvedValue(response);

      const result = await client.listEvents(options);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].id).toBe('id');
      expect(mockedAxios).toHaveBeenCalledWith({
        url: 'http://localhost:7007/v2/tasks/taskId/events?',
        method: 'GET',
        headers: { authorization: 'Bearer token' },
      });
    });
  });

  describe('cancelTask', () => {
    it('should cancel task', async () => {
      const options: ScaffolderClientCancelTaskOptions = {
        taskId: 'taskId',
        headers: { Authorization: 'Bearer token' },
      };
      const response = { status: 200 };

      mockedAxios.post.mockResolvedValue(response);

      await client.cancelTask(options);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: 'http://localhost:7007/v2/tasks/taskId/cancel',
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
      });
    });
  });
});
