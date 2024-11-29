/*
 * Copyright 2020 The Backstage Authors
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
  Entity,
  CompoundEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';
import get from 'lodash/get';

/**
 * @param defaultNamespace - if set to false then namespace is never omitted,
 * if set to string which matches namespace of entity then omitted
 *
 * @public
 **/
export function humanizeEntityRef(
  entityRef: Entity | CompoundEntityRef,
  opts?: {
    defaultKind?: string;
    defaultNamespace?: string | false;
  },
) {
  const defaultKind = opts?.defaultKind;
  let kind;
  let namespace;
  let name;

  if ('metadata' in entityRef) {
    kind = entityRef.kind;
    namespace = entityRef.metadata.namespace;
    name = entityRef.metadata.name;
  } else {
    kind = entityRef.kind;
    namespace = entityRef.namespace;
    name = entityRef.name;
  }

  if (namespace === undefined || namespace === '') {
    namespace = DEFAULT_NAMESPACE;
  }
  if (opts?.defaultNamespace !== undefined) {
    if (opts?.defaultNamespace === namespace) {
      namespace = undefined;
    }
  } else if (namespace === DEFAULT_NAMESPACE) {
    namespace = undefined;
  }

  kind = kind.toLocaleLowerCase('en-US');
  kind =
    defaultKind && defaultKind.toLocaleLowerCase('en-US') === kind
      ? undefined
      : kind;
  return `${kind ? `${kind}:` : ''}${namespace ? `${namespace}/` : ''}${name}`;
}

/**
 * Convert an entity to its more readable name if available.
 *
 * If an entity is either User or Group, this will be its `spec.profile.displayName`.
 * Otherwise, this is `metadata.title`.
 *
 * If neither of those are found or populated, fallback to `defaultName`.
 *
 * @param entity - Entity to convert.
 * @param defaultName - If entity readable name is not available, `defaultName` will be returned.
 * @returns Readable name, defaults to `defaultName`.
 *
 */
export function humanizeEntity(entity: Entity, defaultName: string) {
  for (const path of ['spec.profile.displayName', 'metadata.title']) {
    const value = get(entity, path);
    if (value && typeof value === 'string') {
      return value;
    }
  }
  return defaultName;
}
