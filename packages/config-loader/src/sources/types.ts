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

import { AppConfig } from '@backstage/config';
import { JsonObject } from '@backstage/types';

/**
 * The data returned by {@link ConfigSource.readConfigData}.
 *
 * @public
 */
export interface ConfigSourceData extends AppConfig {
  /**
   * The file path that this configuration was loaded from, if it was loaded from a file.
   */
  path?: string;
}

/**
 * Options for {@link ConfigSource.readConfigData}.
 *
 * @public
 */
export interface ReadConfigDataOptions {
  signal?: AbortSignal;
}

/**
 * The generator returned by {@link ConfigSource.readConfigData}.
 *
 * @public
 */
export type AsyncConfigSourceGenerator = AsyncGenerator<
  { configs: ConfigSourceData[] },
  void,
  void
>;

/**
 * A source of configuration data.
 *
 * @remarks
 *
 * It is recommended to implement the `readConfigData` method as an async generator.
 *
 * @example
 *
 * ```ts
 * class MyConfigSource implements ConfigSource {
 *   async *readConfigData() {
 *     yield {
 *       config: [{
 *         context: 'example',
 *         data: { backend: { baseUrl: 'http://localhost' } }
 *       }]
 *     };
 *   }
 * }
 * ```
 *
 * @public
 */
export interface ConfigSource {
  readConfigData(options?: ReadConfigDataOptions): AsyncConfigSourceGenerator;
}

/**
 * A custom function to be used for substitution withing configuration files.
 *
 * @remarks
 *
 * Substitutions use the following syntax: `baseUrl: https://${HOSTNAME}`, where
 * `'HOSTNAME'` is the name of the variable to be substituted.
 *
 * The default substitution function will read the value of the environment.
 *
 * @public
 */
export type SubstitutionFunc = (name: string) => Promise<string | undefined>;

/**
 * A custom function to be used for parsing configuration content.
 *
 * @remarks
 *
 * The default parsing function will parse configuration content as yaml.
 *
 * @public
 */
export type Parser = ({
  contents,
}: {
  contents: string;
}) => Promise<{ result?: JsonObject }>;
