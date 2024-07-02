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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  ConfigSources,
  RemoteConfigSourceOptions,
} from '@backstage/config-loader';
import { createDefaultBackstageLogger } from '../rootLogger/rootLoggerServiceFactory';

/**
 * Access to static configuration.
 *
 * See {@link @backstage/code-plugin-api#RootConfigService}
 * and {@link https://backstage.io/docs/backend-system/core-services/root-config | the service docs}
 * for more information.
 *
 * @public
 */
export interface RootConfigFactoryOptions {
  /**
   * Process arguments to use instead of the default `process.argv()`.
   */
  argv?: string[];

  /**
   * Enables and sets options for remote configuration loading.
   */
  remote?: Pick<RemoteConfigSourceOptions, 'reloadInterval'>;
  watch?: boolean;
}

/**
 * @public
 */
export const rootConfigServiceFactory = createServiceFactory(
  (options?: RootConfigFactoryOptions) => ({
    service: coreServices.rootConfig,
    deps: {},
    async factory() {
      const source = ConfigSources.default({
        argv: options?.argv,
        remote: options?.remote,
        watch: options?.watch,
      });

      /**
       * rootConfig is a dependency of rootLogger. As such rootLogger can not be used as a dependency of this service
       * factory. This factory function creates a similar logger to the default rootLogger with default
       * environmental controls (process.env.LOG_LEVEL, process.env.NODE_ENV, etc.)
       */
      const logger = createDefaultBackstageLogger();
      logger.info(`Loading config from ${source}`);

      return await ConfigSources.toConfig(source);
    },
  }),
);
