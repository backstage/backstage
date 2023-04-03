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

/** @public */
export interface ConfigFactoryOptions {
  /**
   * Process arguments to use instead of the default `process.argv()`.
   */
  argv?: string[];

  /**
   * Enables and sets options for remote configuration loading.
   */
  remote?: Pick<RemoteConfigSourceOptions, 'reloadIntervalSeconds'>;
}

/** @public */
export const configServiceFactory = createServiceFactory(
  (options?: ConfigFactoryOptions) => ({
    service: coreServices.config,
    deps: {},
    async factory() {
      const source = ConfigSources.default({
        argv: options?.argv,
        remote: options?.remote,
      });
      console.log(`Loading config from ${source}`);
      return await ConfigSources.toConfig(source);
    },
  }),
);
