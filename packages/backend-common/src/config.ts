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

import {
  createConfigSecretEnumerator,
  loadBackendConfig as newLoadBackendConfig,
} from '@backstage/backend-app-api';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { LoadConfigOptionsRemote } from '@backstage/config-loader';
import { setRootLoggerRedactionList } from './logging/createRootLogger';

/**
 * Load configuration for a Backend.
 *
 * This function should only be called once, during the initialization of the backend.
 *
 * @public
 */
export async function loadBackendConfig(options: {
  logger: LoggerService;
  // process.argv or any other overrides
  remote?: LoadConfigOptionsRemote;
  argv: string[];
}): Promise<Config> {
  const secretEnumerator = await createConfigSecretEnumerator({
    logger: options.logger,
  });
  const { config } = await newLoadBackendConfig(options);

  setRootLoggerRedactionList(secretEnumerator(config));
  config.subscribe?.(() =>
    setRootLoggerRedactionList(secretEnumerator(config)),
  );

  return config;
}
