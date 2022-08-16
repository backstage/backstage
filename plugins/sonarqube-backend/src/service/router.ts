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
import { SonarqubeInfoProvider } from './sonarqubeInfoProvider';
import { InputError } from '@backstage/errors';

/**
 * Dependencies needed by the router
 * @public
 */
export interface RouterOptions {
  /**
   * Logger for logging purposes
   */
  logger: Logger;
  /**
   * Info provider to be able to get all necessary information for the APIs
   */
  sonarqubeInfoProvider: SonarqubeInfoProvider;
}

/**
 * @public
 *
 * Constructs a sonarqube router.
 *
 * Expose endpoint to get information on or for a sonarqube instance.
 *
 * @param options - Dependencies of the router
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, sonarqubeInfoProvider } = options;

  const router = Router();
  router.use(express.json());
  router.get('/findings', async (request, response) => {
    const componentKey = request.query.componentKey as string;
    const instanceKey = request.query.instanceKey as string;

    if (!componentKey)
      throw new InputError('ComponentKey must be provided as a single string.');

    logger.info(
      instanceKey
        ? `Retrieving findings for component ${componentKey}  in sonarqube instance name ${instanceKey}`
        : `Retrieving findings for component ${componentKey} in default sonarqube instance`,
    );

    response.json(
      await sonarqubeInfoProvider.getFindings({
        componentKey,
        instanceName: instanceKey,
      }),
    );
  });

  router.get('/instanceUrl', (request, response) => {
    const instanceKey = request.query.instanceKey as string;

    logger.info(
      instanceKey
        ? `Retrieving sonarqube instance URL for key ${instanceKey}`
        : `Retrieving default sonarqube instance URL as instanceKey is not provided`,
    );
    const { baseUrl } = sonarqubeInfoProvider.getBaseUrl({
      instanceName: instanceKey,
    });
    response.json({
      instanceUrl: baseUrl,
    });
  });

  router.use(errorHandler());
  return router;
}
