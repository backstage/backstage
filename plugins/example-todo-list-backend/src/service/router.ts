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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  IdentityClient,
  getBearerTokenFromAuthorizationHeader,
} from '@backstage/plugin-auth-node';
import { add, getAll, update } from './todos';
import { InputError } from '@backstage/errors';

export interface RouterOptions {
  logger: Logger;
  identity: IdentityClient;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/todos', async (req, res) => {
    res.json(getAll());
  });

  router.post('/todos', async (req, res) => {
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    let author: string | undefined = undefined;

    const user = token ? await identity.authenticate(token) : undefined;
    author = user?.identity.userEntityRef;

    if (!isTodoCreateRequest(req.body)) {
      throw new InputError('Invalid payload');
    }

    const todo = add({ title: req.body.title, author });
    res.json(todo);
  });

  router.put('/todos', async (req, res) => {
    if (!isTodoUpdateRequest(req.body)) {
      throw new InputError('Invalid payload');
    }
    res.json(update(req.body));
  });

  router.use(errorHandler());
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
