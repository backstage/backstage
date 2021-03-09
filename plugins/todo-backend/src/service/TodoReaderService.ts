/*
 * Copyright 2021 Spotify AB
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

import { CatalogClient } from '@backstage/catalog-client';
import { Logger } from 'winston';
import { TodoReader } from '../lib';
import { ListTodosRequest, ListTodosResponse, TodoService } from './types';

type Options = {
  logger: Logger;
  todoReader: TodoReader;
  catalogClient: CatalogClient;
};

export class TodoReaderService implements TodoService {
  private readonly logger: Logger;
  private readonly todoReader: TodoReader;
  private readonly catalogClient: CatalogClient;

  constructor(options: Options) {
    this.logger = options.logger;
    this.todoReader = options.todoReader;
    this.catalogClient = options.catalogClient;
  }

  async listTodos(_req: ListTodosRequest): Promise<ListTodosResponse> {
    const todos = await this.todoReader.readTodos({
      url: 'https://github.com/backstage/backstage',
    });
    return {
      items: todos.items.slice(0, 10),
      totalCount: todos.items.length,
      cursors: {
        prev: 'prev',
        self: 'self',
        next: 'next',
      },
    };
  }
}
