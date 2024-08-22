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

import { ExtensionDataRef } from './createExtensionDataRef';

/** @public */
export interface ExtensionInput<
  UExtensionData extends ExtensionDataRef<unknown, string, { optional?: true }>,
  TConfig extends { singleton: boolean; optional: boolean },
> {
  $$type: '@backstage/ExtensionInput';
  extensionData: Array<UExtensionData>;
  config: TConfig;
  replaces?: Array<{ id: string; input: string }>;
}

/** @public */
export function createExtensionInput<
  UExtensionData extends ExtensionDataRef<unknown, string, { optional?: true }>,
  TConfig extends { singleton?: boolean; optional?: boolean },
>(
  extensionData: Array<UExtensionData>,
  config?: TConfig & { replaces?: Array<{ id: string; input: string }> },
): ExtensionInput<
  UExtensionData,
  {
    singleton: TConfig['singleton'] extends true ? true : false;
    optional: TConfig['optional'] extends true ? true : false;
  }
> {
  if (process.env.NODE_ENV !== 'production') {
    if (Array.isArray(extensionData)) {
      const seen = new Set();
      const duplicates = [];
      for (const dataRef of extensionData) {
        if (seen.has(dataRef.id)) {
          duplicates.push(dataRef.id);
        } else {
          seen.add(dataRef.id);
        }
      }
      if (duplicates.length > 0) {
        throw new Error(
          `ExtensionInput may not have duplicate data refs: '${duplicates.join(
            "', '",
          )}'`,
        );
      }
    }
  }
  return {
    $$type: '@backstage/ExtensionInput',
    extensionData,
    config: {
      singleton: Boolean(config?.singleton) as TConfig['singleton'] extends true
        ? true
        : false,
      optional: Boolean(config?.optional) as TConfig['optional'] extends true
        ? true
        : false,
    },
    replaces: config?.replaces,
  } as ExtensionInput<
    UExtensionData,
    {
      singleton: TConfig['singleton'] extends true ? true : false;
      optional: TConfig['optional'] extends true ? true : false;
    }
  >;
}
