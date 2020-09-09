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

import { resolve as resolvePath } from 'path';
import { notFoundHandler, resolvePackagePath } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { injectEnvConfig } from '../lib/config';

export interface RouterOptions {
  logger: Logger;
  appPackageName: string;
  staticFallbackHandler?: express.Handler;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const appDistDir = resolvePackagePath(options.appPackageName, 'dist');
  options.logger.info(`Serving static app content from ${appDistDir}`);

  await injectEnvConfig({
    env: process.env,
    logger: options.logger,
    staticDir: resolvePath(appDistDir, 'static'),
  });

  const router = Router();

  // Use a separate router for static content so that a fallback can be provided by backend
  const staticRouter = Router();
  staticRouter.use(express.static(resolvePath(appDistDir, 'static')));
  if (options.staticFallbackHandler) {
    staticRouter.use(options.staticFallbackHandler);
  }
  staticRouter.use(notFoundHandler());

  router.use('/static', staticRouter);
  router.use(express.static(appDistDir));
  router.get('/*', (_req, res) => {
    res.sendFile(resolvePath(appDistDir, 'index.html'));
  });

  return router;
}
