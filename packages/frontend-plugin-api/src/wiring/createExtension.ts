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

/** @public */
export type ExtensionDataInputValues<
  TInputs extends { [name in string]: { extensionData: AnyExtensionDataMap } },
> = {
  [InputName in keyof TInputs]: Array<
    {
      [DataName in keyof TInputs[InputName]['extensionData'] as TInputs[InputName]['extensionData'][DataName]['config'] extends {
        optional: true;
      }
        ? DataName
        : never]?: TInputs[InputName]['extensionData'][DataName]['T'];
    } & {
      [DataName in keyof TInputs[InputName]['extensionData'] as TInputs[InputName]['extensionData'][DataName]['config'] extends {
        optional: false;
      }
        ? DataName
        : never]: TInputs[InputName]['extensionData'][DataName]['T'];
    }
  >;
};

/** @public */
export type ExtensionDataBind<TMap extends AnyExtensionDataMap> = (
  values: {
    [DataName in keyof TMap as TMap[DataName]['config'] extends {
      optional: false;
    }
      ? DataName
      : never]: TMap[DataName]['T'];
  } & {
    [DataName in keyof TMap as TMap[DataName]['config'] extends {
      optional: true;
    }
      ? DataName
      : never]?: TMap[DataName]['T'];
  },
) => void;

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
    inputs: ExtensionDataInputValues<TInputs>;
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
        inputs: inputs as ExtensionDataInputValues<TInputs>,
      });
    },
  };
}
