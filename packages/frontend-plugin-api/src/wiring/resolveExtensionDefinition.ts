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
import {
  AnyExtensionDataMap,
  AnyExtensionInputMap,
  ExtensionDataValues,
  ExtensionDefinition,
  ResolvedExtensionInputs,
  toInternalExtensionDefinition,
} from './createExtension';
import { PortableSchema } from '../schema';

/** @public */
export interface Extension<TConfig> {
  $$type: '@backstage/Extension';
  readonly id: string;
  readonly attachTo: { id: string; input: string };
  readonly disabled: boolean;
  readonly configSchema?: PortableSchema<TConfig>;
}

/** @internal */
export interface InternalExtension<TConfig> extends Extension<TConfig> {
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
export function toInternalExtension<TConfig>(
  overrides: Extension<TConfig>,
): InternalExtension<TConfig> {
  const internal = overrides as InternalExtension<TConfig>;
  if (internal.$$type !== '@backstage/Extension') {
    throw new Error(
      `Invalid extension instance, bad type '${internal.$$type}'`,
    );
  }
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid extension instance, bad version '${internal.version}'`,
    );
  }
  return internal;
}

/** @internal */
export function resolveExtensionDefinition<TConfig>(
  definition: ExtensionDefinition<TConfig>,
  context?: { namespace?: string },
): Extension<TConfig> {
  const internalDefinition = toInternalExtensionDefinition(definition);
  const { name, kind, namespace: _, ...rest } = internalDefinition;
  const namespace = internalDefinition.namespace ?? context?.namespace;

  const namePart =
    name && namespace ? `${namespace}/${name}` : namespace || name;
  if (!namePart) {
    throw new Error(
      `Extension must declare an explicit namespace or name as it could not be resolved from context, kind=${kind} namespace=${namespace} name=${name}`,
    );
  }

  const id = kind ? `${kind}:${namePart}` : namePart;

  return {
    ...rest,
    $$type: '@backstage/Extension',
    version: 'v1',
    id,
    toString() {
      return `Extension{id=${id}}`;
    },
  } as Extension<TConfig>;
}
