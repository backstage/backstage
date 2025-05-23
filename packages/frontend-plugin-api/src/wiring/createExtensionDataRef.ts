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
export type ExtensionDataValue<TData, TId extends string> = {
  readonly $$type: '@backstage/ExtensionDataValue';
  readonly id: TId;
  readonly value: TData;
};

/** @public */
export type ExtensionDataRef<
  TData,
  TId extends string = string,
  TConfig extends { optional?: true } = {},
> = {
  readonly $$type: '@backstage/ExtensionDataRef';
  readonly id: TId;
  readonly T: TData;
  readonly config: TConfig;
};

/** @public */
export type ExtensionDataRefToValue<TDataRef extends AnyExtensionDataRef> =
  TDataRef extends ExtensionDataRef<infer IData, infer IId, any>
    ? ExtensionDataValue<IData, IId>
    : never;

/** @public */
export type AnyExtensionDataRef = ExtensionDataRef<
  unknown,
  string,
  { optional?: true }
>;

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
  (t: TData): ExtensionDataValue<TData, TId>;
}

/** @public */
export function createExtensionDataRef<TData>(): {
  with<TId extends string>(options: {
    id: TId;
  }): ConfigurableExtensionDataRef<TData, TId>;
} {
  const createRef = <TId extends string>(refId: TId) =>
    Object.assign(
      (value: TData): ExtensionDataValue<TData, TId> => ({
        $$type: '@backstage/ExtensionDataValue',
        id: refId,
        value,
      }),
      {
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
      } as ConfigurableExtensionDataRef<TData, TId, { optional?: true }>,
    );
  return {
    with<TId extends string>(options: { id: TId }) {
      return createRef(options.id);
    },
  };
}
