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

import { ConfigSource, ConfigSourceData } from '../types';

export function isResolved(
  promise: Promise<unknown>,
  { wait }: { wait?: number | boolean } = {},
): Promise<boolean> {
  return Promise.race([
    promise.then(() => true),
    typeof wait !== 'undefined'
      ? new Promise<boolean>(resolve =>
          setTimeout(
            () => resolve(false),
            typeof wait === 'number' ? wait : 10,
          ),
        )
      : Promise.resolve().then(() => false),
  ]);
}

export async function readAll(
  source: ConfigSource,
  signal?: AbortSignal,
): Promise<ConfigSourceData[][]> {
  const results: ConfigSourceData[][] = [];

  try {
    for await (const { data } of source.readConfigData({ signal })) {
      results.push(data);
    }
  } catch (error) {
    throw error;
  }

  return results;
}
