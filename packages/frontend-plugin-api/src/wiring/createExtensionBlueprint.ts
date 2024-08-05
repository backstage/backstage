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
  CreateExtensionOptions,
  ExtensionDefinition,
  ResolvedExtensionInputs,
  VerifyExtensionFactoryOutput,
  createExtension,
} from './createExtension';
import { z } from 'zod';
import { ExtensionInput } from './createExtensionInput';
import {
  AnyExtensionDataRef,
  ExtensionDataRefToValue,
  ExtensionDataValue,
} from './createExtensionDataRef';

/**
 * @public
 */
export type CreateExtensionBlueprintOptions<
  TParams,
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  TConfigSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
  TDataRefs extends { [name in string]: AnyExtensionDataRef },
> = {
  kind: string;
  namespace?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: Array<UOutput>;
  config?: {
    schema: TConfigSchema;
  };
  factory(
    params: TParams,
    context: {
      node: AppNode;
      config: {
        [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
      };
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
  ): Iterable<UFactoryOutput>;

  dataRefs?: TDataRefs;
} & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>;

/**
 * @public
 */
export interface ExtensionBlueprint<
  TParams,
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  UExtraOutput extends AnyExtensionDataRef,
  TConfig extends { [key in string]: unknown },
  TConfigInput extends { [key in string]: unknown },
  TDataRefs extends { [name in string]: AnyExtensionDataRef },
> {
  dataRefs: TDataRefs;

  /**
   * Creates a new extension from the blueprint.
   *
   * You must either pass `params` directly, or define a `factory` that can
   * optionally call the original factory with the same params.
   */
  make<
    TExtensionConfigSchema extends {
      [key in string]: (zImpl: typeof z) => z.ZodType;
    },
    UFactoryOutput extends ExtensionDataValue<any, any>,
  >(
    args: {
      namespace?: string;
      name?: string;
      attachTo?: { id: string; input: string };
      disabled?: boolean;
      inputs?: TInputs;
      output?: Array<UExtraOutput>;
      config?: {
        schema: TExtensionConfigSchema & {
          [KName in keyof TConfig]?: `Error: Config key '${KName &
            string}' is already defined in parent schema`;
        };
      };
    } & (
      | ({
          factory(
            originalFactory: (
              params: TParams,
              context?: {
                config?: TConfig;
                inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
              },
            ) => Iterable<ExtensionDataRefToValue<UOutput>>,
            context: {
              node: AppNode;
              config: TConfig & {
                [key in keyof TExtensionConfigSchema]: z.infer<
                  ReturnType<TExtensionConfigSchema[key]>
                >;
              };
              inputs: Expand<ResolvedExtensionInputs<TInputs>>;
            },
          ): Iterable<UFactoryOutput>;
        } & VerifyExtensionFactoryOutput<
          UOutput & UExtraOutput,
          UFactoryOutput
        >)
      | {
          params: TParams;
        }
    ),
  ): ExtensionDefinition<
    {
      [key in keyof TExtensionConfigSchema]: z.infer<
        ReturnType<TExtensionConfigSchema[key]>
      >;
    } & TConfig,
    z.input<
      z.ZodObject<{
        [key in keyof TExtensionConfigSchema]: ReturnType<
          TExtensionConfigSchema[key]
        >;
      }>
    > &
      TConfigInput
  >;
}

/**
 * @internal
 */
class ExtensionBlueprintImpl<
  TParams,
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  UExtraOutput extends AnyExtensionDataRef,
  TConfigSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  TDataRefs extends { [name in string]: AnyExtensionDataRef },
> {
  constructor(
    private readonly options: CreateExtensionBlueprintOptions<
      TParams,
      UOutput,
      TInputs,
      TConfigSchema,
      any,
      TDataRefs
    >,
  ) {
    this.dataRefs = options.dataRefs!;
  }

  dataRefs: TDataRefs;

  public make<
    TExtensionConfigSchema extends {
      [key in string]: (zImpl: typeof z) => z.ZodType;
    },
    UFactoryOutput extends ExtensionDataValue<any, any>,
  >(args: {
    namespace?: string;
    name?: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    output?: Array<UExtraOutput>;
    params?: TParams;
    config?: {
      schema: TExtensionConfigSchema;
    };
    factory?(
      originalFactory: (
        params: TParams,
        context?: {
          config?: {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
          };
          inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
        },
      ) => Iterable<ExtensionDataRefToValue<UOutput>>,
      context: {
        node: AppNode;
        config: {
          [key in keyof TExtensionConfigSchema]: z.infer<
            ReturnType<TExtensionConfigSchema[key]>
          >;
        } & {
          [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
        };
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
      },
    ): Iterable<UFactoryOutput>;
  }): ExtensionDefinition<
    {
      [key in keyof TExtensionConfigSchema]: z.infer<
        ReturnType<TExtensionConfigSchema[key]>
      >;
    } & {
      [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
    },
    z.input<
      z.ZodObject<
        {
          [key in keyof TExtensionConfigSchema]: ReturnType<
            TExtensionConfigSchema[key]
          >;
        } & {
          [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
        }
      >
    >
  > {
    const schema = {
      ...this.options.config?.schema,
      ...args.config?.schema,
    } as TConfigSchema & TExtensionConfigSchema;
    return createExtension({
      kind: this.options.kind,
      namespace: args.namespace ?? this.options.namespace,
      name: args.name,
      attachTo: args.attachTo ?? this.options.attachTo,
      disabled: args.disabled ?? this.options.disabled,
      inputs: args.inputs ?? this.options.inputs,
      output: [...(args.output ?? []), ...this.options.output],
      config: Object.keys(schema).length === 0 ? undefined : { schema },
      factory: ({ node, config, inputs }) => {
        if (args.factory) {
          return args.factory(
            (
              innerParams: TParams,
              innerContext?: {
                config?: {
                  [key in keyof TConfigSchema]: z.infer<
                    ReturnType<TConfigSchema[key]>
                  >;
                };
                inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
              },
            ): Iterable<ExtensionDataRefToValue<UOutput>> => {
              return this.options.factory(innerParams, {
                node,
                config: innerContext?.config ?? config,
                inputs: innerContext?.inputs ?? inputs,
              });
            },
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
    } as CreateExtensionOptions<
      UOutput,
      TInputs,
      {
        [key in keyof TExtensionConfigSchema]: z.infer<
          ReturnType<TExtensionConfigSchema[key]>
        >;
      } & {
        [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
      },
      z.input<
        z.ZodObject<
          {
            [key in keyof TExtensionConfigSchema]: ReturnType<
              TExtensionConfigSchema[key]
            >;
          } & {
            [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
          }
        >
      >,
      TConfigSchema,
      UFactoryOutput
    >);
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
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  UExtraOutput extends AnyExtensionDataRef,
  TConfigSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
  TDataRefs extends { [name in string]: AnyExtensionDataRef } = never,
>(
  options: CreateExtensionBlueprintOptions<
    TParams,
    UOutput,
    TInputs,
    TConfigSchema,
    UFactoryOutput,
    TDataRefs
  >,
): ExtensionBlueprint<
  TParams,
  UOutput,
  TInputs,
  UExtraOutput,
  string extends keyof TConfigSchema
    ? {}
    : { [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>> },
  string extends keyof TConfigSchema
    ? {}
    : z.input<
        z.ZodObject<{
          [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
        }>
      >,
  TDataRefs
> {
  return new ExtensionBlueprintImpl(options) as ExtensionBlueprint<
    TParams,
    UOutput,
    TInputs,
    UExtraOutput,
    string extends keyof TConfigSchema
      ? {}
      : {
          [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
        },
    string extends keyof TConfigSchema
      ? {}
      : z.input<
          z.ZodObject<{
            [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
          }>
        >,
    TDataRefs
  >;
}
