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

import { ApiHolder, AppNode } from '../apis';
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
    apis: ApiHolder;
    config: {
      [key in keyof TConfigSchema]: z.infer<ReturnType<TConfigSchema[key]>>;
    };
    inputs: Expand<ResolvedExtensionInputs<TInputs>>;
  }): Iterable<UFactoryOutput>;
} & VerifyExtensionFactoryOutput<UOutput, UFactoryOutput>;

/** @public */
export type ExtensionDefinitionParameters = {
  kind?: string;
  namespace?: string;
  name?: string;
  configInput?: { [K in string]: any };
  config?: { [K in string]: any };
  output?: AnyExtensionDataRef;
  inputs?: {
    [KName in string]: ExtensionInput<
      AnyExtensionDataRef,
      { optional: boolean; singleton: boolean }
    >;
  };
};

/** @public */
export type ExtensionDefinition<
  T extends ExtensionDefinitionParameters = ExtensionDefinitionParameters,
> = {
  $$type: '@backstage/ExtensionDefinition';
  readonly T: T;

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
        originalFactory: (context?: {
          config?: T['config'];
          inputs?: ResolveInputValueOverrides<NonNullable<T['inputs']>>;
        }) => ExtensionDataContainer<NonNullable<T['output']>>,
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
      ): Iterable<UFactoryOutput>;
    } & VerifyExtensionFactoryOutput<
      AnyExtensionDataRef extends UNewOutput
        ? NonNullable<T['output']>
        : UNewOutput,
      UFactoryOutput
    >,
  ): ExtensionDefinition<{
    kind: T['kind'];
    namespace: T['namespace'];
    name: T['name'];
    output: AnyExtensionDataRef extends UNewOutput ? T['output'] : UNewOutput;
    inputs: T['inputs'] & TExtraInputs;
    config: T['config'] & {
      [key in keyof TExtensionConfigSchema]: z.infer<
        ReturnType<TExtensionConfigSchema[key]>
      >;
    };
    configInput: T['configInput'] &
      z.input<
        z.ZodObject<{
          [key in keyof TExtensionConfigSchema]: ReturnType<
            TExtensionConfigSchema[key]
          >;
        }>
      >;
  }>;
};

/** @internal */
export type InternalExtensionDefinition<
  T extends ExtensionDefinitionParameters = ExtensionDefinitionParameters,
> = ExtensionDefinition<T> & {
  readonly kind?: string;
  readonly namespace?: string;
  readonly name?: string;
  readonly attachTo: { id: string; input: string };
  readonly disabled: boolean;
  readonly configSchema?: PortableSchema<T['config'], T['configInput']>;
} & (
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
          apis: ApiHolder;
          config: object;
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
          apis: ApiHolder;
          config: object;
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
export function toInternalExtensionDefinition<
  T extends ExtensionDefinitionParameters,
>(overrides: ExtensionDefinition<T>): InternalExtensionDefinition<T> {
  const internal = overrides as InternalExtensionDefinition<T>;
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
): ExtensionDefinition<{
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
  output: UOutput;
  inputs: TInputs;
  kind: string | undefined extends TKind ? undefined : TKind;
  namespace: string | undefined extends TNamespace ? undefined : TNamespace;
  name: string | undefined extends TName ? undefined : TName;
}> {
  type T = {
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
    output: UOutput;
    inputs: TInputs;
    kind: string | undefined extends TKind ? undefined : TKind;
    namespace: string | undefined extends TNamespace ? undefined : TNamespace;
    name: string | undefined extends TName ? undefined : TName;
  };

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
    T: null as unknown as T,
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
    override(overrideOptions) {
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

      return createExtension({
        kind: newOptions.kind,
        namespace: newOptions.namespace,
        name: newOptions.name,
        attachTo: overrideOptions.attachTo ?? newOptions.attachTo,
        disabled: overrideOptions.disabled ?? newOptions.disabled,
        inputs: { ...overrideOptions.inputs, ...newOptions.inputs },
        output: (overrideOptions.output ??
          newOptions.output) as AnyExtensionDataRef[],
        config:
          newOptions.config || overrideOptions.config
            ? {
                schema: {
                  ...newOptions.config?.schema,
                  ...overrideOptions.config?.schema,
                },
              }
            : undefined,
        factory: ({ node, apis, config, inputs }) => {
          if (!overrideOptions.factory) {
            return newOptions.factory({
              node,
              apis,
              config: config as any,
              inputs: inputs as any,
            });
          }
          const parentResult = overrideOptions.factory(
            (innerContext): ExtensionDataContainer<UOutput> => {
              return createExtensionDataContainer<UOutput>(
                newOptions.factory({
                  node,
                  apis,
                  config: (innerContext?.config ?? config) as any,
                  inputs: resolveInputOverrides(
                    newOptions.inputs,
                    inputs,
                    innerContext?.inputs,
                  ) as any,
                }) as Iterable<any>,
                newOptions.output,
              );
            },
            {
              node,
              apis,
              config: config as any,
              inputs: inputs as any,
            },
          );

          const deduplicatedResult = new Map<
            string,
            ExtensionDataValue<any, any>
          >();
          for (const item of parentResult) {
            deduplicatedResult.set(item.id, item);
          }

          return deduplicatedResult.values();
        },
      }) as ExtensionDefinition<any>;
    },
  } as InternalExtensionDefinition<T>;
}
