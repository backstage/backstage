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

import fetch from 'node-fetch';
import { errorHandler, requestLoggingHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

/** @public */
export interface RouterOptions {
  logger: Logger;
  config: Config;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger } = options;

  // Get Nomad addr and token from config
  const addr = config.getString('nomad.addr');
  const token = config.getOptionalString('nomad.token');

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, resp) => {
    resp.json({ status: 'ok' });
  });

  router.get('/v1/allocations', async (req, res) => {
    // Check namespace argument
    const namespace = (req.query.namespace as string) ?? '';
    if (!namespace || namespace === '') {
      throw new InputError(`Missing "namespace" query parameter`);
    }

    // Check filter argument
    const filter = (req.query.filter as string) ?? '';
    logger.debug(`request headers: namespace=${namespace} filter=${filter}`);

    // Issue the request
    const endpoint = `${addr}/v1/allocations?namespace=${encodeURIComponent(
      namespace,
    )}&filter=${encodeURIComponent(filter)}`;
    const allocationsResp = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Nomad-Token': token || '',
      },
    });

    // Check response
    if (allocationsResp.status !== 200) {
      const body = await allocationsResp.text();
      logger.error(`failed to call /v1/allocations endpoint: ${body}`);
      res.status(allocationsResp.status).json({ message: body });
      return;
    }

    // Deserialize and return
    const allocationsBody = await allocationsResp.json();
    logger.debug(`/v1/allocations response: ${allocationsBody}`);
    res.json(allocationsBody);
  });

  router.get('/v1/job/:job_id/versions', async (req, resp) => {
    // Check namespace argument
    const namespace = (req.query.namespace as string) ?? '';
    if (!namespace || namespace === '') {
      throw new InputError(`Missing "namespace" query parameter`);
    }

    // Get job ID
    const jobID = (req.params.job_id as string) ?? '';

    // Issue the request
    const apiResp = await fetch(
      `${addr}/v1/job/${jobID}/versions?namespace=${encodeURIComponent(
        namespace,
      )}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Nomad-Token': token || '',
        },
      },
    );

    // Check response
    if (apiResp.status !== 200) {
      const body = await apiResp.text();
      logger.error(`failed to call /v1/job/:job_id/versions endpoint: ${body}`);
      resp.status(apiResp.status).json({ message: body });
      return;
    }

    // Deserialize and return
    const versionsBody = await apiResp.json();
    logger.debug(`/v1/job/:job_id/versions response: ${versionsBody}`);
    resp.json(versionsBody);
  });

  router.use(requestLoggingHandler());
  router.use(errorHandler());
  return router;
}
