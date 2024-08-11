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
  ResolvedExtensionInput,
  ResolvedExtensionInputs,
  VerifyExtensionFactoryOutput,
  createExtension,
} from './createExtension';
import { z } from 'zod';
import { ExtensionInput } from './createExtensionInput';
import {
  AnyExtensionDataRef,
  ExtensionDataRef,
  ExtensionDataRefToValue,
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
  namespace?: TNamespace;
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
      config: {
        [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
      };
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
  ): Iterable<UFactoryOutput>;

  dataRefs?: TDataRefs;
} & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>;

/** @ignore */
export type ResolveInputValueOverrides<
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  } = {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
> = Expand<
  {
    [KName in keyof TInputs as TInputs[KName] extends ExtensionInput<
      any,
      {
        optional: infer IOptional extends boolean;
        singleton: boolean;
      }
    >
      ? IOptional extends true
        ? never
        : KName
      : never]: TInputs[KName] extends ExtensionInput<
      infer IDataRefs,
      { optional: boolean; singleton: infer ISingleton extends boolean }
    >
      ? ISingleton extends true
        ? Iterable<ExtensionDataRefToValue<IDataRefs>>
        : Array<Iterable<ExtensionDataRefToValue<IDataRefs>>>
      : never;
  } & {
    [KName in keyof TInputs as TInputs[KName] extends ExtensionInput<
      any,
      {
        optional: infer IOptional extends boolean;
        singleton: boolean;
      }
    >
      ? IOptional extends true
        ? KName
        : never
      : never]?: TInputs[KName] extends ExtensionInput<
      infer IDataRefs,
      { optional: boolean; singleton: infer ISingleton extends boolean }
    >
      ? ISingleton extends true
        ? Iterable<ExtensionDataRefToValue<IDataRefs>>
        : Array<Iterable<ExtensionDataRefToValue<IDataRefs>>>
      : never;
  }
>;

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

  make<
    TNewNamespace extends string | undefined,
    TNewName extends string | undefined,
  >(args: {
    namespace?: TNewNamespace;
    name?: TNewName;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    params: TParams;
  }): ExtensionDefinition<
    TConfig,
    TConfigInput,
    UOutput,
    TInputs,
    TKind,
    string | undefined extends TNewNamespace ? TNamespace : TNewNamespace,
    string | undefined extends TNewName ? TName : TNewName
  >;

  /**
   * Creates a new extension from the blueprint.
   *
   * You must either pass `params` directly, or define a `factory` that can
   * optionally call the original factory with the same params.
   */
  makeWithOverrides<
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
  >(args: {
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
    factory(
      originalFactory: (
        params: TParams,
        context?: {
          config?: TConfig;
          inputs?: ResolveInputValueOverrides<TInputs>;
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
    ): Iterable<UFactoryOutput> &
      VerifyExtensionFactoryOutput<
        AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput,
        UFactoryOutput
      >;
  }): ExtensionDefinition<
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
  declaredRefs?: ExtensionDataRef<any, any, any>[],
): ExtensionDataContainer<UData> {
  const container = new Map<string, ExtensionDataValue<any, any>>();
  const verifyRefs =
    declaredRefs && new Map(declaredRefs.map(ref => [ref.id, ref]));

  for (const output of values) {
    if (verifyRefs) {
      if (!verifyRefs.delete(output.id)) {
        throw new Error(
          `Invalid data value provided, '${output.id}' was not declared`,
        );
      }
    }
    container.set(output.id, output);
  }

  const remainingRefs =
    verifyRefs &&
    Array.from(verifyRefs.values()).filter(ref => !ref.config.optional);
  if (remainingRefs && remainingRefs.length > 0) {
    throw new Error(
      `Missing required data values for '${remainingRefs
        .map(ref => ref.id)
        .join(', ')}'`,
    );
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

function expectArray<T>(value: T | T[]): T[] {
  return value as T[];
}
function expectItem<T>(value: T | T[]): T {
  return value as T;
}

/** @internal */
export function resolveInputOverrides(
  declaredInputs?: {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  inputs?: {
    [KName in string]?:
      | ({ node: AppNode } & ExtensionDataContainer<any>)
      | Array<{ node: AppNode } & ExtensionDataContainer<any>>;
  },
  inputOverrides?: ResolveInputValueOverrides,
) {
  if (!declaredInputs || !inputs || !inputOverrides) {
    return inputs;
  }

  const newInputs: typeof inputs = {};
  for (const name in declaredInputs) {
    if (!Object.hasOwn(declaredInputs, name)) {
      continue;
    }
    const declaredInput = declaredInputs[name];
    const providedData = inputOverrides[name];
    if (declaredInput.config.singleton) {
      const originalInput = expectItem(inputs[name]);
      if (providedData) {
        const providedContainer = createDataContainer(
          providedData as Iterable<ExtensionDataValue<any, any>>,
          declaredInput.extensionData,
        );
        if (!originalInput) {
          throw new Error(
            `A data override was provided for input '${name}', but no original input was present.`,
          );
        }
        newInputs[name] = Object.assign(providedContainer, {
          name: (originalInput as ResolvedExtensionInput<any>).node,
        }) as any;
      }
    } else {
      const originalInput = expectArray(inputs[name]);
      if (!Array.isArray(providedData)) {
        throw new Error(
          `Invalid override provided for input '${name}', expected an array`,
        );
      }
      if (originalInput.length !== providedData.length) {
        throw new Error(
          `Invalid override provided for input '${name}', when overriding the input data the length must match the original input data`,
        );
      }
      newInputs[name] = providedData.map((data, i) => {
        const providedContainer = createDataContainer(
          data as Iterable<ExtensionDataValue<any, any>>,
          declaredInput.extensionData,
        );
        return Object.assign(providedContainer, {
          name: (originalInput[i] as ResolvedExtensionInput<any>).node,
        }) as any;
      });
    }
  }
  return newInputs;
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

  public makeWithOverrides<
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
    config?: {
      schema: TExtensionConfigSchema;
    };
    factory(
      originalFactory: (
        params: TParams,
        context?: {
          config?: {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
          };
          inputs?: ResolveInputValueOverrides<TInputs>;
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
    const schema = {
      ...this.options.config?.schema,
      ...args.config?.schema,
    } as TConfigSchema & TExtensionConfigSchema;

    return createExtension({
      kind: this.options.kind,
      namespace: args.namespace ?? this.options.namespace,
      name: args.name ?? this.options.name,
      attachTo: args.attachTo ?? this.options.attachTo,
      disabled: args.disabled ?? this.options.disabled,
      inputs: { ...args.inputs, ...this.options.inputs },
      output: args.output ?? this.options.output,
      config: Object.keys(schema).length === 0 ? undefined : { schema },
      factory: ({ node, config, inputs }) => {
        return args.factory(
          (
            innerParams: TParams,
            innerContext?: {
              config?: {
                [key in keyof TConfigSchema]: z.infer<
                  ReturnType<TConfigSchema[key]>
                >;
              };
              inputs?: ResolveInputValueOverrides;
            },
          ): ExtensionDataContainer<UOutput> => {
            return createDataContainer<UOutput>(
              this.options.factory(innerParams, {
                node,
                config: innerContext?.config ?? config,
                inputs: resolveInputOverrides(
                  this.options.inputs,
                  inputs,
                  innerContext?.inputs,
                ) as any, // TODO: Might be able to improve this once legacy inputs are gone
              }),
              this.options.output,
            );
          },
          {
            node,
            config,
            inputs,
          },
        );
      },
    } as CreateExtensionOptions<TKind, string | undefined extends TNewNamespace ? TNamespace : TNewNamespace, string | undefined extends TNewName ? TName : TNewName, AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput, TInputs & TExtraInputs, TConfigSchema & TExtensionConfigSchema, UFactoryOutput>);
  }

  public make<
    TNewNamespace extends string | undefined = undefined,
    TNewName extends string | undefined = undefined,
  >(args: {
    namespace?: TNewNamespace;
    name?: TNewName;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    params: TParams;
  }): ExtensionDefinition<
    {
      [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
    },
    z.input<
      z.ZodObject<{
        [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
      }>
    >
  > {
    return createExtension({
      kind: this.options.kind,
      namespace: args.namespace ?? this.options.namespace,
      name: args.name ?? this.options.name,
      attachTo: args.attachTo ?? this.options.attachTo,
      disabled: args.disabled ?? this.options.disabled,
      inputs: this.options.inputs,
      output: this.options.output,
      config: this.options.config,
      factory: ctx => this.options.factory(args.params, ctx),
    } as CreateExtensionOptions<TKind, string | undefined extends TNewNamespace ? TNamespace : TNewNamespace, string | undefined extends TNewName ? TName : TNewName, UOutput, TInputs, TConfigSchema, any>);
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
