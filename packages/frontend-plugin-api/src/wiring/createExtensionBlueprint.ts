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
import { OpaqueType } from '@internal/opaque';
import {
  ExtensionAttachToSpec,
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
import { createExtensionDataContainer } from '@internal/frontend';
import {
  ResolveInputValueOverrides,
  resolveInputOverrides,
} from './resolveInputOverrides';
import { ExtensionDataContainer } from './types';

export type BlueprintParamsDefiner<
  TParams extends object = object,
  TInput = any,
> = (params: TInput) => BlueprintParams<TParams>;
export type BlueprintParamsFactory<TDefiner extends BlueprintParamsDefiner> = (
  define: TDefiner,
) => ReturnType<TDefiner>;

export type BlueprintParams<T extends object = object> = {
  $$type: '@backstage/BlueprintParams';
  T: T;
};

const OpaqueBlueprintParams = OpaqueType.create<{
  public: BlueprintParams;
  versions: {
    version: 'v1';
    params: object;
  };
}>({
  type: '@backstage/BlueprintParams',
  versions: ['v1'],
});

export function createExtensionBlueprintParams<T extends object = object>(
  params: T,
): BlueprintParams<T> {
  return OpaqueBlueprintParams.createInstance('v1', { T: null as any, params });
}

/**
 * @public
 */
export type CreateExtensionBlueprintOptions<
  TKind extends string,
  TName extends string | undefined,
  TParams extends object | BlueprintParamsDefiner,
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
  attachTo: ExtensionAttachToSpec;
  disabled?: boolean;
  inputs?: TInputs;
  output: Array<UOutput>;
  name?: TName;
  config?: {
    schema: TConfigSchema;
  };
  defineParams?: TParams extends BlueprintParamsDefiner
    ? TParams
    : 'The params option must be a function if provided, see the docs for details';
  factory(
    params: TParams extends BlueprintParamsDefiner
      ? ReturnType<TParams>['T']
      : TParams,
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
  params: object | BlueprintParamsDefiner;
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
 * Represents any form of params input that can be passed to a blueprint.
 * This also includes the invalid form of passing a plain params object to a blueprint that uses a definition callback.
 *
 * @internal
 */
type AnyParamsInput<TParams extends object | BlueprintParamsDefiner> =
  TParams extends BlueprintParamsDefiner<infer IParams>
    ? IParams | BlueprintParamsFactory<TParams>
    :
        | TParams
        | BlueprintParamsFactory<BlueprintParamsDefiner<TParams, TParams>>;

/**
 * @public
 */
export interface ExtensionBlueprint<
  // TParamsMapper extends (params: any) => object,
  T extends ExtensionBlueprintParameters = ExtensionBlueprintParameters,
> {
  dataRefs: T['dataRefs'];

  make<
    TNewName extends string | undefined,
    TParamsReturn extends AnyParamsInput<T['params']>,
  >(args: {
    name?: TNewName;
    attachTo?: ExtensionAttachToSpec;
    disabled?: boolean;
    params: TParamsReturn extends BlueprintParamsDefiner
      ? TParamsReturn
      : T['params'] extends BlueprintParamsDefiner
      ? 'Error: This blueprint uses advanced parameter types and requires you to pass parameters as using the following callback syntax: `<blueprint>.make({ params: define => define(<params>) })`'
      : TParamsReturn;
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
    attachTo?: ExtensionAttachToSpec;
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
      originalFactory: <TParamsReturn extends AnyParamsInput<T['params']>>(
        params: TParamsReturn extends BlueprintParamsDefiner
          ? TParamsReturn
          : T['params'] extends BlueprintParamsDefiner
          ? 'Error: This blueprint uses advanced parameter types and requires you to pass parameters as using the following callback syntax: `originalFactory(define => define(<params>))`'
          : TParamsReturn,
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

function unwrapParamsFactory<TParams extends object>(
  // Allow `Function` because `typeof <object> === 'function'` allows it, but in practice this should always be a param factory
  params: BlueprintParamsFactory<BlueprintParamsDefiner> | Function,
  defineParams: BlueprintParamsDefiner,
  kind: string,
): TParams {
  const paramDefinition = (
    params as BlueprintParamsFactory<BlueprintParamsDefiner>
  )(defineParams);
  try {
    return OpaqueBlueprintParams.toInternal(paramDefinition).params as TParams;
  } catch (e) {
    throw new TypeError(
      `Invalid invocation of blueprint with kind '${kind}', the parameter definition callback function did not return a valid parameter definition object; Caused by: ${e.message}`,
    );
  }
}

function unwrapParams<TParams extends object>(
  params: object | BlueprintParamsFactory<BlueprintParamsDefiner> | string,
  ctx: { node: AppNode; [ctxParamsSymbol]?: any },
  defineParams: BlueprintParamsDefiner | undefined,
  kind: string,
): TParams {
  const overrideParams = ctx[ctxParamsSymbol] as
    | object
    | BlueprintParamsFactory<BlueprintParamsDefiner>
    | undefined;

  if (defineParams) {
    if (overrideParams) {
      if (typeof overrideParams !== 'function') {
        throw new TypeError(
          `Invalid extension override of blueprint with kind '${kind}', the override params were passed as a plain object, but this blueprint requires them to be passed in callback form`,
        );
      }
      return unwrapParamsFactory(overrideParams, defineParams, kind);
    }

    if (typeof params !== 'function') {
      throw new TypeError(
        `Invalid invocation of blueprint with kind '${kind}', the parameters where passed as a plain object, but this blueprint requires them to be passed in callback form`,
      );
    }
    return unwrapParamsFactory(params, defineParams, kind);
  }

  const base =
    typeof params === 'function'
      ? unwrapParamsFactory<TParams>(
          params,
          createExtensionBlueprintParams,
          kind,
        )
      : (params as TParams);
  const overrides =
    typeof overrideParams === 'function'
      ? unwrapParamsFactory<TParams>(
          overrideParams,
          createExtensionBlueprintParams,
          kind,
        )
      : (overrideParams as Partial<TParams>);

  return {
    ...base,
    ...overrides,
  };
}

/**
 * A simpler replacement for wrapping up `createExtension` inside a kind or type. This allows for a cleaner API for creating
 * types and instances of those types.
 *
 * @public
 */
export function createExtensionBlueprint<
  TParams extends object | BlueprintParamsDefiner,
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
  const defineParams = options.defineParams as
    | BlueprintParamsDefiner
    | undefined;

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
            unwrapParams(args.params, ctx, defineParams, options.kind),
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
                  unwrapParams(innerParams, ctx, defineParams, options.kind),
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
