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

import {
  ConfigService,
  RootLifecycleService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { RequestListener } from 'http';
import { readHttpServerOptions } from './config';
import { createHttpServer } from './createHttpServer';

/**
 * Options for {@link startHttpServer}.
 *
 * @public
 */
export interface StartHttpServerOptions {
  config: ConfigService;
  logger: RootLoggerService;
  lifecycle: RootLifecycleService;
}

/**
 * Starts up an HTTP server, as well as registers a shutdown handler that stops the server.
 *
 * @public
 */
export async function startHttpServer(
  listener: RequestListener,
  options: StartHttpServerOptions,
) {
  const { config, logger, lifecycle } = options;

  const server = await createHttpServer(
    listener,
    readHttpServerOptions(config.getOptionalConfig('backend')),
    { logger },
  );

  lifecycle.addShutdownHook({
    async fn() {
      await server.stop();
    },
    labels: { type: 'httpServer' },
  });

  await server.start();
}
