/*
 * Copyright 2024 The Backstage Authors
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
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { TodoListService } from './services/TodoListService/types';

const mockTodoItem = {
  title: 'Do the thing',
  id: '123',
  createdBy: mockCredentials.user().principal.userEntityRef,
  createdAt: new Date().toISOString(),
};

// TEMPLATE NOTE:
// Testing the router directly allows you to write a unit test that mocks the provided options.
describe('createRouter', () => {
  let app: express.Express;
  let todoListService: jest.Mocked<TodoListService>;

  beforeEach(async () => {
    todoListService = {
      createTodo: jest.fn(),
      listTodos: jest.fn(),
      getTodo: jest.fn(),
    };
    const router = await createRouter({
      httpAuth: mockServices.httpAuth(),
      todoListService,
    });
    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  it('should create a TODO', async () => {
    todoListService.createTodo.mockResolvedValue(mockTodoItem);

    const response = await request(app).post('/todos').send({
      title: 'Do the thing',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTodoItem);
  });

  it('should not allow unauthenticated requests to create a TODO', async () => {
    todoListService.createTodo.mockResolvedValue(mockTodoItem);

    // TEMPLATE NOTE:
    // The HttpAuth mock service considers all requests to be authenticated as a
    // mock user by default. In order to test other cases we need to explicitly
    // pass an authorization header with mock credentials.
    const response = await request(app)
      .post('/todos')
      .set('Authorization', mockCredentials.none.header())
      .send({
        title: 'Do the thing',
      });

    expect(response.status).toBe(401);
  });
});
