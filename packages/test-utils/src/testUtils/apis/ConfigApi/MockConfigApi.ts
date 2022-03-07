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

import { Config, ConfigReader } from '@backstage/config';
import { JsonObject, JsonValue } from '@backstage/types';
import { ConfigApi } from '@backstage/core-plugin-api';

/**
 * MockConfigApi is a thin wrapper around {@link @backstage/config#ConfigReader}
 * that can be used to mock configuration using a plain object.
 *
 * @public
 * @example
 * ```tsx
 * const mockConfig = new MockConfigApi({
 *   app: { baseUrl: 'https://example.com' },
 * });
 *
 * const rendered = await renderInTestApp(
 *   <TestApiProvider apis={[[configApiRef, mockConfig]]}>
 *     <MyTestedComponent />
 *   </TestApiProvider>,
 * );
 * ```
 */
export class MockConfigApi implements ConfigApi {
  private readonly config: ConfigReader;

  // NOTE: not extending in order to avoid inheriting the static `.fromConfigs`
  constructor(data: JsonObject) {
    this.config = new ConfigReader(data);
  }

  /** {@inheritdoc @backstage/config#Config.has} */
  has(key: string): boolean {
    return this.config.has(key);
  }
  /** {@inheritdoc @backstage/config#Config.keys} */
  keys(): string[] {
    return this.config.keys();
  }
  /** {@inheritdoc @backstage/config#Config.get} */
  get<T = JsonValue>(key?: string): T {
    return this.config.get(key);
  }
  /** {@inheritdoc @backstage/config#Config.getOptional} */
  getOptional<T = JsonValue>(key?: string): T | undefined {
    return this.config.getOptional(key);
  }
  /** {@inheritdoc @backstage/config#Config.getConfig} */
  getConfig(key: string): Config {
    return this.config.getConfig(key);
  }
  /** {@inheritdoc @backstage/config#Config.getOptionalConfig} */
  getOptionalConfig(key: string): Config | undefined {
    return this.config.getOptionalConfig(key);
  }
  /** {@inheritdoc @backstage/config#Config.getConfigArray} */
  getConfigArray(key: string): Config[] {
    return this.config.getConfigArray(key);
  }
  /** {@inheritdoc @backstage/config#Config.getOptionalConfigArray} */
  getOptionalConfigArray(key: string): Config[] | undefined {
    return this.config.getOptionalConfigArray(key);
  }
  /** {@inheritdoc @backstage/config#Config.getNumber} */
  getNumber(key: string): number {
    return this.config.getNumber(key);
  }
  /** {@inheritdoc @backstage/config#Config.getOptionalNumber} */
  getOptionalNumber(key: string): number | undefined {
    return this.config.getOptionalNumber(key);
  }
  /** {@inheritdoc @backstage/config#Config.getBoolean} */
  getBoolean(key: string): boolean {
    return this.config.getBoolean(key);
  }
  /** {@inheritdoc @backstage/config#Config.getOptionalBoolean} */
  getOptionalBoolean(key: string): boolean | undefined {
    return this.config.getOptionalBoolean(key);
  }
  /** {@inheritdoc @backstage/config#Config.getString} */
  getString(key: string): string {
    return this.config.getString(key);
  }
  /** {@inheritdoc @backstage/config#Config.getOptionalString} */
  getOptionalString(key: string): string | undefined {
    return this.config.getOptionalString(key);
  }
  /** {@inheritdoc @backstage/config#Config.getStringArray} */
  getStringArray(key: string): string[] {
    return this.config.getStringArray(key);
  }
  /** {@inheritdoc @backstage/config#Config.getOptionalStringArray} */
  getOptionalStringArray(key: string): string[] | undefined {
    return this.config.getOptionalStringArray(key);
  }
}
