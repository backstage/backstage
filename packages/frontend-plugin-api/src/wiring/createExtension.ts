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
import { Expand } from '@backstage/types';
import {
  ResolvedInputValueOverrides,
  resolveInputOverrides,
} from './resolveInputOverrides';
import {
  createExtensionDataContainer,
  OpaqueExtensionInput,
} from '@internal/frontend';
import { ExtensionDataRef, ExtensionDataValue } from './createExtensionDataRef';
import { ExtensionInput } from './createExtensionInput';
import type { z } from 'zod';
import { createSchemaFromZod } from '../schema/createSchemaFromZod';
import { OpaqueExtensionDefinition } from '@internal/frontend';
import { ExtensionDataContainer } from './types';
import {
  ExtensionBlueprint,
  ExtensionBlueprintDefineParams,
} from './createExtensionBlueprint';
import { FrontendPlugin } from './createFrontendPlugin';
import { FrontendModule } from './createFrontendModule';

/**
 * This symbol is used to pass parameter overrides from the extension override to the blueprint factory
 * @internal
 */
export const ctxParamsSymbol = Symbol('params');

/**
 * Convert a single extension input into a matching resolved input.
 * @public
 */
export type ResolvedExtensionInput<TExtensionInput extends ExtensionInput> =
  TExtensionInput['extensionData'] extends Array<ExtensionDataRef>
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
    [name in string]: ExtensionInput;
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
export type RequiredExtensionIds<UExtensionData extends ExtensionDataRef> =
  UExtensionData extends any
    ? UExtensionData['config']['optional'] extends true
      ? never
      : UExtensionData['id']
    : never;

/** @ignore */
export type VerifyExtensionFactoryOutput<
  UDeclaredOutput extends ExtensionDataRef,
  UFactoryOutput extends ExtensionDataValue<any, any>,
> = [RequiredExtensionIds<UDeclaredOutput>] extends [UFactoryOutput['id']]
  ? [UFactoryOutput['id']] extends [UDeclaredOutput['id']]
    ? {}
    : `Error: The extension factory has undeclared output(s): ${JoinStringUnion<
        Exclude<UFactoryOutput['id'], UDeclaredOutput['id']>
      >}`
  : `Error: The extension factory is missing the following output(s): ${JoinStringUnion<
      Exclude<RequiredExtensionIds<UDeclaredOutput>, UFactoryOutput['id']>
    >}`;

/** @ignore */
export type VerifyExtensionAttachTo<
  UOutput extends ExtensionDataRef,
  UParentInput extends ExtensionDataRef,
> = ExtensionDataRef extends UParentInput
  ? {}
  : [RequiredExtensionIds<UParentInput>] extends [RequiredExtensionIds<UOutput>]
  ? {}
  : `Error: This parent extension input requires the following extension data, but it is not declared as guaranteed output of this extension: ${JoinStringUnion<
      Exclude<RequiredExtensionIds<UParentInput>, RequiredExtensionIds<UOutput>>
    >}`;

/**
 * Specifies where an extension should attach in the extension tree.
 *
 * @remarks
 *
 * A standard attachment point declaration will specify the ID of the parent extension, as well as the name of the input to attach to.
 *
 * There are two more advanced forms that are available for more complex use-cases:
 *
 * 1. Relative attachment points: using the `relative` property instead of `id`, the attachment point is resolved relative to the current plugin.
 * 2. Extension input references: using a reference in code to another extension's input in the same plugin. These references are always relative.
 *
 * @example
 * ```ts
 * // Attach to a specific extension by full ID
 * { id: 'app/routes', input: 'routes' }
 *
 * // Attach to an extension in the same plugin by kind
 * { relative: { kind: 'page' }, input: 'actions' }
 *
 * // Attach to a specific input of another extension
 * const page = ParentBlueprint.make({ ... });
 * const child = ChildBlueprint.make({ attachTo: page.inputs.children });
 * ```
 *
 * @public
 */
export type ExtensionDefinitionAttachTo<
  UParentInputs extends ExtensionDataRef = ExtensionDataRef,
