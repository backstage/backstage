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

import { CompoundEntityRef, parseEntityRef } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { type TodoService, TODO_FIELDS } from './types';
import {
  getBearerToken,
  parseFilterParam,
  parseIntegerParam,
  parseOrderByParam,
} from '../lib/utils';
import spec from '../schema/openapi.generated';
import type { ApiRouter } from '@backstage/backend-openapi-utils';

/** @public */
export interface RouterOptions {
  todoService: TodoService;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { todoService } = options;

  const router = Router() as ApiRouter<typeof spec>;
  router.use(express.json());

  router.get('/v1/todos', async (req, res) => {
    const offset = parseIntegerParam(req.query.offset, 'offset query');
    const limit = parseIntegerParam(req.query.limit, 'limit query');
    const orderBy = parseOrderByParam(req.query.orderBy, TODO_FIELDS);
    const filters = parseFilterParam(req.query.filter, TODO_FIELDS);

    const entityRef = req.query.entity;
    if (entityRef && typeof entityRef !== 'string') {
      throw new InputError(`entity query must be a string`);
    }
    let entity: CompoundEntityRef | undefined = undefined;
    if (entityRef) {
      try {
        entity = parseEntityRef(entityRef);
      } catch (error) {
        throw new InputError(`Invalid entity ref, ${error}`);
      }
    }

    const todos = await todoService.listTodos(
      {
        entity,
        offset,
        limit,
        orderBy,
        filters,
      },
      {
        token: getBearerToken(req.headers.authorization),
      },
    );
    res.json(todos);
  });

  return router;
}
