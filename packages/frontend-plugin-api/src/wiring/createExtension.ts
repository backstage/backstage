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

import { PortableSchema } from '../schema';
import { ExtensionDataRef } from './createExtensionDataRef';
import { ExtensionInput } from './createExtensionInput';
import { BackstagePlugin } from './createPlugin';

/** @public */
export type AnyExtensionDataMap = {
  [name in string]: ExtensionDataRef<unknown, { optional?: true }>;
};

/** @public */
export type AnyExtensionInputMap = {
  [inputName in string]: ExtensionInput<
    AnyExtensionDataMap,
    { optional: boolean; singleton: boolean }
  >;
};

// TODO(Rugvip): This might be a quite useful utility type, maybe add to @backstage/types?
/**
 * Utility type to expand type aliases into their equivalent type.
 * @ignore
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Converts an extension data map into the matching concrete data values type.
 * @public
 */
export type ExtensionDataValues<TExtensionData extends AnyExtensionDataMap> = {
  [DataName in keyof TExtensionData as TExtensionData[DataName]['config'] extends {
    optional: true;
  }
    ? never
    : DataName]: TExtensionData[DataName]['T'];
} & {
  [DataName in keyof TExtensionData as TExtensionData[DataName]['config'] extends {
    optional: true;
  }
    ? DataName
    : never]?: TExtensionData[DataName]['T'];
};

/**
 * Converts an extension input map into the matching concrete input values type.
 * @public
 */
export type ExtensionInputValues<
  TInputs extends { [name in string]: ExtensionInput<any, any> },
> = {
  [InputName in keyof TInputs]: false extends TInputs[InputName]['config']['singleton']
    ? Array<Expand<ExtensionDataValues<TInputs[InputName]['extensionData']>>>
    : false extends TInputs[InputName]['config']['optional']
    ? Expand<ExtensionDataValues<TInputs[InputName]['extensionData']>>
    : Expand<
        ExtensionDataValues<TInputs[InputName]['extensionData']> | undefined
      >;
};

/** @public */
export interface CreateExtensionOptions<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
> {
  id: string;
  at: string;
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    source?: BackstagePlugin;
    bind(values: Expand<ExtensionDataValues<TOutput>>): void;
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }): void;
}

/** @public */
export interface Extension<TConfig> {
  $$type: '@backstage/Extension';
  id: string;
  at: string;
  disabled: boolean;
  inputs: AnyExtensionInputMap;
  output: AnyExtensionDataMap;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    source?: BackstagePlugin;
    bind(values: ExtensionInputValues<any>): void;
    config: TConfig;
    inputs: Record<
      string,
      undefined | Record<string, unknown> | Array<Record<string, unknown>>
    >;
  }): void;
}

/** @public */
export function createExtension<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig = never,
>(
  options: CreateExtensionOptions<TOutput, TInputs, TConfig>,
): Extension<TConfig> {
  return {
    ...options,
    disabled: options.disabled ?? false,
    $$type: '@backstage/Extension',
    inputs: options.inputs ?? {},
    factory({ bind, config, inputs }) {
      // TODO: Simplify this, but TS wouldn't infer the input type for some reason
      return options.factory({
        bind,
        config,
        inputs: inputs as Expand<ExtensionInputValues<TInputs>>,
      });
    },
  };
}
