/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { createApiRef } from '@backstage/core-plugin-api';

/**
 * TodoItem represents a single TODO comment in source code.
 *
 * @public
 */
export type TodoItem = {
  /** The contents of the TODO comment */
  text: string;

  /** The tag used, e.g. TODO, FIXME */
  tag: string;

  /** References author, if any */
  author?: string;

  /** URL used to view the file */
  viewUrl?: string;

  /** The line number of the file that the TODO occurs at */
  lineNumber?: number;

  /** The path of the file containing the TODO within the repo */
  repoFilePath?: string;
};

/**
 * Fields that can be used to filter or order todo items.
 *
 * @public
 */
export type TodoListFields =
  | 'text'
  | 'tag'
  | 'author'
  | 'viewUrl'
  | 'repoFilePath';

/**
 * Options used to list todo items.
 *
 * @public
 */
export type TodoListOptions = {
  entity?: Entity;
  offset?: number;
  limit?: number;
  orderBy?: {
    field: TodoListFields;
    direction: 'asc' | 'desc';
  };
  filters?: {
    field: TodoListFields;
    /** Value to filter by, with '*' used as wildcard */
    value: string;
  }[];
};

/**
 * The result of listing todos.
 *
 * @public
 */
export type TodoListResult = {
  items: TodoItem[];
  totalCount: number;
  offset: number;
  limit: number;
};

/**
 * The API used by the todo-plugin to list todos.
 *
 * @public
 */
export interface TodoApi {
  /**
   * Lists todo items.
   *
   * @public
   */
  listTodos(options: TodoListOptions): Promise<TodoListResult>;
}

/**
 * ApiRef for the TodoApi.
 *
 * @public
 */
export const todoApiRef = createApiRef<TodoApi>({
  id: 'plugin.todo.api',
  description: 'Lists TODOs',
});
