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

import { InputError, NotFoundError } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import {
  LOCATION_ANNOTATION,
  SOURCE_LOCATION_ANNOTATION,
  serializeEntityRef,
  Entity,
  parseLocationReference,
} from '@backstage/catalog-model';
import { TodoReader } from '../lib';
import { ListTodosRequest, ListTodosResponse, TodoService } from './types';

const DEFAULT_DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MAX_PAGE_SIZE = 50;

type Options = {
  todoReader: TodoReader;
  catalogClient: CatalogClient;
  maxPageSize?: number;
  defaultPageSize?: number;
};

export class TodoReaderService implements TodoService {
  private readonly todoReader: TodoReader;
  private readonly catalogClient: CatalogClient;
  private readonly maxPageSize: number;
  private readonly defaultPageSize: number;

  constructor(options: Options) {
    this.todoReader = options.todoReader;
    this.catalogClient = options.catalogClient;
    this.maxPageSize = options.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE;
    this.defaultPageSize = options.defaultPageSize ?? DEFAULT_DEFAULT_PAGE_SIZE;
  }

  async listTodos({
    entity: entityName,
    cursor,
  }: ListTodosRequest): Promise<ListTodosResponse> {
    if (!entityName) {
      throw new InputError('entity filter is required to list todos');
    }
    const entity = await this.catalogClient.getEntityByName(entityName);
    if (!entity) {
      throw new NotFoundError(
        `Entity not found, ${serializeEntityRef(entityName)}`,
      );
    }

    const url = this.getEntitySourceUrl(entity);
    const todos = await this.todoReader.readTodos({ url });

    const { offset, limit } = this.parseCursor(cursor);
    return {
      items: todos.items.slice(offset, offset + limit),
      totalCount: todos.items.length,
      cursors: this.calculateCursors(offset, limit, todos.items.length),
    };
  }

  private getEntitySourceUrl(entity: Entity) {
    const sourceLocation =
      entity.metadata.annotations?.[SOURCE_LOCATION_ANNOTATION];
    if (sourceLocation) {
      const parsed = parseLocationReference(sourceLocation);
      if (parsed.type !== 'url') {
        throw new InputError(
          `Invalid entity source location type for ${serializeEntityRef(
            entity,
          )}, got ${parsed.type}`,
        );
      }
      return parsed.target;
    }

    const location = entity.metadata.annotations?.[LOCATION_ANNOTATION];
    if (location) {
      const parsed = parseLocationReference(location);
      if (parsed.type !== 'url') {
        throw new InputError(
          `Invalid entity source location type for ${serializeEntityRef(
            entity,
          )}, got ${parsed.type}`,
        );
      }
      return parsed.target;
    }
    throw new InputError(
      `No entity location annotation found for ${serializeEntityRef(entity)}`,
    );
  }

  private parseCursor(
    cursor: string | undefined,
  ): { offset: number; limit: number } {
    if (!cursor) {
      return { offset: 0, limit: this.defaultPageSize };
    }

    const [offsetStr, limitStr] = cursor.split(',');

    const offset = parseInt(offsetStr, 10);
    if (!Number.isInteger(offset) || offset < 0) {
      throw new InputError(`Invalid cursor, ${cursor}`);
    }

    let limit = parseInt(limitStr, 10);
    if (!Number.isInteger(limit) || limit < 0) {
      throw new InputError(`Invalid cursor, ${cursor}`);
    }
    if (limit > this.maxPageSize) {
      limit = this.maxPageSize;
    }

    return { offset, limit };
  }

  private calculateCursors(
    offset: number,
    limit: number,
    total: number,
  ): ListTodosResponse['cursors'] {
    const prevOffset = Math.max(offset - limit, 0);
    const nextOffset = Math.min(offset + limit, total - limit);

    return {
      prev: `${prevOffset},${limit}`,
      self: `${offset},${limit}`,
      next: `${nextOffset},${limit}`,
    };
  }
}
