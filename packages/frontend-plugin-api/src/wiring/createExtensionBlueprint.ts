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
  ExtensionDefinitionAttachTo,
  OverridableExtensionDefinition,
  ResolvedExtensionInputs,
  VerifyExtensionFactoryOutput,
  createExtension,
  ctxParamsSymbol,
  VerifyExtensionAttachTo,
} from './createExtension';
import type { z } from 'zod';
import { ExtensionInput } from './createExtensionInput';
import { ExtensionDataRef, ExtensionDataValue } from './createExtensionDataRef';
import { createExtensionDataContainer } from '@internal/frontend';
import {
  ResolvedInputValueOverrides,
  resolveInputOverrides,
} from './resolveInputOverrides';
import { ExtensionDataContainer } from './types';
import { PageBlueprint } from '../blueprints/PageBlueprint';

/**
 * A function used to define a parameter mapping function in order to facilitate
 * advanced parameter typing for extension blueprints.
 *
 * @remarks
 *
 * This function is primarily intended to enable the use of inferred type
 * parameters for blueprint params, but it can also be used to transoform the
 * params before they are handed ot the blueprint.
 *
 * The function must return an object created with
 * {@link createExtensionBlueprintParams}.
 *
 * @public
 */
export type ExtensionBlueprintDefineParams<
  TParams extends object = object,
  TInput = any,
> = (params: TInput) => ExtensionBlueprintParams<TParams>;

/**
 * An opaque type that represents a set of parameters to be passed to a blueprint.
 *
 * @remarks
 *
 * Created with {@link createExtensionBlueprintParams}.
 *
 * @public
 */
export type ExtensionBlueprintParams<T extends object = object> = {
  $$type: '@backstage/BlueprintParams';
  T: T;
};

const OpaqueBlueprintParams = OpaqueType.create<{
  public: ExtensionBlueprintParams;
  versions: {
    version: 'v1';
    params: object;
  };
}>({
  type: '@backstage/BlueprintParams',
  versions: ['v1'],
});

/**
 * Wraps a plain blueprint parameter object in an opaque {@link ExtensionBlueprintParams} object.
 *
 * This is used in the definition of the `defineParams` option of {@link ExtensionBlueprint}.
 *
 * @public
 * @param params - The plain blueprint parameter object to wrap.
 * @returns The wrapped blueprint parameter object.
 */
export function createExtensionBlueprintParams<T extends object = object>(
  params: T,
): ExtensionBlueprintParams<T> {
  return OpaqueBlueprintParams.createInstance('v1', { T: null as any, params });
}

/**
 * @public
 */
export type CreateExtensionBlueprintOptions<
  TKind extends string,
  TParams extends object | ExtensionBlueprintDefineParams,
  UOutput extends ExtensionDataRef,
  TInputs extends { [inputName in string]: ExtensionInput },
  TConfigSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
  TDataRefs extends { [name in string]: ExtensionDataRef },
  UParentInputs extends ExtensionDataRef,
