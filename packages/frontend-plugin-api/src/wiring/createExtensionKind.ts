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
  ResolvedExtensionInputs,
  createExtension,
} from './createExtension';

/**
 * @public
 */
export interface CreateExtensionKindOptions<
  TOptions,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
> {
  kind: string;
  namespace?: string;
  name?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig>;
  factory(
    context: {
      node: AppNode;
      config: TConfig;
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
    options: TOptions,
  ): Expand<ExtensionDataValues<TOutput>>;
}

/**
 * TODO: should we export an interface instead of a concrete class?
 * @public
 */
export class ExtensionKind<
  TOptions,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
> {
  static create<
    TOptions,
    TInputs extends AnyExtensionInputMap,
    TOutput extends AnyExtensionDataMap,
    TConfig,
  >(
    options: CreateExtensionKindOptions<TOptions, TInputs, TOutput, TConfig>,
  ): ExtensionKind<TOptions, TInputs, TOutput, TConfig> {
    return new ExtensionKind(options);
  }

  private constructor(
    private readonly options: CreateExtensionKindOptions<
      TOptions,
      TInputs,
      TOutput,
      TConfig
    >,
  ) {}

  public new(args: {
    namespace?: string;
    name?: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    output?: TOutput;
    configSchema?: PortableSchema<TConfig>;
    options: TOptions;
    factory?(
      context: {
        node: AppNode;
        config: TConfig;
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
        orignalFactory(
          context?: {
            node?: AppNode;
            config?: TConfig;
            inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
          },
          options?: TOptions,
        ): Expand<ExtensionDataValues<TOutput>>;
      },
      options: TOptions,
    ): Expand<ExtensionDataValues<TOutput>>;
  }) {
    return createExtension({
      kind: this.options.kind,
      namespace: args.namespace ?? this.options.namespace,
      name: args.name ?? this.options.name,
      attachTo: args.attachTo ?? this.options.attachTo,
      disabled: args.disabled ?? this.options.disabled,
      inputs: args.inputs ?? this.options.inputs,
      output: args.output ?? this.options.output,
      configSchema: args.configSchema ?? this.options.configSchema, // TODO: some config merging or smth
      factory: ({ node, config, inputs }) => {
        if (args.factory) {
          return args.factory(
            {
              node,
              config,
              inputs,
              orignalFactory: (
                innerContext?: {
                  node?: AppNode;
                  config?: TConfig;
                  inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
                },
                innerOptions?: TOptions,
              ) =>
                this.options.factory(
                  {
                    node: innerContext?.node ?? node,
                    config: innerContext?.config ?? config,
                    inputs: innerContext?.inputs ?? inputs,
                  },
                  innerOptions ?? args.options,
                ),
            },
            args.options,
          );
        }

        return this.options.factory(
          {
            node,
            config,
            inputs,
          },
          args.options,
        );
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
export function createExtensionKind<
  TOptions,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
>(options: CreateExtensionKindOptions<TOptions, TInputs, TOutput, TConfig>) {
  return ExtensionKind.create(options);
}
