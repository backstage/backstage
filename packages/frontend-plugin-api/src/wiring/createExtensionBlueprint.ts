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
  ExtensionDataContainer,
  ExtensionDefinition,
  ResolvedExtensionInputs,
  VerifyExtensionFactoryOutput,
  createExtension,
} from './createExtension';
import { z } from 'zod';
import { ExtensionInput } from './createExtensionInput';
import {
  AnyExtensionDataRef,
  ExtensionDataRef,
  ExtensionDataValue,
} from './createExtensionDataRef';

/**
 * @public
 */
export type CreateExtensionBlueprintOptions<
  TKind extends string,
  TNamespace extends string | undefined,
  TName extends string | undefined,
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
  kind: TKind;
  namespace?: TNamespace | ((params: TParams) => TNamespace);
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: Array<UOutput>;
  name?: TName | ((params: TParams) => TName);
  config?: {
    schema: TConfigSchema | ((params: TParams) => TConfigSchema);
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
  TKind extends string,
  TNamespace extends string | undefined,
  TName extends string | undefined,
  TParams,
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
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
    TNewNamespace extends string | undefined,
    TNewName extends string | undefined,
    TExtensionConfigSchema extends {
      [key in string]: (zImpl: typeof z) => z.ZodType;
    },
    UFactoryOutput extends ExtensionDataValue<any, any>,
    UNewOutput extends AnyExtensionDataRef,
    TExtraInputs extends {
      [inputName in string]: ExtensionInput<
        AnyExtensionDataRef,
        { optional: boolean; singleton: boolean }
      >;
    },
  >(
    args: {
      namespace?: TNewNamespace;
      name?: TNewName;
      attachTo?: { id: string; input: string };
      disabled?: boolean;
      inputs?: TExtraInputs & {
        [KName in keyof TInputs]?: `Error: Input '${KName &
          string}' is already defined in parent definition`;
      };
      output?: Array<UNewOutput>;
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
            ) => ExtensionDataContainer<UOutput>,
            context: {
              node: AppNode;
              config: TConfig & {
                [key in keyof TExtensionConfigSchema]: z.infer<
                  ReturnType<TExtensionConfigSchema[key]>
                >;
              };
              inputs: Expand<ResolvedExtensionInputs<TInputs & TExtraInputs>>;
            },
          ): Iterable<UFactoryOutput>;
        } & VerifyExtensionFactoryOutput<
          AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput,
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
      TConfigInput,
    AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput,
    TInputs & TExtraInputs,
    TKind,
    string | undefined extends TNewNamespace ? TNamespace : TNewNamespace,
    string | undefined extends TNewName ? TName : TNewName
  >;
}

/** @internal */
export function createDataContainer<UData extends AnyExtensionDataRef>(
  values: Iterable<
    UData extends ExtensionDataRef<infer IData, infer IId>
      ? ExtensionDataValue<IData, IId>
      : never
  >,
): ExtensionDataContainer<UData> {
  const container = new Map<string, ExtensionDataValue<any, any>>();

  for (const output of values) {
    container.set(output.id, output);
  }

  return {
    get(ref) {
      return container.get(ref.id)?.value;
    },
    [Symbol.iterator]() {
      return container.values();
    },
  } as ExtensionDataContainer<UData>;
}

/**
 * @internal
 */
class ExtensionBlueprintImpl<
  TKind extends string,
  TNamespace extends string | undefined,
  TName extends string | undefined,
  TParams,
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  TConfigSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  TDataRefs extends { [name in string]: AnyExtensionDataRef },
> {
  constructor(
    private readonly options: CreateExtensionBlueprintOptions<
      TKind,
      TNamespace,
      TName,
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
    UNewOutput extends AnyExtensionDataRef,
    TExtraInputs extends {
      [inputName in string]: ExtensionInput<
        AnyExtensionDataRef,
        { optional: boolean; singleton: boolean }
      >;
    },
    TNewNamespace extends string | undefined = undefined,
    TNewName extends string | undefined = undefined,
  >(args: {
    namespace?: TNewNamespace;
    name?: TNewName;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TExtraInputs;
    output?: Array<UNewOutput>;
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
      ) => ExtensionDataContainer<UOutput>,
      context: {
        node: AppNode;
        config: {
          [key in keyof TExtensionConfigSchema]: z.infer<
            ReturnType<TExtensionConfigSchema[key]>
          >;
        } & {
          [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
        };
        inputs: Expand<ResolvedExtensionInputs<TInputs & TExtraInputs>>;
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
    const optionsSchema = // can remove this args.params check with the split apart of .make
      typeof this.options.config?.schema === 'function' && args.params
        ? this.options.config?.schema(args.params)
        : this.options.config?.schema;

    const schema = {
      ...optionsSchema,
      ...args.config?.schema,
    } as TConfigSchema & TExtensionConfigSchema;

    const namespace =
      typeof this.options.namespace === 'function' && args.params
        ? this.options.namespace(args.params)
        : this.options.namespace;

    const name =
      typeof this.options.name === 'function' && args.params
        ? this.options.name(args.params)
        : this.options.name;

    return createExtension({
      kind: this.options.kind,
      namespace: args.namespace ?? namespace,
      name: args.name ?? name,
      attachTo: args.attachTo ?? this.options.attachTo,
      disabled: args.disabled ?? this.options.disabled,
      inputs: { ...args.inputs, ...this.options.inputs },
      output: args.output ?? this.options.output,
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
            ): ExtensionDataContainer<UOutput> => {
              return createDataContainer<UOutput>(
                this.options.factory(innerParams, {
                  node,
                  config: innerContext?.config ?? config,
                  inputs: (innerContext?.inputs ?? inputs) as any, // TODO: Fix the way input values are overridden
                }),
              );
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
            // TODO: Figure out types once legacy data map input type is gone
            inputs: inputs as unknown as Expand<
              ResolvedExtensionInputs<TInputs>
            >,
          });
        }
        throw new Error('Either params or factory must be provided');
      },
    } as CreateExtensionOptions<TKind, string | undefined extends TNewNamespace ? TNamespace : TNewNamespace, string | undefined extends TNewName ? TName : TNewName, AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput, TInputs & TExtraInputs, TConfigSchema & TExtensionConfigSchema, UFactoryOutput>);
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
  TConfigSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
  TKind extends string,
  TNamespace extends string | undefined = undefined,
  TName extends string | undefined = undefined,
  TDataRefs extends { [name in string]: AnyExtensionDataRef } = never,
>(
  options: CreateExtensionBlueprintOptions<
    TKind,
    TNamespace,
    TName,
    TParams,
    UOutput,
    TInputs,
    TConfigSchema,
    UFactoryOutput,
    TDataRefs
  >,
): ExtensionBlueprint<
  TKind,
  TNamespace,
  TName,
  TParams,
  UOutput,
  string extends keyof TInputs ? {} : TInputs,
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
    TKind,
    TNamespace,
    TName,
    TParams,
    UOutput,
    string extends keyof TInputs ? {} : TInputs,
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
