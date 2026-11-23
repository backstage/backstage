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
import { ExtensionInput } from './createExtensionInput';
import { type StandardSchemaV1 } from '@standard-schema/spec';
import { ExtensionDataRef, ExtensionDataValue } from './createExtensionDataRef';
import { createExtensionDataContainer } from '@internal/frontend';
import {
  ResolvedInputValueOverrides,
  resolveInputOverrides,
} from './resolveInputOverrides';
import { ExtensionDataContainer } from './types';
import { PageBlueprint } from '../blueprints/PageBlueprint';
import { FilterPredicate } from '@backstage/filter-predicates';
import { assertNoLegacyConfigSchema } from '../schema/assertNoLegacyConfigSchema';
import {
  PickCallbackLiterals,
  PickLiteralAttachTo,
  PickLiteralParams,
} from './ExtensionDefinitionLiterals';

/**
 * A function used to define a parameter mapping function in order to facilitate
 * advanced parameter typing for extension blueprints.
 *
 * @remarks
 *
 * This function is primarily intended to enable the use of inferred type
 * parameters for blueprint params, but it can also be used to transform the
 * params before they are handed to the blueprint.
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
export type ExtensionBlueprintParams<
  T extends object = object,
  TLiterals = unknown,
> = {
  $$type: '@backstage/BlueprintParams';
  T: T;
  /**
   * The literal values of the params, which a blueprint can record so that
   * tools can read them from type declarations. Never present at runtime.
   */
  literals?: TLiterals;
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
  UFactoryOutput extends ExtensionDataValue<any, any>,
  TDataRefs extends { [name in string]: ExtensionDataRef },
  UParentInputs extends ExtensionDataRef,
  TNewConfigSchema extends { [key in string]: StandardSchemaV1 } = {},
> = {
  kind: TKind;
  attachTo: ExtensionDefinitionAttachTo<UParentInputs> &
    VerifyExtensionAttachTo<UOutput, UParentInputs>;
  disabled?: boolean;
  if?: FilterPredicate;
  inputs?: TInputs;
  output: Array<UOutput>;
  configSchema?: TNewConfigSchema;
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
        [key in keyof TNewConfigSchema]: StandardSchemaV1.InferOutput<
          TNewConfigSchema[key]
        >;
      };
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
  ): Iterable<UFactoryOutput>;

  dataRefs?: TDataRefs;
} & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>;

