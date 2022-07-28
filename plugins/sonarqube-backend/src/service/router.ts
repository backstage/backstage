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
import express, { RequestHandler } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  SonarqubeFindings,
  SonarqubeInfoProvider,
} from './sonarqubeInfoProvider';
import { InputError } from '../../../../packages/errors';

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
  router.get('/findings', (async (request, response) => {
    const componentKey = request.query.componentKey;
    let instanceKey = request.query.instanceKey;

    if (!componentKey)
      throw new InputError('ComponentKey must be provided as a single string.');

    if (!instanceKey) {
      instanceKey = '';
      logger.info(
        `Retrieving findings for component ${componentKey} in default sonarqube instance`,
      );
    } else {
      logger.info(
        `Retrieving findings for component ${componentKey}  in sonarqube instance name ${instanceKey}`,
      );
    }

    response.send(
      await sonarqubeInfoProvider.getFindings(componentKey, instanceKey),
    );
  }) as RequestHandler<unknown, SonarqubeFindings | undefined, unknown, { componentKey: string; instanceKey: string }>);

  router.get('/instanceUrl', ((request, response) => {
    let requestedInstanceKey = request.query.instanceKey;
    if (requestedInstanceKey) {
      logger.info(
        `Retrieving sonarqube instance URL for key ${requestedInstanceKey}`,
      );
    } else {
      requestedInstanceKey = '';
      logger.info(
        `Retrieving default sonarqube instance URL as parameter is inexistant, empty or malformed`,
      );
    }
    response.send({
      instanceUrl: sonarqubeInfoProvider.getBaseUrl({
        instanceName: requestedInstanceKey,
      }).baseUrl,
    });
  }) as RequestHandler<unknown, { instanceUrl: string }, unknown, { instanceKey: string }>);

  router.use(errorHandler());
  return router;
}
