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

export interface ConfigSourceData extends AppConfig {
  /**
   * The file path that this configuration was loaded from, if it was loaded from a file.
   */
  path?: string;
}

export interface ReadConfigDataOptions {
  signal?: AbortSignal;
}

export interface AsyncConfigSourceIterator
  extends AsyncIterator<{ data: ConfigSourceData[] }, void, void> {
  [Symbol.asyncIterator](): AsyncIterator<
    { data: ConfigSourceData[] },
    void,
    void
  >;
}

export interface ConfigSource {
  readConfigData(options?: ReadConfigDataOptions): AsyncConfigSourceIterator;
}

export type SubstitutionFunc = (name: string) => Promise<string | undefined>;
