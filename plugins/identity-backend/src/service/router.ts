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
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { StaticJsonAdapter } from '../adapters';
import { IdentityApi } from '../adapters/types';

export interface RouterOptions {
  logger: Logger;
}

const makeRouter = (adapter: IdentityApi): express.Router => {
  const router = Router();
  router.get('/users/:user/groups', async (req, res) => {
    const user = req.params.user;
    const type = req.query.type?.toString() ?? '';

    const response = await adapter.getUserGroups({ user, type });
    res.send(response);
  });
  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing identity API backend');
  const adapter = new StaticJsonAdapter();
  return makeRouter(adapter);
}
