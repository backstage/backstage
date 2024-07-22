/*
 * Copyright 2024 The Backstage Authors
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

import { AppNode } from '../apis';
import { PortableSchema } from '../schema';
import { Expand } from '../types';
import {
  AnyExtensionDataMap,
  AnyExtensionInputMap,
  ExtensionDataValues,
  ExtensionDefinition,
  ResolvedExtensionInputs,
  createExtension,
} from './createExtension';

/**
 * @public
 */
export interface CreateExtensionBlueprintOptions<
  TParams,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
  TDataRefs extends AnyExtensionDataMap,
> {
  kind: string;
  namespace?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig>;
  factory(
    params: TParams,
    context: {
      node: AppNode;
      config: TConfig;
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
  ): Expand<ExtensionDataValues<TOutput>>;

  dataRefs?: TDataRefs;
}

/**
 * @public
 */
export interface ExtensionBlueprint<
  TParams,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
  TDataRefs extends AnyExtensionDataMap,
> {
  dataRefs: TDataRefs;

  make(args: {
    namespace?: string;
    name?: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    output?: TOutput;
    configSchema?: PortableSchema<TConfig>;
    params: TParams;
    factory?(
      params: TParams,
      context: {
        node: AppNode;
        config: TConfig;
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
        orignalFactory(
          params?: TParams,
          context?: {
            node?: AppNode;
            config?: TConfig;
            inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
          },
        ): Expand<ExtensionDataValues<TOutput>>;
      },
    ): Expand<ExtensionDataValues<TOutput>>;
  }): ExtensionDefinition<TConfig>;
}

/**
 * @internal
 */
class ExtensionBlueprintImpl<
  TParams,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
  TDataRefs extends AnyExtensionDataMap,
> {
  constructor(
    private readonly options: CreateExtensionBlueprintOptions<
      TParams,
      TInputs,
      TOutput,
      TConfig,
      TDataRefs
    >,
  ) {
    this.dataRefs = options.dataRefs!;
  }

  dataRefs: TDataRefs;

  public make(args: {
    namespace?: string;
    name?: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    output?: TOutput;
    configSchema?: PortableSchema<TConfig>;
    params: TParams;
    factory?(
      params: TParams,
      context: {
        node: AppNode;
        config: TConfig;
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
        orignalFactory(
          params?: TParams,
          context?: {
            node?: AppNode;
            config?: TConfig;
            inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
          },
        ): Expand<ExtensionDataValues<TOutput>>;
      },
    ): Expand<ExtensionDataValues<TOutput>>;
  }): ExtensionDefinition<TConfig> {
    return createExtension({
      kind: this.options.kind,
      namespace: args.namespace ?? this.options.namespace,
      name: args.name,
      attachTo: args.attachTo ?? this.options.attachTo,
      disabled: args.disabled ?? this.options.disabled,
      inputs: args.inputs ?? this.options.inputs,
      output: args.output ?? this.options.output,
      configSchema: args.configSchema ?? this.options.configSchema, // TODO: some config merging or smth
      factory: ({ node, config, inputs }) => {
        if (args.factory) {
          return args.factory(args.params, {
            node,
            config,
            inputs,
            orignalFactory: (
              innerParams?: TParams,
              innerContext?: {
                config?: TConfig;
                inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
              },
            ) =>
              this.options.factory(innerParams ?? args.params, {
                node,
                config: innerContext?.config ?? config,
                inputs: innerContext?.inputs ?? inputs,
              }),
          });
        }

        return this.options.factory(args.params, {
          node,
          config,
          inputs,
        });
      },
    });
  }
}

/**
 * A simpler replacement for wrapping up `createExtension` inside a kind or type. This allows for a cleaner API for creating
 * types and instances of those types.
 *
 * @public
 */
export function createExtensionBlueprint<
  TParams,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
  TDataRefs extends AnyExtensionDataMap = never,
>(
  options: CreateExtensionBlueprintOptions<
    TParams,
    TInputs,
    TOutput,
    TConfig,
    TDataRefs
  >,
): ExtensionBlueprint<TParams, TInputs, TOutput, TConfig, TDataRefs> {
  return new ExtensionBlueprintImpl(options);
}
