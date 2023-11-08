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

import { AnyExtensionDataMap } from './createExtension';

/** @public */
export interface ExtensionInput<
  TExtensionData extends AnyExtensionDataMap,
  TConfig extends { singleton: boolean; optional: boolean },
> {
  $$type: '@backstage/ExtensionInput';
  extensionData: TExtensionData;
  config: TConfig;
}

/** @public */
export function createExtensionInput<
  TExtensionData extends AnyExtensionDataMap,
  TConfig extends { singleton?: boolean; optional?: boolean },
>(
  extensionData: TExtensionData,
  config?: TConfig,
): ExtensionInput<
  TExtensionData,
  {
    singleton: TConfig['singleton'] extends true ? true : false;
    optional: TConfig['optional'] extends true ? true : false;
  }
> {
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
  };
}
