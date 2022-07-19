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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { TodoItem } from '../lib';

/** @public */
export type ListTodosRequest = {
  entity?: CompoundEntityRef;
  offset?: number;
  limit?: number;
  orderBy?: {
    field: 'text' | 'tag' | 'author' | 'viewUrl' | 'repoFilePath';
    direction: 'asc' | 'desc';
  };
  filters?: {
    field: 'text' | 'tag' | 'author' | 'viewUrl' | 'repoFilePath';
    /** Value to filter by, with '*' used as wildcard */
    value: string;
  }[];
};

/** @public */
export type ListTodosResponse = {
  items: TodoItem[];
  totalCount: number;
  offset: number;
  limit: number;
};

/** @public */
export interface TodoService {
  listTodos(
    req: ListTodosRequest,
    options?: { token?: string },
  ): Promise<ListTodosResponse>;
}
