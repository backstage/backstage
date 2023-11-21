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

import { Extension, ExtensionDefinition } from './createExtension';

/** @internal */
export function resolveExtensionDefinition<TConfig>(
  definition: ExtensionDefinition<TConfig>,
  context?: { namespace?: string },
): Extension<TConfig> {
  const { name, kind, namespace: _, ...rest } = definition;
  const namespace = context?.namespace ?? definition.namespace;

  if (!namespace) {
    throw new Error(
      `Extension must declare an explicit namespace as it could not be resolved from context, name=${name} kind=${kind}`,
    );
  }

  let id;
  if (kind && name) {
    id = `${kind}:${namespace}/${name}`; // nav-item:catalog/index
  } else if (kind) {
    id = `${kind}:${namespace}`; // nav-item:search
  } else if (name) {
    id = `${namespace}/${name}`; // core/nav
  } else {
    id = namespace; // core
  }

  return { id, ...rest, $$type: '@backstage/Extension' };
}
