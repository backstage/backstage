/*
 * Copyright 2023 The Backstage Authors
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

import { over } from 'lodash';
import { AppNode } from '../apis';
import { PortableSchema, createSchemaFromZod } from '../schema';
import { Expand } from '../types';
import {
  AnyExtensionDataRef,
  ExtensionDataRef,
  ExtensionDataValue,
} from './createExtensionDataRef';
import { ExtensionInput, LegacyExtensionInput } from './createExtensionInput';
import { z } from 'zod';

/**
 * @public
 * @deprecated Extension data maps will be removed.
 */
export type AnyExtensionDataMap = {
  [name in string]: AnyExtensionDataRef;
};

/**
 * @public
 * @deprecated This type will be removed.
 */
export type AnyExtensionInputMap = {
  [inputName in string]: LegacyExtensionInput<
    AnyExtensionDataMap,
    { optional: boolean; singleton: boolean }
  >;
};

/**
 * Converts an extension data map into the matching concrete data values type.
 * @public
 * @deprecated Extension data maps will be removed.
 */
export type ExtensionDataValues<TExtensionData extends AnyExtensionDataMap> = {
  [DataName in keyof TExtensionData as TExtensionData[DataName]['config'] extends {
    optional: true;
  }
    ? never
    : DataName]: TExtensionData[DataName]['T'];
} & {
  [DataName in keyof TExtensionData as TExtensionData[DataName]['config'] extends {
    optional: true;
  }
    ? DataName
    : never]?: TExtensionData[DataName]['T'];
};

/** @public */
export type ExtensionDataContainer<UExtensionData extends AnyExtensionDataRef> =
  Iterable<
    UExtensionData extends ExtensionDataRef<
      infer IData,
      infer IId,
      infer IConfig
    >
      ? IConfig['optional'] extends true
        ? never
        : ExtensionDataValue<IData, IId>
      : never
  > & {
    get<TId extends UExtensionData['id']>(
      ref: ExtensionDataRef<any, TId, any>,
    ): UExtensionData extends ExtensionDataRef<infer IData, TId, infer IConfig>
      ? IConfig['optional'] extends true
        ? IData | undefined
        : IData
      : never;
  };

/**
 * Convert a single extension input into a matching resolved input.
 * @public
 */
export type ResolvedExtensionInput<
  TExtensionInput extends ExtensionInput<any, any>,
> = TExtensionInput['extensionData'] extends Array<AnyExtensionDataRef>
  ? {
      node: AppNode;
    } & ExtensionDataContainer<TExtensionInput['extensionData'][number]>
  : TExtensionInput['extensionData'] extends AnyExtensionDataMap
  ? {
      node: AppNode;
      output: ExtensionDataValues<TExtensionInput['extensionData']>;
    }
  : never;

/**
 * Converts an extension input map into a matching collection of resolved inputs.
 * @public
 */
export type ResolvedExtensionInputs<
  TInputs extends {
    [name in string]: ExtensionInput<any, any> | LegacyExtensionInput<any, any>;
  },
> = {
  [InputName in keyof TInputs]: false extends TInputs[InputName]['config']['singleton']
    ? Array<Expand<ResolvedExtensionInput<TInputs[InputName]>>>
    : false extends TInputs[InputName]['config']['optional']
    ? Expand<ResolvedExtensionInput<TInputs[InputName]>>
    : Expand<ResolvedExtensionInput<TInputs[InputName]> | undefined>;
};

/**
 * @public
 * @deprecated This way of structuring the options is deprecated, this type will be removed in the future
 */
export interface LegacyCreateExtensionOptions<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
  TConfigInput,
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
> {
  kind?: string;
  namespace?: string;
  name?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  /** @deprecated - use `config.schema` instead */
  configSchema?: PortableSchema<TConfig, TConfigInput>;
  config?: {
    schema: TConfigSchema;
  };
  factory(context: {
    node: AppNode;
    config: TConfig &
      (string extends keyof TConfigSchema
        ? {}
        : {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
          });
    inputs: Expand<ResolvedExtensionInputs<TInputs>>;
  }): Expand<ExtensionDataValues<TOutput>>;
}

