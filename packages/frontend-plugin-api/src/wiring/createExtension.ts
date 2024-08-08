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

import { AppNode } from '../apis';
import { PortableSchema, createSchemaFromZod } from '../schema';
import { Expand } from '../types';
import { createDataContainer } from './createExtensionBlueprint';
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
> {
  kind?: string;
  namespace?: string;
  name?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig, TConfigInput>;
  factory(context: {
    node: AppNode;
    config: TConfig;
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
  config?: {
    schema: TConfigSchema;
  };
  factory(context: {
    node: AppNode;
    config: {
      [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
    };
    inputs: Expand<ResolvedExtensionInputs<TInputs>>;
  }): Iterable<UFactoryOutput>;
} & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>;

/** @public */
export interface ExtensionDefinition<
  TConfig,
  TConfigInput = TConfig,
  UOutput extends AnyExtensionDataRef = AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  } = {},
> {
  $$type: '@backstage/ExtensionDefinition';
  readonly kind?: string;
  readonly namespace?: string;
  readonly name?: string;
  readonly attachTo: { id: string; input: string };
  readonly disabled: boolean;
  readonly configSchema?: PortableSchema<TConfig, TConfigInput>;

  override<
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
        originalFactory: (context?: {
          config?: TConfig;
          inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
        }) => ExtensionDataContainer<UOutput>,
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
    >,
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
    TInputs & TExtraInputs
  >;
}

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
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
>(
  options: CreateExtensionOptions<
    UOutput,
    TInputs,
    TConfigSchema,
    UFactoryOutput
  >,
): ExtensionDefinition<
  {
    [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
  },
  z.input<
    z.ZodObject<{
      [key in keyof TConfigSchema]: ReturnType<TConfigSchema[key]>;
    }>
  >,
  UOutput,
  TInputs
>;
/**
 * @public
 * @deprecated - use the array format of `output` instead, see TODO-doc-link
 */
export function createExtension<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
  TConfigInput,
>(
  options: LegacyCreateExtensionOptions<
    TOutput,
    TInputs,
    TConfig,
    TConfigInput
  >,
): ExtensionDefinition<TConfig, TConfigInput, never, never>;
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
    | CreateExtensionOptions<UOutput, TInputs, TConfigSchema, UFactoryOutput>
    | LegacyCreateExtensionOptions<
        AnyExtensionDataMap,
        TLegacyInputs,
        TConfig,
        TConfigInput
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
        >),
  UOutput,
  TInputs
> {
  if ('configSchema' in options && 'config' in options) {
    throw new Error(`Cannot provide both configSchema and config.schema`);
  }
  let configSchema: PortableSchema<any, any> | undefined;
  if ('configSchema' in options) {
    configSchema = options.configSchema;
  }
  if ('config' in options) {
    const newConfigSchema = options.config?.schema;
    configSchema =
      newConfigSchema &&
      createSchemaFromZod(innerZ =>
        innerZ.object(
          Object.fromEntries(
            Object.entries(newConfigSchema).map(([k, v]) => [k, v(innerZ)]),
          ),
        ),
      );
  }

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
    override: <
      TExtensionConfigSchema extends {
        [key in string]: (zImpl: typeof z) => z.ZodType;
      },
      UOverrideFactoryOutput extends ExtensionDataValue<any, any>,
      UNewOutput extends AnyExtensionDataRef,
      TExtraInputs extends {
        [inputName in string]: ExtensionInput<
          AnyExtensionDataRef,
          { optional: boolean; singleton: boolean }
        >;
      },
    >(overrideOptions: {
      attachTo?: { id: string; input: string };
      disabled?: boolean;
      inputs?: TExtraInputs;
      output?: Array<UNewOutput>;
      config?: {
        schema: TExtensionConfigSchema;
      };
      factory(
        originalFactory: (context?: {
          config?: {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
          };
          inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
        }) => ExtensionDataContainer<UOutput>,
        context: {
          node: AppNode;
          config: {
            [key in keyof TExtensionConfigSchema]: z.infer<
              ReturnType<TExtensionConfigSchema[key]>
            >;
          } & {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
          };
          inputs: Expand<ResolvedExtensionInputs<TInputs & TExtraInputs>>;
        },
      ): Iterable<UOverrideFactoryOutput>;
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
      >,
      AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput,
      TInputs & TExtraInputs
    > => {
      if (!Array.isArray(options.output)) {
        throw new Error(
          'Cannot override an extension that is not declared using the new format with outputs as an array',
        );
      }
      const newOptions = options as CreateExtensionOptions<
        UOutput,
        TInputs,
        TConfigSchema,
        UFactoryOutput
      >;
      const overrideNewConfigSchema = overrideOptions.config?.schema;

      const schema = {
        ...newOptions.config?.schema,
        ...overrideNewConfigSchema,
      } as TConfigSchema & TExtensionConfigSchema;

      return createExtension({
        kind: newOptions.kind,
        namespace: newOptions.namespace,
        name: newOptions.name,
        attachTo: overrideOptions.attachTo ?? newOptions.attachTo,
        disabled: overrideOptions.disabled ?? newOptions.disabled,
        inputs: { ...overrideOptions.inputs, ...newOptions.inputs },
        output: overrideOptions.output ?? newOptions.output,
        config: Object.keys(schema).length === 0 ? undefined : { schema },
        factory: ({ node, config, inputs }) => {
          if (!overrideOptions.factory) {
            return newOptions.factory({
              node,
              config,
              inputs: inputs as unknown as Expand<
                ResolvedExtensionInputs<TInputs>
              >,
            });
          }
          const parentResult = overrideOptions.factory(
            (innerContext?: {
              config?: {
                [key in keyof TConfigSchema]: z.infer<
                  ReturnType<TConfigSchema[key]>
                >;
              };
              inputs?: Expand<ResolvedExtensionInputs<TInputs>>;
            }): ExtensionDataContainer<UOutput> => {
              return createDataContainer<UOutput>(
                newOptions.factory({
                  node,
                  config: innerContext?.config ?? config,
                  inputs: (innerContext?.inputs ?? inputs) as any, // TODO: Fix the way input values are overridden
                }) as Iterable<any>,
              );
            },
            {
              node,
              config,
              inputs,
            },
          );

          const deduplicatedResult = new Map<string, UOverrideFactoryOutput>();
          for (const item of parentResult) {
            deduplicatedResult.set(item.id, item);
          }

          return deduplicatedResult.values() as Iterable<UOverrideFactoryOutput>;
        },
      } as CreateExtensionOptions<AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput, TInputs & TExtraInputs, TConfigSchema & TExtensionConfigSchema, UOverrideFactoryOutput>);
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