> = {
  kind: TKind;
  attachTo: ExtensionDefinitionAttachTo<UParentInputs> &
    VerifyExtensionAttachTo<UOutput, UParentInputs>;
  disabled?: boolean;
  enabled?: import('../blueprints/types').ExtensionConditionFunc;
  inputs?: TInputs;
  output: Array<UOutput>;
  config?: {
    schema: TConfigSchema;
  };
  /**
   * This option is used to further refine the blueprint params. When this
   * option is used, the blueprint will require params to be passed in callback
   * form. This function can both transform the params before they are handed to
   * the blueprint factory, but importantly it also allows you to define
   * inferred type parameters for your blueprint params.
   *
   * @example
   * Blueprint definition with inferred type parameters:
   * ```ts
   * const ExampleBlueprint = createExtensionBlueprint({
   *   kind: 'example',
   *   attachTo: { id: 'example', input: 'example' },
   *   output: [exampleComponentDataRef, exampleFetcherDataRef],
   *   defineParams<T>(params: {
   *     component(props: ExampleProps<T>): JSX.Element | null
   *     fetcher(options: FetchOptions): Promise<FetchResult<T>>
   *   }) {
   *     return createExtensionBlueprintParams(params);
   *   },
   *   *factory(params) {
   *     yield exampleComponentDataRef(params.component)
   *     yield exampleFetcherDataRef(params.fetcher)
   *   },
   * });
   * ```
   *
   * @example
   * Usage of the above example blueprint:
   * ```ts
   * const example = ExampleBlueprint.make({
   *   params: defineParams => defineParams({
   *     component: ...,
   *     fetcher: ...,
   *   }),
   * });
   * ```
   */
  defineParams?: TParams extends ExtensionBlueprintDefineParams
    ? TParams
    : 'The defineParams option must be a function if provided, see the docs for details';
  factory(
    params: TParams extends ExtensionBlueprintDefineParams
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
  params?: object | ExtensionBlueprintDefineParams;
  configInput?: { [K in string]: any };
  config?: { [K in string]: any };
  output?: ExtensionDataRef;
  inputs?: { [KName in string]: ExtensionInput };
  dataRefs?: { [name in string]: ExtensionDataRef };
};

/** @ignore */
type ParamsFactory<TDefiner extends ExtensionBlueprintDefineParams> = (
  defineParams: TDefiner,
) => ReturnType<TDefiner>;

/**
 * Represents any form of params input that can be passed to a blueprint.
 * This also includes the invalid form of passing a plain params object to a blueprint that uses a definition callback.
 *
 * @ignore
 */
type AnyParamsInput<TParams extends object | ExtensionBlueprintDefineParams> =
  TParams extends ExtensionBlueprintDefineParams<infer IParams>
    ? IParams | ParamsFactory<TParams>
    : TParams | ParamsFactory<ExtensionBlueprintDefineParams<TParams, TParams>>;

/**
 * @public
 */
export interface ExtensionBlueprint<
  T extends ExtensionBlueprintParameters = ExtensionBlueprintParameters,
> {
  dataRefs: T['dataRefs'];

  make<
    TName extends string | undefined,
    TParamsInput extends AnyParamsInput<NonNullable<T['params']>>,
    UParentInputs extends ExtensionDataRef,
  >(args: {
    name?: TName;
    attachTo?: ExtensionDefinitionAttachTo<UParentInputs> &
      VerifyExtensionAttachTo<NonNullable<T['output']>, UParentInputs>;
    disabled?: boolean;
    enabled?: import('../blueprints/types').ExtensionConditionFunc;
    params: TParamsInput extends ExtensionBlueprintDefineParams
      ? TParamsInput
      : T['params'] extends ExtensionBlueprintDefineParams
      ? 'Error: This blueprint uses advanced parameter types and requires you to pass parameters as using the following callback syntax: `<blueprint>.make({ params: defineParams => defineParams(<params>) })`'
      : T['params'];
  }): OverridableExtensionDefinition<{
    kind: T['kind'];
    name: string | undefined extends TName ? undefined : TName;
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
    TName extends string | undefined,
    TExtensionConfigSchema extends {
      [key in string]: (zImpl: typeof z) => z.ZodType;
    },
    UFactoryOutput extends ExtensionDataValue<any, any>,
    UNewOutput extends ExtensionDataRef,
    UParentInputs extends ExtensionDataRef,
    TExtraInputs extends { [inputName in string]: ExtensionInput } = {},
  >(args: {
    name?: TName;
    attachTo?: ExtensionDefinitionAttachTo<UParentInputs> &
      VerifyExtensionAttachTo<
        ExtensionDataRef extends UNewOutput
          ? NonNullable<T['output']>
          : UNewOutput,
        UParentInputs
      >;
    disabled?: boolean;
    enabled?: import('../blueprints/types').ExtensionConditionFunc;
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
      originalFactory: <
        TParamsInput extends AnyParamsInput<NonNullable<T['params']>>,
      >(
        params: TParamsInput extends ExtensionBlueprintDefineParams
          ? TParamsInput
          : T['params'] extends ExtensionBlueprintDefineParams
          ? 'Error: This blueprint uses advanced parameter types and requires you to pass parameters as using the following callback syntax: `originalFactory(defineParams => defineParams(<params>))`'
          : T['params'],
        context?: {
          config?: T['config'];
          inputs?: ResolvedInputValueOverrides<NonNullable<T['inputs']>>;
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
        ExtensionDataRef extends UNewOutput
          ? NonNullable<T['output']>
          : UNewOutput,
        UFactoryOutput
      >;
  }): OverridableExtensionDefinition<{
    config: Expand<
      (string extends keyof TExtensionConfigSchema
        ? {}
        : {
            [key in keyof TExtensionConfigSchema]: z.infer<
              ReturnType<TExtensionConfigSchema[key]>
            >;
          }) &
        T['config']
    >;
    configInput: Expand<
      (string extends keyof TExtensionConfigSchema
        ? {}
        : z.input<
            z.ZodObject<{
              [key in keyof TExtensionConfigSchema]: ReturnType<
                TExtensionConfigSchema[key]
              >;
            }>
          >) &
        T['configInput']
    >;
    output: ExtensionDataRef extends UNewOutput ? T['output'] : UNewOutput;
    inputs: Expand<T['inputs'] & TExtraInputs>;
    kind: T['kind'];
    name: string | undefined extends TName ? undefined : TName;
    params: T['params'];
  }>;
}

function unwrapParamsFactory<TParams extends object>(
  // Allow `Function` because `typeof <object> === 'function'` allows it, but in practice this should always be a param factory
  params: ParamsFactory<ExtensionBlueprintDefineParams> | Function,
  defineParams: ExtensionBlueprintDefineParams,
  kind: string,
): TParams {
  const paramDefinition = (
    params as ParamsFactory<ExtensionBlueprintDefineParams>
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
  params: object | ParamsFactory<ExtensionBlueprintDefineParams> | string,
  ctx: { node: AppNode; [ctxParamsSymbol]?: any },
  defineParams: ExtensionBlueprintDefineParams | undefined,
  kind: string,
): TParams {
  const overrideParams = ctx[ctxParamsSymbol] as
    | object
    | ParamsFactory<ExtensionBlueprintDefineParams>
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
 * Creates a new extension blueprint that encapsulates the creation of
 * extensions of particular kinds.
 *
 * @remarks
 *
 * For details on how blueprints work, see the
 * {@link https://backstage.io/docs/frontend-system/architecture/extension-blueprints | documentation for extension blueprints}
 * in the frontend system documentation.
 *
 * Extension blueprints make it much easier for users to create new extensions
 * for your plugin. Rather than letting them use {@link createExtension}
 * directly, you can define a set of parameters and default factory for your
 * blueprint, removing a lot of the boilerplate and complexity that is otherwise
 * needed to create an extension.
 *
 * Each blueprint has its own `kind` that helps identify and group the
 * extensions that have been created with it. For example the
 * {@link PageBlueprint} has the kind `'page'`, and extensions created with it
 * will be given the ID `'page:<plugin-id>[/<name>]'`. Blueprints should always
 * be exported as `<PascalCaseKind>Blueprint`.
 *
 * When creating a blueprint the type of the parameters are inferred from the
 * `factory` function that you provide. The exception to that is when you need
 * your blueprint to include inferred type parameters, in which case you need to
 * use the `defineParams` option. See the documentation for the `defineParams`
 * option for more details on how that works.
 *
 * @example
 * ```tsx
 * // In your plugin library
 * export const GreetingBlueprint = createExtensionBlueprint({
 *   kind: 'greeting',
 *   attachTo: { id: 'example', input: 'greetings' },
 *   output: [coreExtensionData.reactElement],
 *   factory(params: { greeting: string }) {
 *     return [coreExtensionData.reactElement(<h1>{params.greeting}</h1>)];
 *   },
 * });
 *
 * // Someone using your blueprint in their plugin
 * const exampleGreeting = GreetingBlueprint.make({
 *   params: {
 *     greeting: 'Hello, world!',
 *   },
 * });
 * ```
 * @public
 */
export function createExtensionBlueprint<
  TParams extends object | ExtensionBlueprintDefineParams,
  UOutput extends ExtensionDataRef,
  TInputs extends { [inputName in string]: ExtensionInput },
  TConfigSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
  TKind extends string,
  UParentInputs extends ExtensionDataRef,
  TDataRefs extends { [name in string]: ExtensionDataRef } = never,
>(
  options: CreateExtensionBlueprintOptions<
    TKind,
    TParams,
    UOutput,
    TInputs,
    TConfigSchema,
    UFactoryOutput,
    TDataRefs,
    UParentInputs
  >,
): ExtensionBlueprint<{
  kind: TKind;
  params: TParams;
  // This inference and remapping back to ExtensionDataRef eliminates any occurrences ConfigurationExtensionDataRef
  output: UOutput extends ExtensionDataRef<
    infer IData,
    infer IId,
    infer IConfig
  >
    ? ExtensionDataRef<IData, IId, IConfig>
    : never;
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
    | ExtensionBlueprintDefineParams
    | undefined;

  return {
    dataRefs: options.dataRefs,
    make(args) {
      return createExtension({
        kind: options.kind,
        name: args.name,
        attachTo: (args.attachTo ??
          options.attachTo) as ExtensionDefinitionAttachTo,
        disabled: args.disabled ?? options.disabled,
        enabled: args.enabled ?? options.enabled,
        inputs: options.inputs,
        output: options.output as ExtensionDataRef[],
        config: options.config,
        factory: ctx =>
          options.factory(
            unwrapParams(args.params, ctx, defineParams, options.kind),
            ctx,
          ) as Iterable<ExtensionDataValue<any, any>>,
      }) as OverridableExtensionDefinition;
    },
    makeWithOverrides(args) {
      return createExtension({
        kind: options.kind,
        name: args.name,
        attachTo: (args.attachTo ??
          options.attachTo) as ExtensionDefinitionAttachTo,
        disabled: args.disabled ?? options.disabled,
        enabled: args.enabled ?? options.enabled,
        inputs: { ...args.inputs, ...options.inputs },
        output: (args.output ?? options.output) as ExtensionDataRef[],
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
              return createExtensionDataContainer<
                UOutput extends ExtensionDataRef<
                  infer IData,
                  infer IId,
                  infer IConfig
                >
                  ? ExtensionDataRef<IData, IId, IConfig>
                  : never
              >(
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
                'original blueprint factory',
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
      }) as OverridableExtensionDefinition;
    },
  } as ExtensionBlueprint<{
    kind: TKind;
    params: TParams;
    output: any;
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