/** @ignore */
export type VerifyExtensionFactoryOutput<
  UDeclaredOutput extends AnyExtensionDataRef,
  UFactoryOutput extends ExtensionDataValue<any, any>,
> = (
  UDeclaredOutput extends any
    ? UDeclaredOutput['config']['optional'] extends true
      ? never
      : UDeclaredOutput['id']
    : never
) extends infer IRequiredOutputIds
  ? [IRequiredOutputIds] extends [UFactoryOutput['id']]
    ? [UFactoryOutput['id']] extends [UDeclaredOutput['id']]
      ? {}
      : {
          'Error: The extension factory has undeclared output(s)': Exclude<
            UFactoryOutput['id'],
            UDeclaredOutput['id']
          >;
        }
    : {
        'Error: The extension factory is missing the following output(s)': Exclude<
          IRequiredOutputIds,
          UFactoryOutput['id']
        >;
      }
  : never;

/** @public */
export type CreateExtensionOptions<
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  TConfig,
  TConfigInput,
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
> = {
  kind?: string;
  namespace?: string;
  name?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: Array<UOutput>;
  /** @deprecated - use `config.schema` instead */
  configSchema?: PortableSchema<TConfig, TConfigInput>;
  config?: {
    schema: TConfigSchema;
  };
  factory(context: {
    node: AppNode;
    config: TConfig &
      (string extends keyof TConfigSchema
        ? {}
        : {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
          });
    inputs: Expand<ResolvedExtensionInputs<TInputs>>;
  }): Iterable<UFactoryOutput>;
} & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>;

/** @public */
export interface ExtensionDefinition<TConfig, TConfigInput = TConfig> {
  $$type: '@backstage/ExtensionDefinition';
  readonly kind?: string;
  readonly namespace?: string;
  readonly name?: string;
  readonly attachTo: { id: string; input: string };
  readonly disabled: boolean;
  readonly configSchema?: PortableSchema<TConfig, TConfigInput>;
}

export type OverrideExtensionOptions<
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  TConfig,
  TConfigInput,
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
  TConfigSchemaOverrides extends {
    [key: string]: (zImpl: typeof z) => z.ZodType;
  },
  UOutputOverrides extends AnyExtensionDataRef,
  UFactoryOverrideOutput extends ExtensionDataValue<any, any>,
