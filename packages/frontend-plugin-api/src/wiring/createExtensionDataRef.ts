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
  TId extends string,
  TData,
  TConfig extends { optional?: true } = {},
> extends ExtensionDataRef<TData, TId, TConfig> {
  optional(): ConfigurableExtensionDataRef<
    TId,
    TData,
    TData & { optional: true }
  >;
}

/**
 * @public
 * @deprecated Use the following form instead: `createExtensionDataRef<Type>().with({ id: 'core.foo' })`
 */
export function createExtensionDataRef<TData>(
  id: string,
): ConfigurableExtensionDataRef<string, TData>;
/** @public */
export function createExtensionDataRef<TData>(): {
  with<TId extends string>(options: {
    id: TId;
  }): ConfigurableExtensionDataRef<TId, TData>;
};
export function createExtensionDataRef<TData>(id?: string):
  | ConfigurableExtensionDataRef<string, TData>
  | {
      with<TId extends string>(options: {
        id: TId;
      }): ConfigurableExtensionDataRef<TId, TData>;
    } {
  const createRef = <TId extends string>(refId: TId) =>
    ({
      id: refId,
      $$type: '@backstage/ExtensionDataRef',
      config: {},
      optional() {
        return {
          ...this,
          config: { ...this.config, optional: true },
        };
      },
      toString() {
        const optional = Boolean(this.config.optional);
        return `ExtensionDataRef{id=${refId},optional=${optional}}`;
      },
    } as ConfigurableExtensionDataRef<TId, TData, { optional?: true }>);
  if (id) {
    return createRef(id);
  }
  return {
    with<TId extends string>(options: { id: TId }) {
      return createRef(options.id);
    },
  };
}