> =
  | { id: string; input: string; relative?: never }
  | { relative: { kind?: string; name?: string }; input: string; id?: never }
  | ExtensionInput<UParentInputs>;

/** @public */
export type CreateExtensionOptions<
  TKind extends string | undefined,
  TName extends string | undefined,
  UOutput extends ExtensionDataRef,
  TInputs extends { [inputName in string]: ExtensionInput },
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
  UParentInputs extends ExtensionDataRef,
> = {
  kind?: TKind;
  name?: TName;
  attachTo: ExtensionDefinitionAttachTo<UParentInputs> &
    VerifyExtensionAttachTo<UOutput, UParentInputs>;
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
  name?: string;
  configInput?: { [K in string]: any };
  config?: { [K in string]: any };
  output?: ExtensionDataRef;
  inputs?: { [KName in string]: ExtensionInput };
  params?: object | ExtensionBlueprintDefineParams;
};

/**
 * Same as the one in `createExtensionBlueprint`, but with `ParamsFactory` inlined.
 * It can't be exported because it breaks API reports.
 * @ignore
 */
type AnyParamsInput<TParams extends object | ExtensionBlueprintDefineParams> =
  TParams extends ExtensionBlueprintDefineParams<infer IParams>
    ? IParams | ((define: TParams) => ReturnType<TParams>)
    :
        | TParams
        | ((
            define: ExtensionBlueprintDefineParams<TParams, TParams>,
          ) => ReturnType<ExtensionBlueprintDefineParams<TParams, TParams>>);

/** @public */
export interface ExtensionDefinition<
  TParams extends ExtensionDefinitionParameters = ExtensionDefinitionParameters,
> {
  $$type: '@backstage/ExtensionDefinition';
  readonly T: TParams;
}

/** @public */
export interface OverridableExtensionDefinition<
  T extends ExtensionDefinitionParameters = ExtensionDefinitionParameters,
