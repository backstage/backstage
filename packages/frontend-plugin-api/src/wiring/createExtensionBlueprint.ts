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
import { Expand } from '../types';
import {
  AnyExtensionDataMap,
  AnyExtensionInputMap,
  ExtensionDataValues,
  ExtensionDefinition,
  ResolvedExtensionInputs,
  createExtension,
} from './createExtension';
import { z } from 'zod';

/**
 * @public
 */
export interface CreateExtensionBlueprintOptions<
  TParams,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfigSchema extends { [key: string]: z.ZodTypeAny },
  TDataRefs extends AnyExtensionDataMap,
> {
  kind: string;
  namespace?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  config?: {
    schema: {
      [key in keyof TConfigSchema]: (zImpl: typeof z) => TConfigSchema[key];
    };
  };
  factory(
    params: TParams,
    context: {
      node: AppNode;
      config: Expand<{
        [key in keyof TConfigSchema]: z.infer<TConfigSchema[key]>;
      }>;
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
  TConfigSchema extends { [key: string]: z.ZodTypeAny },
  TDataRefs extends AnyExtensionDataMap,
> {
  dataRefs: TDataRefs;

  /**
   * Creates a new extension from the blueprint.
   *
   * You must either pass `params` directly, or define a `factory` that can
   * optionally call the original factory with the same params.
   */
  make<TExtensionConfigSchema extends { [key: string]: z.ZodTypeAny }>(
    args: {
      namespace?: string;
      name?: string;
      attachTo?: { id: string; input: string };
      disabled?: boolean;
      inputs?: TInputs;
      output?: TOutput;
      config?: {
        schema: {
          [key in keyof TExtensionConfigSchema]: (
            zImpl: typeof z,
          ) => TExtensionConfigSchema[key];
        };
      };
    } & (
      | {
          factory(
            originalFactory: (
              params: TParams,
              context?: {
                config?: Expand<{
                  [key in keyof TConfigSchema]: z.infer<TConfigSchema[key]>;
                }>;
                inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
              },
            ) => Expand<ExtensionDataValues<TOutput>>,
            context: {
              node: AppNode;
              config: Expand<
                {
                  [key in keyof TExtensionConfigSchema]: z.infer<
                    TExtensionConfigSchema[key]
                  >;
                } & {
                  [key in keyof TConfigSchema]: z.infer<TConfigSchema[key]>;
                }
              >;
              inputs: Expand<ResolvedExtensionInputs<TInputs>>;
            },
          ): Expand<ExtensionDataValues<TOutput>>;
        }
      | {
          params: TParams;
        }
    ),
  ): ExtensionDefinition<
    {
      [key in keyof TExtensionConfigSchema]: z.infer<
        TExtensionConfigSchema[key]
      >;
    },
    TExtensionConfigSchema
  >;
}

/**
 * @internal
 */
class ExtensionBlueprintImpl<
  TParams,
  TInputs extends AnyExtensionInputMap,
  TOutput extends AnyExtensionDataMap,
  TConfigSchema extends { [key: string]: z.ZodTypeAny },
  TDataRefs extends AnyExtensionDataMap,
> {
  constructor(
    private readonly options: CreateExtensionBlueprintOptions<
      TParams,
      TInputs,
      TOutput,
      TConfigSchema,
      TDataRefs
    >,
  ) {
    this.dataRefs = options.dataRefs!;
  }

  dataRefs: TDataRefs;

  public make<
    TExtensionConfigSchema extends { [key: string]: z.ZodTypeAny },
  >(args: {
    namespace?: string;
    name?: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    output?: TOutput;
    params?: TParams;
    config?: {
      schema: {
        [key in keyof TConfigSchema]: (zImpl: typeof z) => TConfigSchema[key];
      };
    };
    factory?(
      originalFactory: (
        params: TParams,
        context?: {
          config?: Expand<{
            [key in keyof TConfigSchema]: z.infer<TConfigSchema[key]>;
          }>;
          inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
        },
      ) => Expand<ExtensionDataValues<TOutput>>,
      context: {
        node: AppNode;
        config: Expand<
          {
            [key in keyof TExtensionConfigSchema]: z.infer<
              TExtensionConfigSchema[key]
            >;
          } & {
            [key in keyof TConfigSchema]: z.infer<TConfigSchema[key]>;
          }
        >;
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
      },
    ): Expand<ExtensionDataValues<TOutput>>;
  }): ExtensionDefinition<
    Expand<
      {
        [key in keyof TExtensionConfigSchema]: z.infer<
          TExtensionConfigSchema[key]
        >;
      } & {
        [key in keyof TConfigSchema]: z.infer<TConfigSchema[key]>;
      }
    >,
    Expand<TConfigSchema & TExtensionConfigSchema>
  > {
    return createExtension({
      kind: this.options.kind,
      namespace: args.namespace ?? this.options.namespace,
      name: args.name,
      attachTo: args.attachTo ?? this.options.attachTo,
      disabled: args.disabled ?? this.options.disabled,
      inputs: args.inputs ?? this.options.inputs,
      output: args.output ?? this.options.output,
      config: {
        schema: {
          ...this.options.config?.schema,
          ...args.config,
        } as Expand<
          {
            [key in keyof TConfigSchema]: (
              zImpl: typeof z,
            ) => TConfigSchema[key];
          } & {
            [key in keyof TExtensionConfigSchema]: (
              zImpl: typeof z,
            ) => TExtensionConfigSchema[key];
          }
        >,
      },
      factory: ({ node, config, inputs }) => {
        if (args.factory) {
          return args.factory(
            (
              innerParams: TParams,
              innerContext?: {
                config?: Expand<{
                  [key in keyof TConfigSchema]: z.infer<TConfigSchema[key]>;
                }>;
                inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
              },
            ) =>
              this.options.factory(innerParams, {
                node,
                config: innerContext?.config ?? config,
                inputs: innerContext?.inputs ?? inputs,
              }),
            {
              node,
              config,
              inputs,
            },
          );
        } else if (args.params) {
          return this.options.factory(args.params, {
            node,
            config,
            inputs,
          });
        }
        throw new Error('Either params or factory must be provided');
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
  TConfigSchema extends { [key: string]: z.ZodTypeAny },
  TDataRefs extends AnyExtensionDataMap = never,
>(
  options: CreateExtensionBlueprintOptions<
    TParams,
    TInputs,
    TOutput,
    TConfigSchema,
    TDataRefs
  >,
): ExtensionBlueprint<TParams, TInputs, TOutput, TConfigSchema, TDataRefs> {
  return new ExtensionBlueprintImpl(options) as any;
}
