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
import { PortableSchema } from '../schema';
import { Expand } from '../types';
import {
  ResolveInputValueOverrides,
  resolveInputOverrides,
} from './resolveInputOverrides';
import {
  ExtensionDataContainer,
  createExtensionDataContainer,
} from './createExtensionDataContainer';
import {
  AnyExtensionDataRef,
  ExtensionDataValue,
} from './createExtensionDataRef';
import { ExtensionInput } from './createExtensionInput';
import { z } from 'zod';
import { createSchemaFromZod } from '../schema/createSchemaFromZod';

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
  : never;

/**
 * Converts an extension input map into a matching collection of resolved inputs.
 * @public
 */
export type ResolvedExtensionInputs<
  TInputs extends {
    [name in string]: ExtensionInput<any, any>;
  },
> = {
  [InputName in keyof TInputs]: false extends TInputs[InputName]['config']['singleton']
    ? Array<Expand<ResolvedExtensionInput<TInputs[InputName]>>>
    : false extends TInputs[InputName]['config']['optional']
    ? Expand<ResolvedExtensionInput<TInputs[InputName]>>
    : Expand<ResolvedExtensionInput<TInputs[InputName]> | undefined>;
};

type ToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type PopUnion<U> = ToIntersection<
  U extends any ? () => U : never
> extends () => infer R
  ? [rest: Exclude<U, R>, next: R]
  : undefined;

/** @ignore */
type JoinStringUnion<
  U,
  TDiv extends string = ', ',
  TResult extends string = '',
> = PopUnion<U> extends [infer IRest extends string, infer INext extends string]
  ? TResult extends ''
    ? JoinStringUnion<IRest, TDiv, INext>
    : JoinStringUnion<IRest, TDiv, `${TResult}${TDiv}${INext}`>
  : TResult;

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
      : `Error: The extension factory has undeclared output(s): ${JoinStringUnion<
          Exclude<UFactoryOutput['id'], UDeclaredOutput['id']>
        >}`
    : `Error: The extension factory is missing the following output(s): ${JoinStringUnion<
        Exclude<IRequiredOutputIds, UFactoryOutput['id']>
      >}`
  : never;

/** @public */
export type CreateExtensionOptions<
  TKind extends string | undefined,
  TNamespace extends string | undefined,
  TName extends string | undefined,
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
  kind?: TKind;
  namespace?: TNamespace;
  name?: TName;
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
  TIdParts extends {
    kind?: string;
    namespace?: string;
    name?: string;
  } = {
    kind?: string;
    namespace?: string;
    name?: string;
  },
> {
  $$type: '@backstage/ExtensionDefinition';
  readonly kind?: TIdParts['kind'];
  readonly namespace?: TIdParts['namespace'];
  readonly name?: TIdParts['name'];
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
          inputs?: ResolveInputValueOverrides<TInputs>;
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
    TInputs & TExtraInputs,
    TIdParts
  >;
}

/** @internal */
export type InternalExtensionDefinition<
  TConfig,
  TConfigInput = TConfig,
  UOutput extends AnyExtensionDataRef = AnyExtensionDataRef,
  TInputs extends {
    [inputName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  } = {},
  TIdParts extends {
    kind?: string;
    namespace?: string;
    name?: string;
  } = {
    kind?: string;
    namespace?: string;
    name?: string;
  },
> = ExtensionDefinition<TConfig, TConfigInput, UOutput, TInputs, TIdParts> &
  (
    | {
        readonly version: 'v1';
        readonly inputs: {
          [inputName in string]: {
            $$type: '@backstage/ExtensionInput';
            extensionData: {
              [name in string]: AnyExtensionDataRef;
            };
            config: { optional: boolean; singleton: boolean };
          };
        };
        readonly output: {
          [name in string]: AnyExtensionDataRef;
        };
        factory(context: {
          node: AppNode;
          config: TConfig;
          inputs: {
            [inputName in string]: unknown;
          };
        }): {
          [inputName in string]: unknown;
        };
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
  const TKind extends string | undefined = undefined,
  const TNamespace extends string | undefined = undefined,
  const TName extends string | undefined = undefined,
>(
  options: CreateExtensionOptions<
    TKind,
    TNamespace,
    TName,
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
  TInputs,
  {
    kind: string | undefined extends TKind ? undefined : TKind;
    namespace: string | undefined extends TNamespace ? undefined : TNamespace;
    name: string | undefined extends TName ? undefined : TName;
  }
>;
export function createExtension<
  const TKind extends string | undefined,
  const TNamespace extends string | undefined,
  const TName extends string | undefined,
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
    TKind,
    TNamespace,
    TName,
    UOutput,
    TInputs,
    TConfigSchema,
    UFactoryOutput
  >,
): ExtensionDefinition<
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
  UOutput,
  TInputs,
  {
    kind: TKind;
    namespace: TNamespace;
    name: TName;
  }
> {
  const schemaDeclaration = options.config?.schema;
  const configSchema =
    schemaDeclaration &&
    createSchemaFromZod(innerZ =>
      innerZ.object(
        Object.fromEntries(
          Object.entries(schemaDeclaration).map(([k, v]) => [k, v(innerZ)]),
        ),
      ),
    );

  return {
    $$type: '@backstage/ExtensionDefinition',
    version: 'v2',
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
          inputs?: ResolveInputValueOverrides<TInputs>;
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
      TInputs & TExtraInputs,
      {
        kind: TKind;
        namespace: TNamespace;
        name: TName;
      }
    > => {
      if (!Array.isArray(options.output)) {
        throw new Error(
          'Cannot override an extension that is not declared using the new format with outputs as an array',
        );
      }
      const newOptions = options as CreateExtensionOptions<
        TKind,
        TNamespace,
        TName,
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
              inputs?: ResolveInputValueOverrides<TInputs>;
            }): ExtensionDataContainer<UOutput> => {
              return createExtensionDataContainer<UOutput>(
                newOptions.factory({
                  node,
                  config: innerContext?.config ?? config,
                  inputs: resolveInputOverrides(
                    newOptions.inputs,
                    inputs,
                    innerContext?.inputs,
                  ) as any, // TODO: Might be able to improve this once legacy inputs are gone
                }) as Iterable<any>,
                newOptions.output,
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
      } as CreateExtensionOptions<TKind, TNamespace, TName, AnyExtensionDataRef extends UNewOutput ? UOutput : UNewOutput, TInputs & TExtraInputs, TConfigSchema & TExtensionConfigSchema, UOverrideFactoryOutput>);
    },
  } as InternalExtensionDefinition<
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
    UOutput,
    TInputs,
    {
      kind: TKind;
      namespace: TNamespace;
      name: TName;
    }
  >;
}
