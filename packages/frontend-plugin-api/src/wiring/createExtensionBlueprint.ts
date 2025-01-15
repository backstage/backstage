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

import { ApiHolder, AppNode } from '../apis';
import { Expand } from '@backstage/types';
import {
  ExtensionDefinition,
  ResolvedExtensionInputs,
  VerifyExtensionFactoryOutput,
  createExtension,
  ctxParamsSymbol,
} from './createExtension';
import { z } from 'zod';
import { ExtensionInput } from './createExtensionInput';
import {
  AnyExtensionDataRef,
  ExtensionDataValue,
} from './createExtensionDataRef';
import {
  ExtensionDataContainer,
  createExtensionDataContainer,
} from './createExtensionDataContainer';
import {
  ResolveInputValueOverrides,
  resolveInputOverrides,
} from './resolveInputOverrides';

/**
 * @public
 */
export type CreateExtensionBlueprintOptions<
  TKind extends string,
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
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: Array<UOutput>;
  name?: TName;
  config?: {
    schema: TConfigSchema;
  };
  factory(
    params: TParams,
    context: {
      node: AppNode;
      apis: ApiHolder;
      config: {
        [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
      };
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
  ): Iterable<UFactoryOutput>;

  dataRefs?: TDataRefs;
} & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>;

/** @public */
export type ExtensionBlueprintParameters = {
  kind: string;
  name?: string;
  params?: object;
  configInput?: { [K in string]: any };
  config?: { [K in string]: any };
  output?: AnyExtensionDataRef;
  inputs?: {
    [KName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  };
  dataRefs?: { [name in string]: AnyExtensionDataRef };
};

/**
 * @public
 */
export interface ExtensionBlueprint<
  T extends ExtensionBlueprintParameters = ExtensionBlueprintParameters,
> {
  dataRefs: T['dataRefs'];

  make<TNewName extends string | undefined>(args: {
    name?: TNewName;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    params: T['params'];
  }): ExtensionDefinition<{
    kind: T['kind'];
    name: string | undefined extends TNewName ? T['name'] : TNewName;
    config: T['config'];
    configInput: T['configInput'];
    output: T['output'];
    inputs: T['inputs'];
    params: T['params'];
  }>;

  /**
   * Creates a new extension from the blueprint.
   *
   * You must either pass `params` directly, or define a `factory` that can
   * optionally call the original factory with the same params.
   */
  makeWithOverrides<
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
  >(args: {
    name?: TNewName;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TExtraInputs & {
      [KName in keyof T['inputs']]?: `Error: Input '${KName &
        string}' is already defined in parent definition`;
    };
    output?: Array<UNewOutput>;
    config?: {
      schema: TExtensionConfigSchema & {
        [KName in keyof T['config']]?: `Error: Config key '${KName &
          string}' is already defined in parent schema`;
      };
    };
    factory(
      originalFactory: (
        params: T['params'],
        context?: {
          config?: T['config'];
          inputs?: ResolveInputValueOverrides<NonNullable<T['inputs']>>;
        },
      ) => ExtensionDataContainer<NonNullable<T['output']>>,
      context: {
        node: AppNode;
        apis: ApiHolder;
        config: T['config'] & {
          [key in keyof TExtensionConfigSchema]: z.infer<
            ReturnType<TExtensionConfigSchema[key]>
          >;
        };
        inputs: Expand<ResolvedExtensionInputs<T['inputs'] & TExtraInputs>>;
      },
    ): Iterable<UFactoryOutput> &
      VerifyExtensionFactoryOutput<
        AnyExtensionDataRef extends UNewOutput
          ? NonNullable<T['output']>
          : UNewOutput,
        UFactoryOutput
      >;
  }): ExtensionDefinition<{
    config: (string extends keyof TExtensionConfigSchema
      ? {}
      : {
          [key in keyof TExtensionConfigSchema]: z.infer<
            ReturnType<TExtensionConfigSchema[key]>
          >;
        }) &
      T['config'];
    configInput: (string extends keyof TExtensionConfigSchema
      ? {}
      : z.input<
          z.ZodObject<{
            [key in keyof TExtensionConfigSchema]: ReturnType<
              TExtensionConfigSchema[key]
            >;
          }>
        >) &
      T['configInput'];
    output: AnyExtensionDataRef extends UNewOutput ? T['output'] : UNewOutput;
    inputs: T['inputs'] & TExtraInputs;
    kind: T['kind'];
    name: string | undefined extends TNewName ? T['name'] : TNewName;
    params: T['params'];
  }>;
}

/**
 * A simpler replacement for wrapping up `createExtension` inside a kind or type. This allows for a cleaner API for creating
 * types and instances of those types.
 *
 * @public
 */
export function createExtensionBlueprint<
  TParams extends object,
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
  TName extends string | undefined = undefined,
  TDataRefs extends { [name in string]: AnyExtensionDataRef } = never,
>(
  options: CreateExtensionBlueprintOptions<
    TKind,
    TName,
    TParams,
    UOutput,
    TInputs,
    TConfigSchema,
    UFactoryOutput,
    TDataRefs
  >,
): ExtensionBlueprint<{
  kind: TKind;
  name: TName;
  params: TParams;
  output: UOutput;
  inputs: string extends keyof TInputs ? {} : TInputs;
  config: string extends keyof TConfigSchema
    ? {}
    : { [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>> };
  configInput: string extends keyof TConfigSchema
    ? {}
    : z.input<
        z.ZodObject<{
          [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
        }>
      >;
  dataRefs: TDataRefs;
}> {
  return {
    dataRefs: options.dataRefs,
    make(args) {
      return createExtension({
        kind: options.kind,
        name: args.name ?? options.name,
        attachTo: args.attachTo ?? options.attachTo,
        disabled: args.disabled ?? options.disabled,
        inputs: options.inputs,
        output: options.output as AnyExtensionDataRef[],
        config: options.config,
        factory: ctx =>
          options.factory(
            { ...args.params, ...(ctx as any)[ctxParamsSymbol] },
            ctx,
          ) as Iterable<ExtensionDataValue<any, any>>,
      }) as ExtensionDefinition;
    },
    makeWithOverrides(args) {
      return createExtension({
        kind: options.kind,
        name: args.name ?? options.name,
        attachTo: args.attachTo ?? options.attachTo,
        disabled: args.disabled ?? options.disabled,
        inputs: { ...args.inputs, ...options.inputs },
        output: (args.output ?? options.output) as AnyExtensionDataRef[],
        config:
          options.config || args.config
            ? {
                schema: {
                  ...options.config?.schema,
                  ...args.config?.schema,
                },
              }
            : undefined,
        factory: ctx => {
          const { node, config, inputs, apis } = ctx;
          return args.factory(
            (innerParams, innerContext) => {
              return createExtensionDataContainer<UOutput>(
                options.factory(
                  { ...innerParams, ...(ctx as any)[ctxParamsSymbol] },
                  {
                    apis,
                    node,
                    config: (innerContext?.config ?? config) as any,
                    inputs: resolveInputOverrides(
                      options.inputs,
                      inputs,
                      innerContext?.inputs,
                    ) as any,
                  },
                ) as Iterable<any>,
                options.output,
              );
            },
            {
              apis,
              node,
              config: config as any,
              inputs: inputs as any,
            },
          ) as Iterable<ExtensionDataValue<any, any>>;
        },
      }) as ExtensionDefinition;
    },
  } as ExtensionBlueprint<{
    kind: TKind;
    name: TName;
    params: TParams;
    output: UOutput;
    inputs: string extends keyof TInputs ? {} : TInputs;
    config: string extends keyof TConfigSchema
      ? {}
      : {
          [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
        };
    configInput: string extends keyof TConfigSchema
      ? {}
      : z.input<
          z.ZodObject<{
            [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
          }>
        >;
    dataRefs: TDataRefs;
  }>;
}
