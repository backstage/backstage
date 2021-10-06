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

export interface RouterOptions {
  logger: Logger;
}

// TODO(chase/ainhoa): Move this somewhere else, a database?
// key: entityref
// value: github.com username
const mapData: Record<string, string> = {
  'user:default/breanna.davison': 'orkohunter',
  'user:default/amelia.park': 'ainhoaL',
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/v1/user-profile', (request, response) => {
    // TODO (ainhoa/chase/hhogg/himanshu): get github data with username
    const githubUsername = mapData[`${request.query.entity}`];

    // return response (should match GetProfileResult type)
    response.json({
      profile: {
        username: githubUsername,
      },
    });
  });
  router.use(errorHandler());
  return router;
}
