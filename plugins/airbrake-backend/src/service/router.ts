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
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AirbrakeConfig } from '../config';
import { Options } from 'http-proxy-middleware/dist/types';

/**
 * The router options that are needed when creating a router.
 *
 * @public
 */
export interface RouterOptions {
  /**
   * A logger object
   */
  logger: Logger;

  /**
   * The Airbrake config obtained from {@link extractAirbrakeConfig}
   */
  airbrakeConfig: AirbrakeConfig;
}

/**
 * Mainly used internally to generate the path.
 *
 * @internal
 *
 * @param options - Router options
 */
export const generateAirbrakePathRewrite = (
  options: RouterOptions,
): Options['pathRewrite'] => {
  const apiKey = options.airbrakeConfig.apiKey;

  return path => {
    let newPath = path.replace(/.+?(\/api)/g, '');
    if (newPath.includes('?')) {
      newPath += `&key=${apiKey}`;
    } else {
      newPath += `?key=${apiKey}`;
    }
    return newPath;
  };
};

/**
 * Create the Airbrake Router, used for making API calls to the Airbrake API.
 *
 * @public
 *
 * @param options - Router options
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.airbrake.io/api',
      changeOrigin: true,
      pathRewrite: generateAirbrakePathRewrite(options),
    }),
  );

  router.use(errorHandler());
  return router;
}
