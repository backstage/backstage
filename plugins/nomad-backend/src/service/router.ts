/*
 * Copyright 2023 The Backstage Authors
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
import { errorHandler, requestLoggingHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/v1/allocations', async (req, resp) => {
    const addr = config.getString('nomad.addr');
    const token = config.getOptionalString('nomad.token');

    const namespace = (req.query.namespace as string) ?? '';
    if (!namespace || namespace === '') {
      throw new InputError(`Missing "namespace" query parameter`);
    }

    const filter = (req.query.filter as string) ?? '';
    if (!filter || filter === '') {
      throw new InputError(`Missing "filter" query parameter`);
    }

    logger.debug(
      `/v1/allocations request headers: namespace=${namespace} filter=${filter}`,
    );
    const allocationsResp = await fetch(
      `${addr}/v1/allocations?namespace=${encodeURIComponent(
        namespace,
      )}&filter=${encodeURIComponent(filter)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Nomad-Token': token || '',
        },
      },
    );

    const allocationsBody = await allocationsResp.json();
    logger.debug(`/v1/allocations response: ${allocationsBody}`);

    resp.json(allocationsBody);
  });

  router.use(requestLoggingHandler());
  router.use(errorHandler());
  return router;
}
