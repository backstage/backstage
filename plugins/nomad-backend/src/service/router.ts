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
import express, { RequestHandler } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

const createEndpoint = (
  options: RouterOptions,
  endpoint: string,
): RequestHandler => {
  const { config, logger } = options;

  // Get Nomad addr and token from config
  const addr = config.getString('nomad.addr');
  const token = config.getOptionalString('nomad.token');

  return async function (req, resp) {
    // Check namespace argument
    const namespace = (req.query.namespace as string) ?? '';
    if (!namespace || namespace === '') {
      throw new InputError(`Missing "namespace" query parameter`);
    }

    // Check filter argument
    const filter = (req.query.filter as string) ?? '';
    if (!filter || filter === '') {
      throw new InputError(`Missing "filter" query parameter`);
    }
    logger.debug(
      `${endpoint} request headers: namespace=${namespace} filter=${filter}`,
    );

    // Issue the request
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

    // Deserialize and return
    const allocationsBody = await allocationsResp.json();
    logger.debug(`${endpoint} response: ${allocationsBody}`);
    resp.json(allocationsBody);
  };
};

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, resp) => {
    resp.json({ status: 'ok' });
  });
  router.get('/v1/allocations', createEndpoint(options, '/v1/allocations'));
  router.get('/v1/deployments', createEndpoint(options, '/v1/deployments'));

  router.use(requestLoggingHandler());
  router.use(errorHandler());
  return router;
}
