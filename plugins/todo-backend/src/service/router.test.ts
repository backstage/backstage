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

import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { TodoService } from './types';

const mockListBody = {
  items: [{ text: 'my todo' }],
  totalCount: 1,
  offset: 0,
  limit: 10,
};

describe('createRouter', () => {
  let app: express.Express;
  const mockService: jest.Mocked<TodoService> = {
    listTodos: jest.fn(),
  };

  beforeAll(async () => {
    const router = await createRouter({
      todoService: mockService,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns list without query', async () => {
      mockService.listTodos.mockResolvedValueOnce(mockListBody);

      const response = await request(app).get('/v1/todos');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockListBody);
      expect(mockService.listTodos).toHaveBeenCalledWith({
        entity: undefined,
        offset: undefined,
        limit: undefined,
      });
    });

    it('forwards pagination query', async () => {
      mockService.listTodos.mockResolvedValueOnce(mockListBody);

      const response = await request(app).get('/v1/todos?offset=5&limit=3');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockListBody);
      expect(mockService.listTodos).toHaveBeenCalledWith({
        entity: undefined,
        offset: 5,
        limit: 3,
      });
    });

    it('forwards entity query', async () => {
      mockService.listTodos.mockResolvedValueOnce(mockListBody);

      const response = await request(app).get(
        '/v1/todos?entity=component:my-component',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockListBody);
      expect(mockService.listTodos).toHaveBeenCalledWith({
        entity: {
          name: 'my-component',
          kind: 'component',
          namespace: 'default',
        },
        offset: undefined,
        limit: undefined,
      });
    });
  });
});
