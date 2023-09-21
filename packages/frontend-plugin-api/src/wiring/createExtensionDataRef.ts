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

/** @public */
export type ExtensionDataRef<
  TData,
  TId extends string = string,
  TConfig extends { optional?: true } = {},
> = {
  id: TId;
  T: TData;
  config: TConfig;
  $$type: '@backstage/ExtensionDataRef';
};

/** @public */
export interface ConfigurableExtensionDataRef<
  TData,
  TId extends string,
  TConfig extends { optional?: true } = {},
> extends ExtensionDataRef<TData, TId, TConfig> {
  optional(): ConfigurableExtensionDataRef<
    TData,
    TId,
    TConfig & { optional: true }
  >;
}

// TODO: change to options object with ID.
/** @public */
export function createExtensionDataRef<TData, const TId extends string>(
  id: TId,
): ConfigurableExtensionDataRef<TData, TId> {
  return {
    id,
    $$type: '@backstage/ExtensionDataRef',
    config: {},
    optional() {
      return { ...this, config: { ...this.config, optional: true } };
    },
  } as ConfigurableExtensionDataRef<TData, TId>;
}
