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
import { BackstagePlugin } from './createPlugin';
import { AnyExtensionDataMap, Extension } from './types';

type OnlyRequiredKeys<TOutput extends AnyExtensionDataMap> = {
  [K in keyof TOutput]: TOutput[K]['config']['optional'] extends true
    ? never
    : K;
}[keyof TOutput];

type OnlyOptionalKeys<TOutput extends AnyExtensionDataMap> = {
  [K in keyof TOutput]: TOutput[K]['config']['optional'] extends false
    ? never
    : K;
}[keyof TOutput];

/** @public */
export type ExtensionDataBind<TOutput extends AnyExtensionDataMap> = (
  outputs: {
    [K in OnlyRequiredKeys<TOutput>]: TOutput[K]['T'];
  } & {
    [K in OnlyOptionalKeys<TOutput>]?: TOutput[K]['T'];
  },
) => void;

/** @public */
export type ExtensionDataValue<TData extends AnyExtensionDataMap> = {
  [K in keyof TData]: TData[K]['T'];
};

/** @public */
export interface CreateExtensionOptions<
  TOutput extends AnyExtensionDataMap,
  TInputs extends Record<string, { extensionData: AnyExtensionDataMap }>,
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
    bind: ExtensionDataBind<TOutput>;
    config: TConfig;
    inputs: {
      [pointName in keyof TInputs]: ExtensionDataValue<
        TInputs[pointName]['extensionData']
      >[];
    };
  }): void;
}

/** @public */
export function createExtension<
  TOutput extends AnyExtensionDataMap,
  TInputs extends Record<string, { extensionData: AnyExtensionDataMap }>,
  TConfig = never,
>(
  options: CreateExtensionOptions<TOutput, TInputs, TConfig>,
): Extension<TConfig> {
  return {
    ...options,
    disabled: options.disabled ?? false,
    $$type: 'extension',
    inputs: options.inputs ?? {},
    factory({ bind, config, inputs }) {
      // TODO: Simplify this, but TS wouldn't infer the input type for some reason
      return options.factory({
        bind,
        config,
        inputs: inputs as {
          [pointName in keyof TInputs]: ExtensionDataValue<
            TInputs[pointName]['extensionData']
          >[];
        },
      });
    },
  };
}
