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

import { AppConfig } from '@backstage/config';
import { JsonObject } from '@backstage/types';

export type CliConfigOptions = {
  publicPath?: string;
  backendUrl?: string;
};

/**
 * Read specific parameters from the CLI and add them to the build config.
 * @param opts CLI passed parameters.
 * @returns Array of config, empty if there is no relevant passed in cli options.
 *
 * @public
 */
export function readCliConfig(opts?: CliConfigOptions): AppConfig[] {
  if (!opts || Object.keys(opts).length === 0) return [];
  const data: JsonObject = {};

  if (opts.publicPath) {
    data.app = {
      baseUrl: opts.publicPath,
    };
  }

  if (opts.backendUrl) {
    data.backend = {
      baseUrl: opts.backendUrl,
    };
  }

  return [{ data, context: 'cli' }];
}
