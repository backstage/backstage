/*
 * Copyright 2022 The Backstage Authors
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

import {
  createServiceFactory,
  coreServices,
} from '@backstage/backend-plugin-api';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { RestrictedIndexedRouter } from './RestrictedIndexedRouter';
import { readCorsOptions } from './readCorsOptions';
import { startHttpServer } from '../../../lib/http';
import { readHelmetOptions } from './readHelmetOptions';
import {
  errorHandler,
  notFoundHandler,
  requestLoggingHandler,
} from '@backstage/backend-common';

/**
 * @public
 */
export type RootHttpRouterFactoryOptions = {
  /**
   * The path to forward all unmatched requests to. Defaults to '/api/app'
   */
  indexPath?: string | false;
};

/** @public */
export const rootHttpRouterFactory = createServiceFactory({
  service: coreServices.rootHttpRouter,
  deps: {
    config: coreServices.config,
    logger: coreServices.rootLogger,
    lifecycle: coreServices.rootLifecycle,
  },
  async factory(
    { config, logger, lifecycle },
    { indexPath }: RootHttpRouterFactoryOptions = {},
  ) {
    const router = new RestrictedIndexedRouter(indexPath ?? '/api/app');

    const app = express();

    app.use(helmet(readHelmetOptions(config.getOptionalConfig('backend'))));
    app.use(cors(readCorsOptions(config.getOptionalConfig('backend'))));
    app.use(compression());
    app.use(requestLoggingHandler(logger));
    app.use(router.handler());
    app.use(notFoundHandler());
    app.use(errorHandler({ logger }));

    await startHttpServer(app, { config, logger, lifecycle });

    return router;
  },
});