> = {
  kind?: string;
  namespace?: string;
  name?: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output?: Array<UOutputOverrides>;
  /** @deprecated - use `config.schema` instead */
  configSchema?: PortableSchema<TConfig, TConfigInput>;
  config?: {
    schema: TConfigSchemaOverrides & {
      [KName in keyof TConfig]?: `Error: Config key '${KName &
        string}' is already defined in parent schema`;
    };
  };
  factory?(
    originalFactory: (context?: {
      config?: {
        [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
      };
      inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
    }) => ExtensionDataContainer<UOutput>,
    context: {
      node: AppNode;
      config: TConfig &
        (string extends keyof TConfigSchema
          ? {}
          : {
              [key in keyof TConfigSchemaOverrides]: z.infer<
                ReturnType<TConfigSchemaOverrides[key]>
              >;
            } & {
              [key in keyof TConfigSchema]: z.infer<
                ReturnType<TConfigSchema[key]>
              >;
            });
      inputs: Expand<ResolvedExtensionInputs<TInputs>>;
    },
  ): Iterable<UFactoryOverrideOutput>;
  // todo(blam): need to verify that the outputs are merged and verified properly.
} & VerifyExtensionFactoryOutput<
  UOutput & UOutputOverrides,
  UFactoryOverrideOutput
>;

/** @public */
export type OverridableExtension<
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  TConfig,
  TConfigInput,
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
> = {
  override<
    TConfigSchemaOverrides extends {
      [key in string]: (zImpl: typeof z) => z.ZodType;
    },
    UOutputOverrides extends AnyExtensionDataRef,
    UFactoryOverrideOutput extends ExtensionDataValue<any, any>,
  >(
    options: OverrideExtensionOptions<
      UOutput,
      TInputs,
      TConfig,
      TConfigInput,
      TConfigSchema,
      TConfigSchemaOverrides,
      UOutputOverrides,
      UFactoryOverrideOutput
    >,
  ): ExtensionDefinition<TConfig, TConfigInput>;
};

/** @internal */
export type InternalExtensionDefinition<TConfig, TConfigInput> =
  ExtensionDefinition<TConfig, TConfigInput> &
    (
      | {
          readonly version: 'v1';
          readonly inputs: AnyExtensionInputMap;
          readonly output: AnyExtensionDataMap;
          factory(context: {
            node: AppNode;
            config: TConfig;
            inputs: ResolvedExtensionInputs<AnyExtensionInputMap>;
          }): ExtensionDataValues<any>;
        }
      | {
          readonly version: 'v2';
          readonly inputs: {
            [inputName in string]: ExtensionInput<
              AnyExtensionDataRef,
              { optional: boolean; singleton: boolean }
            >;
          };
          readonly output: Array<AnyExtensionDataRef>;
          factory(context: {
            node: AppNode;
            config: TConfig;
            inputs: ResolvedExtensionInputs<{
              [inputName in string]: ExtensionInput<
                AnyExtensionDataRef,
                { optional: boolean; singleton: boolean }
              >;
            }>;
          }): Iterable<ExtensionDataValue<any, any>>;
        }
    );

/** @internal */
export function toInternalExtensionDefinition<TConfig, TConfigInput>(
  overrides: ExtensionDefinition<TConfig, TConfigInput>,
): InternalExtensionDefinition<TConfig, TConfigInput> {
  const internal = overrides as InternalExtensionDefinition<
    TConfig,
    TConfigInput
  >;
  if (internal.$$type !== '@backstage/ExtensionDefinition') {
    throw new Error(
      `Invalid extension definition instance, bad type '${internal.$$type}'`,
    );
  }
  const version = internal.version;
  if (version !== 'v1' && version !== 'v2') {
    throw new Error(
      `Invalid extension definition instance, bad version '${version}'`,
    );
  }
  return internal;
}

/** @public */
export function createExtension<
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  TConfig,
  TConfigInput,
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
>(
  options: CreateExtensionOptions<
    UOutput,
    TInputs,
    TConfig,
    TConfigInput,
    TConfigSchema,
    UFactoryOutput
  >,
): ExtensionDefinition<
  TConfig &
    (string extends keyof TConfigSchema
      ? {}
      : {
          [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
        }),
  TConfigInput &
    (string extends keyof TConfigSchema
      ? {}
      : z.input<
          z.ZodObject<{
            [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
          }>
        >)
> &
  OverridableExtension<UOutput, TInputs, TConfig, TConfigInput, TConfigSchema>;
/**
 * @public
 * @deprecated - use the array format of `output` instead, see TODO-doc-link
 */
export function createExtension<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
  TConfigInput,
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
>(
  options: LegacyCreateExtensionOptions<
    TOutput,
    TInputs,
    TConfig,
    TConfigInput,
    TConfigSchema
  >,
): ExtensionDefinition<
  TConfig &
    (string extends keyof TConfigSchema
      ? {}
      : {
          [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
        }),
  TConfigInput &
    (string extends keyof TConfigSchema
      ? {}
      : z.input<
          z.ZodObject<{
            [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
          }>
        >)
>;
export function createExtension<
  UOutput extends AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  },
  TLegacyInputs extends AnyExtensionInputMap,
  TConfig,
  TConfigInput,
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
>(
  options:
    | CreateExtensionOptions<
        UOutput,
        TInputs,
        TConfig,
        TConfigInput,
        TConfigSchema,
        UFactoryOutput
      >
    | LegacyCreateExtensionOptions<
        AnyExtensionDataMap,
        TLegacyInputs,
        TConfig,
        TConfigInput,
        TConfigSchema
      >,
): ExtensionDefinition<
  TConfig &
    (string extends keyof TConfigSchema
      ? {}
      : {
          [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
        }),
  TConfigInput &
    (string extends keyof TConfigSchema
      ? {}
      : z.input<
          z.ZodObject<{
            [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
          }>
        >)
> &
  OverridableExtension<UOutput, TInputs, TConfig, TConfigInput, TConfigSchema> {
  const newConfigSchema = options.config?.schema;
  if (newConfigSchema && options.configSchema) {
    throw new Error(`Cannot provide both configSchema and config.schema`);
  }
  const configSchema = newConfigSchema
    ? createSchemaFromZod(innerZ =>
        innerZ.object(
          Object.fromEntries(
            Object.entries(newConfigSchema).map(([k, v]) => [k, v(innerZ)]),
          ),
        ),
      )
    : options.configSchema;

  return {
    $$type: '@backstage/ExtensionDefinition',
    version: Symbol.iterator in options.output ? 'v2' : 'v1',
    kind: options.kind,
    namespace: options.namespace,
    name: options.name,
    attachTo: options.attachTo,
    disabled: options.disabled ?? false,
    inputs: options.inputs ?? {},
    output: options.output,
    configSchema,
    factory: options.factory,
    toString() {
      const parts: string[] = [];
      if (options.kind) {
        parts.push(`kind=${options.kind}`);
      }
      if (options.namespace) {
        parts.push(`namespace=${options.namespace}`);
      }
      if (options.name) {
        parts.push(`name=${options.name}`);
      }
      parts.push(`attachTo=${options.attachTo.id}@${options.attachTo.input}`);
      return `ExtensionDefinition{${parts.join(',')}}`;
    },
    override<
      TConfigSchemaOverrides extends {
        [key in string]: (zImpl: typeof z) => z.ZodType;
      },
      UOutputOverrides extends AnyExtensionDataRef,
      UFactoryOverrideOutput extends ExtensionDataValue<any, any>,
    >(
      overrideOptions: OverrideExtensionOptions<
        UOutput,
        TInputs,
        TConfig,
        TConfigInput,
        TConfigSchema,
        TConfigSchemaOverrides,
        UOutputOverrides,
        UFactoryOverrideOutput
      >,
    ) {
      const overrideNewConfigSchema = overrideOptions.config?.schema;
      if (overrideNewConfigSchema && overrideOptions.configSchema) {
        throw new Error(`Cannot provide both configSchema and config.schema`);
      }

      const mergedConfigSchema = {
        ...options.config?.schema,
        ...overrideOptions.config?.schema,
      };

      const overrideConfigSchema = mergedConfigSchema
        ? createSchemaFromZod(innerZ =>
            innerZ.object(
              Object.fromEntries(
                Object.entries(mergedConfigSchema).map(([k, v]) => [
                  k,
                  v(innerZ),
                ]),
              ),
            ),
          )
        : overrideOptions.configSchema;

      const buildDataContainer = (outputs): ExtensionDataContainer<UOutput> => {
        const dataMap = new Map<string, unknown>();
        if (Symbol.iterator in outputs) {
          for (const output of outputs) {
            dataMap.set(output.id, output.value);
          }
        }

        return {
          get(ref) {
            return dataMap.get(ref.id);
          },
        } as ExtensionDataContainer<UOutput>;
      };

      return createExtension({
        attachTo: options.attachTo,
        output: overrideOptions.output ?? options.output,
        configSchema: overrideConfigSchema,
        factory: ({ node, config, inputs }) => {
          if (overrideOptions.factory) {
            return overrideOptions.factory(
              innerCtx => {
                const originalFactoryResponse = options.factory({
                  node,
                  config: innerCtx?.config ?? config,
                  inputs: innerCtx?.inputs ?? inputs,
                });

                return buildDataContainer(originalFactoryResponse);
              },
              { node, config, inputs },
            );
          }
          return options.factory(originalFactory, context);
        },
        disabled: overrideOptions.disabled ?? options.disabled,
        inputs: overrideOptions.inputs ?? options.inputs,
        kind: overrideOptions.kind ?? options.kind,
        name: overrideOptions.name ?? options.name,
        namespace: overrideOptions.namespace ?? options.namespace,
      });
    },
  } as InternalExtensionDefinition<
    TConfig &
      (string extends keyof TConfigSchema
        ? {}
        : {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
          }),
    TConfigInput &
      (string extends keyof TConfigSchema
        ? {}
        : z.input<
            z.ZodObject<{
              [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
            }>
          >)
  >;
}
