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

import express from 'express';
import Router from 'express-promise-router';
import { add, getAll, update } from './todos';
import { InputError } from '@backstage/errors';
import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';

/**
 * Dependencies of the todo-list router
 */
export interface RouterOptions {
  logger: LoggerService;
  httpAuth: HttpAuthService;
}

/**
 * Creates an express.Router with some endpoints
 * for creating, editing and deleting todo items.
 *
 * @param options - the dependencies of the router
 * @returns an express.Router
 *
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, httpAuth } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/todos', async (_req, res) => {
    res.json(getAll());
  });

  router.post('/todos', async (req, res) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    if (!isTodoCreateRequest(req.body)) {
      throw new InputError('Invalid payload');
    }

    const todo = add({
      title: req.body.title,
      author: credentials.principal.userEntityRef,
    });
    res.json(todo);
  });

  router.put('/todos', async (req, res) => {
    if (!isTodoUpdateRequest(req.body)) {
      throw new InputError('Invalid payload');
    }
    res.json(update(req.body));
  });

  return router;
}

function isTodoCreateRequest(request: any): request is { title: string } {
  return typeof request?.title === 'string';
}

function isTodoUpdateRequest(
  request: any,
): request is { title: string; id: string } {
  return typeof request?.id === 'string' && isTodoCreateRequest(request);
}
