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
 * @public
 */
export interface CreateExtensionKindInstanceOptions<
  TOptions,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
> {
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
      originalFactory(
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
}

/**
 * @public
 */
export interface CreateExtensionOverrideKindInstanceOptions<
  TOptions,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfig,
> {
  namespace?: string;
  name?: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output?: TOutput;
  configSchema?: PortableSchema<TConfig>;
  options?: TOptions;
  factory?(
    context: {
      node: AppNode;
      config: TConfig;
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
      originalFactory(
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
    private readonly kindProperties: CreateExtensionKindOptions<
      TOptions,
      TInputs,
      TOutput,
      TConfig
    >,
  ) {}

  public new(
    instanceProperties: CreateExtensionKindInstanceOptions<
      TOptions,
      TInputs,
      TOutput,
      TConfig
    >,
  ): ExtensionDefinition<TConfig> & {
    override: (
      overrides: CreateExtensionOverrideKindInstanceOptions<
        TOptions,
        TInputs,
        TOutput,
        TConfig
      >,
    ) => ExtensionDefinition<TConfig>;
  } {
    const extension = createExtension({
      kind: this.kindProperties.kind,
      namespace: instanceProperties.namespace ?? this.kindProperties.namespace,
      name: instanceProperties.name ?? this.kindProperties.name,
      attachTo: instanceProperties.attachTo ?? this.kindProperties.attachTo,
      disabled: instanceProperties.disabled ?? this.kindProperties.disabled,
      inputs: instanceProperties.inputs ?? this.kindProperties.inputs,
      output: instanceProperties.output ?? this.kindProperties.output,
      configSchema:
        instanceProperties.configSchema ?? this.kindProperties.configSchema, // TODO: some config merging or smth
      factory: ({ node, config, inputs }) => {
        if (instanceProperties.factory) {
          return instanceProperties.factory(
            {
              node,
              config,
              inputs,
              originalFactory: (
                innerContext?: {
                  node?: AppNode;
                  config?: TConfig;
                  inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
                },
                innerOptions?: TOptions,
              ) =>
                this.kindProperties.factory(
                  {
                    node: innerContext?.node ?? node,
                    config: innerContext?.config ?? config,
                    inputs: innerContext?.inputs ?? inputs,
                  },
                  innerOptions ?? instanceProperties.options,
                ),
            },
            instanceProperties.options,
          );
        }

        return this.kindProperties.factory(
          {
            node,
            config,
            inputs,
          },
          instanceProperties.options,
        );
      },
    });

    return {
      ...extension,
      override: overrides => {
        return createExtension({
          kind: this.kindProperties.kind,
          namespace:
            overrides.namespace ??
            instanceProperties.namespace ??
            this.kindProperties.namespace,
          name:
            overrides.name ??
            instanceProperties.name ??
            this.kindProperties.name,
          attachTo:
            overrides.attachTo ??
            instanceProperties.attachTo ??
            this.kindProperties.attachTo,
          disabled:
            overrides.disabled ??
            instanceProperties.disabled ??
            this.kindProperties.disabled,
          inputs:
            overrides.inputs ??
            instanceProperties.inputs ??
            this.kindProperties.inputs,
          output:
            overrides.output ??
            instanceProperties.output ??
            this.kindProperties.output,
          configSchema:
            overrides.configSchema ??
            instanceProperties.configSchema ??
            this.kindProperties.configSchema, // TODO: some config merging or smth
          factory: ({ node, config, inputs }) => {
            if (overrides.factory) {
              return overrides.factory(
                {
                  node,
                  config,
                  inputs,
                  originalFactory: (
                    innerContext?: {
                      node?: AppNode;
                      config?: TConfig;
                      inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
                    },
                    innerOptions?: TOptions,
                  ) =>
                    instanceProperties.factory?.(
                      {
                        node: innerContext?.node ?? node,
                        config: innerContext?.config ?? config,
                        inputs: innerContext?.inputs ?? inputs,
                        originalFactory: this.kindProperties.factory,
                      },
                      innerOptions ?? instanceProperties.options,
                    ) ??
                    this.kindProperties.factory(
                      {
                        node,
                        config,
                        inputs,
                      },
                      innerOptions ?? instanceProperties.options,
                    ),
                },
                instanceProperties.options,
              );
            }

            return (
              instanceProperties.factory?.(
                {
                  node,
                  config,
                  inputs,
                  originalFactory: this.kindProperties.factory,
                },
                instanceProperties.options,
              ) ??
              this.kindProperties.factory(
                {
                  node,
                  config,
                  inputs,
                },
                instanceProperties.options,
              )
            );
          },
        });
      },
    };
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
