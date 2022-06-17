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

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());
  // mock api for now
  router.get('/findings', (request, response) => {
    logger.info(request.params);
    response.send({
      analysisDate: '2022-10-22T04:55:23Z',
      measures: [{ metric: 'coverage', value: '50' }],
    });
  });
  router.get('/instanceUrl', (request, response) => {
    logger.info(request.params);
    response.send({
      instanceUrl: `https://instance.local?${encodeURI(
        request.query.instanceKey as string,
      )}`,
    });
  });
  router.use(errorHandler());
  return router;
}