> extends ExtensionDefinition<T> {
  /**
   * References to the inputs of this extension, which can be used to attach child extensions.
   */
  readonly inputs: {
    [K in keyof T['inputs']]: ExtensionInput<
      T['inputs'][K] extends ExtensionInput<infer IData> ? IData : never
    >;
  };

  override<
    TExtensionConfigSchema extends {
      [key in string]: (zImpl: typeof z) => z.ZodType;
    },
    UFactoryOutput extends ExtensionDataValue<any, any>,
    UNewOutput extends ExtensionDataRef,
    TExtraInputs extends { [inputName in string]: ExtensionInput },
    TParamsInput extends AnyParamsInput<NonNullable<T['params']>>,
    UParentInputs extends ExtensionDataRef,
  >(
    args: Expand<
      {
        attachTo?: ExtensionDefinitionAttachTo<UParentInputs> &
          VerifyExtensionAttachTo<
            ExtensionDataRef extends UNewOutput
              ? NonNullable<T['output']>
              : UNewOutput,
            UParentInputs
          >;
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
        factory?(
          originalFactory: <
            TFactoryParamsReturn extends AnyParamsInput<
              NonNullable<T['params']>
            >,
          >(
            context?: Expand<
              {
                config?: T['config'];
                inputs?: ResolvedInputValueOverrides<NonNullable<T['inputs']>>;
              } & ([T['params']] extends [never]
                ? {}
                : {
                    params?: TFactoryParamsReturn extends ExtensionBlueprintDefineParams
                      ? TFactoryParamsReturn
                      : T['params'] extends ExtensionBlueprintDefineParams
                      ? 'Error: This blueprint uses advanced parameter types and requires you to pass parameters as using the following callback syntax: `originalFactory(defineParams => defineParams(<params>))`'
                      : Partial<T['params']>;
                  })
            >,
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
        ): Iterable<UFactoryOutput>;
      } & ([T['params']] extends [never]
        ? {}
        : {
            params?: TParamsInput extends ExtensionBlueprintDefineParams
              ? TParamsInput
              : T['params'] extends ExtensionBlueprintDefineParams
              ? 'Error: This blueprint uses advanced parameter types and requires you to pass parameters as using the following callback syntax: `originalFactory(defineParams => defineParams(<params>))`'
              : Partial<T['params']>;
          })
    > &
      VerifyExtensionFactoryOutput<
        ExtensionDataRef extends UNewOutput
          ? NonNullable<T['output']>
          : UNewOutput,
        UFactoryOutput
      >,
  ): OverridableExtensionDefinition<{
    kind: T['kind'];
    name: T['name'];
    output: ExtensionDataRef extends UNewOutput ? T['output'] : UNewOutput;
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
}

/**
 * @internal
 */
function bindInputs(
  inputs: { [inputName in string]: ExtensionInput } | undefined,
  kind?: string,
  name?: string,
) {
  if (!inputs) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(inputs).map(([inputName, input]) => [
      inputName,
      OpaqueExtensionInput.toInternal(input).withContext?.({
        kind,
        name,
        input: inputName,
      }) ?? input,
    ]),
  );
}

/**
 * Creates a new extension definition for installation in a Backstage app.
 *
 * @remarks
 *
 * This is a low-level function for creation of extensions with arbitrary inputs
 * and outputs and is typically only intended to be used for advanced overrides
 * or framework-level extensions. For most extension creation needs, it is
 * recommended to use existing {@link ExtensionBlueprint}s instead. You can find
 * blueprints both in the `@backstage/frontend-plugin-api` package as well as
 * other plugin libraries. There is also a list of
 * {@link https://backstage.io/docs/frontend-system/building-plugins/common-extension-blueprints | commonly used blueprints}
 * in the frontend system documentation.
 *
 * Extension definitions that are created with this function can be installed in
 * a Backstage app via a {@link FrontendPlugin} or {@link FrontendModule}.
 *
 * For more details on how extensions work, see the
 * {@link https://backstage.io/docs/frontend-system/architecture/extensions | documentation for extensions}.
 *
 * @example
 *
 * ```ts
 * const myExtension = createExtension({
 *   name: 'example',
 *   attachTo: { id: 'app', input: 'root' },
 *   output: [coreExtensionData.reactElement],
 *   factory() {
 *     return [coreExtensionData.reactElement(<h1>Hello, world!</h1>)];
 *   },
 * });
 * ```
 *
 * @public
 */
export function createExtension<
  UOutput extends ExtensionDataRef,
  TInputs extends { [inputName in string]: ExtensionInput },
  TConfigSchema extends { [key: string]: (zImpl: typeof z) => z.ZodType },
  UFactoryOutput extends ExtensionDataValue<any, any>,
  const TKind extends string | undefined = undefined,
  const TName extends string | undefined = undefined,
  UParentInputs extends ExtensionDataRef = ExtensionDataRef,
>(
  options: CreateExtensionOptions<
    TKind,
    TName,
    UOutput,
    TInputs,
    TConfigSchema,
    UFactoryOutput,
    UParentInputs
  >,
): OverridableExtensionDefinition<{
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
  // This inference and remapping back to ExtensionDataRef eliminates any occurrences ConfigurationExtensionDataRef
  output: UOutput extends ExtensionDataRef<
    infer IData,
    infer IId,
    infer IConfig
  >
    ? ExtensionDataRef<IData, IId, IConfig>
    : never;
  inputs: TInputs;
  params: never;
  kind: string | undefined extends TKind ? undefined : TKind;
  name: string | undefined extends TName ? undefined : TName;
}> {
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

  return OpaqueExtensionDefinition.createInstance('v2', {
    T: undefined as unknown as {
      config: string extends keyof TConfigSchema
        ? {}
        : {
            [key in keyof TConfigSchema]: z.infer<
              ReturnType<TConfigSchema[key]>
            >;
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
      name: string | undefined extends TName ? undefined : TName;
    },
    kind: options.kind,
    name: options.name,
    attachTo: options.attachTo,
    disabled: options.disabled ?? false,
    inputs: bindInputs(options.inputs, options.kind, options.name),
    output: options.output,
    configSchema,
    factory: options.factory,
    toString() {
      const parts: string[] = [];
      if (options.kind) {
        parts.push(`kind=${options.kind}`);
      }
      if (options.name) {
        parts.push(`name=${options.name}`);
      }
      const attachTo = [options.attachTo]
        .flat()
        .map(aAny => {
          const a = aAny as ExtensionDefinitionAttachTo;
          if (OpaqueExtensionInput.isType(a)) {
            const { context } = OpaqueExtensionInput.toInternal(a);
            if (!context) {
              return '<detached-input>';
            }
            let id = '<plugin>';
            if (context?.kind) {
              id = `${context?.kind}:${id}`;
            }
            if (context?.name) {
              id = `${id}/${context?.name}`;
            }
            return `${id}@${context.input}`;
          }
          if ('relative' in a && a.relative) {
            let id = '<plugin>';
            if (a.relative.kind) {
              id = `${a.relative.kind}:${id}`;
            }
            if (a.relative.name) {
              id = `${id}/${a.relative.name}`;
            }
            return `${id}@${a.input}`;
          }
          if ('id' in a) {
            return `${a.id}@${a.input}`;
          }
          throw new Error('Invalid attachment point specification');
        })
        .join('+');
      parts.push(`attachTo=${attachTo}`);
      return `ExtensionDefinition{${parts.join(',')}}`;
    },
    override(overrideOptions) {
      if (!Array.isArray(options.output)) {
        throw new Error(
          'Cannot override an extension that is not declared using the new format with outputs as an array',
        );
      }

      // TODO(Rugvip): Making this a type check would be optimal, but it seems
      //               like it's tricky to add that and still have the type
      //               inference work correctly for the factory output.
      if (overrideOptions.output && !overrideOptions.factory) {
        throw new Error(
          'Refused to override output without also overriding factory',
        );
      }
      // TODO(Rugvip): Similar to above, would be nice to error during type checking, but don't want to complicate the types too much
      if (overrideOptions.params && overrideOptions.factory) {
        throw new Error(
          'Refused to override params and factory at the same time',
        );
      }

      return createExtension({
        kind: options.kind,
        name: options.name,
        attachTo: (overrideOptions.attachTo ??
          options.attachTo) as ExtensionDefinitionAttachTo,
        disabled: overrideOptions.disabled ?? options.disabled,
        inputs: bindInputs(
          {
            ...(options.inputs ?? {}),
            ...(overrideOptions.inputs ?? {}),
          },
          options.kind,
          options.name,
        ),
        output: (overrideOptions.output ??
          options.output) as ExtensionDataRef[],
        config:
          options.config || overrideOptions.config
            ? {
                schema: {
                  ...options.config?.schema,
                  ...overrideOptions.config?.schema,
                },
              }
            : undefined,
        factory: ({ node, apis, config, inputs }) => {
          if (!overrideOptions.factory) {
            return options.factory({
              node,
              apis,
              config: config as any,
              inputs: inputs as any,
              [ctxParamsSymbol as any]: overrideOptions.params,
            });
          }
          const parentResult = overrideOptions.factory(
            (innerContext): ExtensionDataContainer<UOutput> => {
              return createExtensionDataContainer<UOutput>(
                options.factory({
                  node,
                  apis,
                  config: (innerContext?.config ?? config) as any,
                  inputs: resolveInputOverrides(
                    options.inputs,
                    inputs,
                    innerContext?.inputs,
                  ) as any,
                  [ctxParamsSymbol as any]: innerContext?.params,
                }) as Iterable<any>,
                'original extension factory',
                options.output,
              );
            },
            {
              node,
              apis,
              config: config as any,
              inputs: inputs as any,
            },
          );

          if (
            typeof parentResult !== 'object' ||
            !parentResult?.[Symbol.iterator]
          ) {
            throw new Error(
              'extension factory override did not provide an iterable object',
            );
          }

          const deduplicatedResult = new Map<
            string,
            ExtensionDataValue<any, any>
          >();
          for (const item of parentResult) {
            deduplicatedResult.set(item.id, item);
          }

          return deduplicatedResult.values();
        },
      }) as OverridableExtensionDefinition<any>;
    },
  });
}
