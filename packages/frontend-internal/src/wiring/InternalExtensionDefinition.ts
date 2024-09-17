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

import {
  AnyExtensionDataRef,
  ApiHolder,
  AppNode,
  ExtensionDataValue,
  ExtensionDefinition,
  ExtensionDefinitionParameters,
  ExtensionInput,
  PortableSchema,
  ResolvedExtensionInputs,
} from '@backstage/frontend-plugin-api';

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
