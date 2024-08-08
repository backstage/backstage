/*
 * Copyright 2024 The Backstage Authors
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
import { merge } from 'lodash';
import * as winston from 'winston';

import { ConfigReader } from '@backstage/config';
import { DatabaseService } from '@backstage/backend-plugin-api';
import { WinstonLogger } from '@backstage/backend-defaults/rootLogger';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { SignalsService } from '@backstage/plugin-signals-node';

import { createRouter as _createRouter } from './service';

/**
 * Type for the options passed to the "createRouter" function.
 *
 * @public
 * @deprecated This type is only exported for legacy reasons and will be removed in the future.
 */
export type RouterOptions = {
  database: DatabaseService;
  identity: IdentityApi;
  signals?: SignalsService;
};

/**
 * Create the user settings backend routes.
 *
 * @public
 * @deprecated This function is only exported for legacy reasons and will be removed in the future.
 * Please {@link https://backstage.io/docs/backend-system/building-backends/migrating | migrate } to use the new backend system and follow these {@link https://github.com/backstage/backstage/tree/master/plugins/user-settings-backend#new-backend | instructions } to install the user settings backend plugin.
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = await _createRouter(options);
  const config = new ConfigReader({});
  const logger = winston
    .createLogger(
      merge<winston.LoggerOptions, winston.LoggerOptions>(
        {
          level: process.env.LOG_LEVEL || 'info',
          format: winston.format.combine(
            WinstonLogger.redacter().format,
            process.env.NODE_ENV === 'production'
              ? winston.format.json()
              : WinstonLogger.colorFormat(),
          ),
          transports: [
            new winston.transports.Console({
              silent:
                process.env.JEST_WORKER_ID !== undefined &&
                !process.env.LOG_LEVEL,
            }),
          ],
        },
        {},
      ),
    )
    .child({ service: 'backstage' });
  const middleware = MiddlewareFactory.create({
    config,
    logger,
  });
  router.use(middleware.error());
  return router;
}