/** @public */
export type ExtensionBlueprintParameters = {
  kind: string;
  /**
   * The identity of the blueprint, recorded in the type of the extensions
   * made with it. Only exists at the type level.
   */
  blueprint?: string;
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

/** @ignore */
type KeysOfUnion<T> = T extends any ? keyof T : never;

/**
 * Checks the params passed to `make`. The params are intersected with their
 * own inferred type so that literal values are preserved, which means that
 * excess properties of inline object literals must be rejected explicitly.
 *
 * @ignore
 */
type MakeParamsCheck<TBlueprintParams, TParamsInput> =
  // Distributes over the constraint of the params input before it has been
  // inferred, so that callback params keep their contextual type
  TParamsInput extends ExtensionBlueprintDefineParams
    ? unknown
    : MakeObjectParamsCheck<TBlueprintParams, TParamsInput>;

/** @ignore */
type MakeObjectParamsCheck<TBlueprintParams, TParamsInput> = [
  TBlueprintParams,
] extends [ExtensionBlueprintDefineParams]
  ? 'Error: This blueprint uses advanced parameter types and requires you to pass parameters as using the following callback syntax: `<blueprint>.make({ params: defineParams => defineParams(<params>) })`'
  : TBlueprintParams & {
      [K in keyof TParamsInput as K extends KeysOfUnion<TBlueprintParams>
        ? never
        : IsReadonlyKey<TParamsInput, K> extends true
        ? K
        : never]: never;
    };

/**
 * Whether a property is readonly. Inline object literals are inferred with
 * readonly properties because the params input is a const type parameter,
 * while params held in a variable are usually mutable. This is used to only
 * reject unknown params when they are passed inline, like an excess property
 * check would.
 *
 * @ignore
 */
type IsReadonlyKey<T, K extends keyof T> = (<X>() => X extends {
  [Q in K]: T[K];
}
  ? 1
  : 2) extends <X>() => X extends { readonly [Q in K]: T[K] } ? 1 : 2
  ? true
  : false;

/**
 * @public
 */
export interface ExtensionBlueprint<
  T extends ExtensionBlueprintParameters = ExtensionBlueprintParameters,
> {
  dataRefs: T['dataRefs'];

  make<
    TName extends string | undefined,
    const TParamsInput extends AnyParamsInput<NonNullable<T['params']>>,
    UParentInputs extends ExtensionDataRef,
    const TAttachTo extends
      | ExtensionDefinitionAttachTo<UParentInputs>
      | undefined = undefined,
    TDisabled extends boolean | undefined = undefined,
    const TIf extends FilterPredicate | undefined = undefined,
  >(args: {
    name?: TName;
    attachTo?: TAttachTo &
      ExtensionDefinitionAttachTo<UParentInputs> &
      VerifyExtensionAttachTo<NonNullable<T['output']>, UParentInputs>;
    disabled?: TDisabled;
    if?: TIf;
    params: TParamsInput & MakeParamsCheck<T['params'], TParamsInput>;
  }): OverridableExtensionDefinition<{
    kind: T['kind'];
    name: string | undefined extends TName ? undefined : TName;
    config: T['config'];
    configInput: T['configInput'];
    output: T['output'];
    inputs: T['inputs'];
    params: T['params'];
    literals: {
      blueprint: T extends { blueprint: infer IBlueprint extends string }
        ? IBlueprint
        : undefined;
      params: [TParamsInput] extends [ExtensionBlueprintDefineParams]
        ? undefined
        : PickLiteralParams<TParamsInput>;
      paramKeys: [TParamsInput] extends [ExtensionBlueprintDefineParams]
        ? undefined
        : keyof TParamsInput & string;
      paramsCallback: [TParamsInput] extends [ExtensionBlueprintDefineParams]
        ? PickCallbackLiterals<TParamsInput>
        : undefined;
      attachTo: PickLiteralAttachTo<TAttachTo>;
      disabled: TDisabled;
      if: TIf;
    };
  }>;

  /**
   * Creates a new extension from the blueprint.
   *
   * You must either pass `params` directly, or define a `factory` that can
   * optionally call the original factory with the same params.
   */
  makeWithOverrides<
    TName extends string | undefined,
    UFactoryOutput extends ExtensionDataValue<any, any>,
    UNewOutput extends ExtensionDataRef,
    UParentInputs extends ExtensionDataRef,
    TExtraInputs extends { [inputName in string]: ExtensionInput } = {},
    TNewExtensionConfigSchema extends {
      [key in string]: StandardSchemaV1;
    } = {},
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
    if?: FilterPredicate;
    inputs?: TExtraInputs & {
      [KName in keyof T['inputs']]?: `Error: Input '${KName &
        string}' is already defined in parent definition`;
    };
    output?: Array<UNewOutput>;
    config?: never;
    configSchema?: TNewExtensionConfigSchema & {
      [KName in keyof T['config']]?: `Error: Config key '${KName &
        string}' is already defined in parent schema`;
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
          [key in keyof TNewExtensionConfigSchema]: StandardSchemaV1.InferOutput<
            TNewExtensionConfigSchema[key]
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
      {
        [key in keyof TNewExtensionConfigSchema]: StandardSchemaV1.InferOutput<
          TNewExtensionConfigSchema[key]
        >;
      } & T['config']
    >;
    configInput: Expand<
      {
        [key in keyof TNewExtensionConfigSchema]?: StandardSchemaV1.InferInput<
          TNewExtensionConfigSchema[key]
        >;
      } & T['configInput']
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
 * for your plugin. Rather than letting them use `createExtension`
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
  UFactoryOutput extends ExtensionDataValue<any, any>,
  TKind extends string,
  UParentInputs extends ExtensionDataRef,
  TDataRefs extends { [name in string]: ExtensionDataRef } = never,
  TNewConfigSchema extends { [key in string]: StandardSchemaV1 } = {},
>(
  options: {
    kind: TKind;
    attachTo: ExtensionDefinitionAttachTo<UParentInputs> &
      VerifyExtensionAttachTo<UOutput, UParentInputs>;
    disabled?: boolean;
    if?: FilterPredicate;
    inputs?: TInputs;
    output: Array<UOutput>;
    configSchema?: TNewConfigSchema;
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
          [key in keyof TNewConfigSchema]: StandardSchemaV1.InferOutput<
            TNewConfigSchema[key]
          >;
        };
        inputs: Expand<ResolvedExtensionInputs<TInputs>>;
      },
    ): Iterable<UFactoryOutput>;
    dataRefs?: TDataRefs;
  } & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>,
): ExtensionBlueprint<{
  kind: TKind;
  params: TParams;
  output: UOutput extends ExtensionDataRef<
    infer IData,
    infer IId,
    infer IConfig
  >
    ? ExtensionDataRef<IData, IId, IConfig>
    : never;
  inputs: string extends keyof TInputs ? {} : TInputs;
  config: {
    [key in keyof TNewConfigSchema]: StandardSchemaV1.InferOutput<
      TNewConfigSchema[key]
    >;
  };
  configInput: {
    [key in keyof TNewConfigSchema]?: StandardSchemaV1.InferInput<
      TNewConfigSchema[key]
    >;
  };
  dataRefs: TDataRefs;
}>;

/** @internal */
export function createExtensionBlueprint(options: any): any {
  assertNoLegacyConfigSchema(options);

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
        if: args.if ?? options.if,
        inputs: options.inputs,
        output: options.output as ExtensionDataRef[],
        configSchema: options.configSchema as any,
        factory: ctx =>
          options.factory(
            unwrapParams(args.params, ctx, defineParams, options.kind),
            ctx as any,
          ) as Iterable<ExtensionDataValue<any, any>>,
      }) as OverridableExtensionDefinition;
    },
    makeWithOverrides(args: any) {
      assertNoLegacyConfigSchema(args);

      return createExtension({
        kind: options.kind,
        name: args.name,
        attachTo: (args.attachTo ??
          options.attachTo) as ExtensionDefinitionAttachTo,
        disabled: args.disabled ?? options.disabled,
        if: args.if ?? options.if,
        inputs: { ...args.inputs, ...options.inputs },
        output: (args.output ?? options.output) as ExtensionDataRef[],
        configSchema:
          options.configSchema || args.configSchema
            ? {
                ...options.configSchema,
                ...args.configSchema,
              }
            : (undefined as any),
        factory: ctx => {
          const { node, config, inputs, apis } = ctx;
          return args.factory(
            (innerParams: any, innerContext: any) => {
              return createExtensionDataContainer<any>(
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
  } as ExtensionBlueprint<any>;
}
