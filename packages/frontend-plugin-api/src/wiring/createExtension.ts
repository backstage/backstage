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
import { ExtensionDataRef } from './createExtensionDataRef';
import { ExtensionInput } from './createExtensionInput';

/** @public */
export type AnyExtensionDataMap = {
  [name in string]: ExtensionDataRef<unknown, { optional?: true }>;
};

/** @public */
export type AnyExtensionInputMap = {
  [inputName in string]: ExtensionInput<
    AnyExtensionDataMap,
    { optional: boolean; singleton: boolean }
  >;
};

/**
 * Converts an extension data map into the matching concrete data values type.
 * @public
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

/**
 * Convert a single extension input into a matching resolved input.
 * @public
 */
export type ResolvedExtensionInput<TExtensionData extends AnyExtensionDataMap> =
  {
    node: AppNode;
    output: ExtensionDataValues<TExtensionData>;
  };

/**
 * Converts an extension input map into a matching collection of resolved inputs.
 * @public
 */
export type ResolvedExtensionInputs<
  TInputs extends { [name in string]: ExtensionInput<any, any> },
> = {
  [InputName in keyof TInputs]: false extends TInputs[InputName]['config']['singleton']
    ? Array<Expand<ResolvedExtensionInput<TInputs[InputName]['extensionData']>>>
    : false extends TInputs[InputName]['config']['optional']
      ? Expand<ResolvedExtensionInput<TInputs[InputName]['extensionData']>>
      : Expand<
          | ResolvedExtensionInput<TInputs[InputName]['extensionData']>
          | undefined
        >;
};

/** @public */
export interface CreateExtensionOptions<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig,
> {
  kind?: string;
  namespace?: string;
  name?: string;
  attachTo: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  output: TOutput;
  configSchema?: PortableSchema<TConfig>;
  factory(options: {
    node: AppNode;
    config: TConfig;
    inputs: Expand<ResolvedExtensionInputs<TInputs>>;
  }): Expand<ExtensionDataValues<TOutput>>;
}

/** @public */
export interface ExtensionDefinition<TConfig> {
  $$type: '@backstage/ExtensionDefinition';
  readonly kind?: string;
  readonly namespace?: string;
  readonly name?: string;
  readonly attachTo: { id: string; input: string };
  readonly disabled: boolean;
  readonly configSchema?: PortableSchema<TConfig>;
}

/** @internal */
export interface InternalExtensionDefinition<TConfig>
  extends ExtensionDefinition<TConfig> {
  readonly version: 'v1';
  readonly inputs: AnyExtensionInputMap;
  readonly output: AnyExtensionDataMap;
  factory(options: {
    node: AppNode;
    config: TConfig;
    inputs: ResolvedExtensionInputs<any>;
  }): ExtensionDataValues<any>;
}

/** @internal */
export function toInternalExtensionDefinition<TConfig>(
  overrides: ExtensionDefinition<TConfig>,
): InternalExtensionDefinition<TConfig> {
  const internal = overrides as InternalExtensionDefinition<TConfig>;
  if (internal.$$type !== '@backstage/ExtensionDefinition') {
    throw new Error(
      `Invalid extension definition instance, bad type '${internal.$$type}'`,
    );
  }
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid extension definition instance, bad version '${internal.version}'`,
    );
  }
  return internal;
}

/** @public */
export function createExtension<
  TOutput extends AnyExtensionDataMap,
  TInputs extends AnyExtensionInputMap,
  TConfig = never,
>(
  options: CreateExtensionOptions<TOutput, TInputs, TConfig>,
): ExtensionDefinition<TConfig> {
  return {
    $$type: '@backstage/ExtensionDefinition',
    version: 'v1',
    kind: options.kind,
    namespace: options.namespace,
    name: options.name,
    attachTo: options.attachTo,
    disabled: options.disabled ?? false,
    inputs: options.inputs ?? {},
    output: options.output,
    configSchema: options.configSchema,
    factory({ inputs, ...rest }) {
      // TODO: Simplify this, but TS wouldn't infer the input type for some reason
      return options.factory({
        inputs: inputs as Expand<ResolvedExtensionInputs<TInputs>>,
        ...rest,
      });
    },
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
  } as InternalExtensionDefinition<TConfig>;
}
