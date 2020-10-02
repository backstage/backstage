/*
 * Copyright 2020 Spotify AB
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

import { EntityName, EntityRef } from '../types';
import { ENTITY_DEFAULT_NAMESPACE } from './constants';
import { Entity } from './Entity';

/**
 * Extracts the kind, namespace and name that form the name triplet of the
 * given entity.
 *
 * @param entity An entity
 * @returns The complete entity name
 */
export function getEntityName(entity: Entity): EntityName {
  return {
    kind: entity.kind,
    namespace: entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE,
    name: entity.metadata.name,
  };
}

/**
 * The context of defaults that entity reference parsing happens within.
 */
type EntityRefContext = {
  /** The default kind, if none is given in the reference */
  defaultKind?: string;
  /** The default namespace, if none is given in the reference */
  defaultNamespace?: string;
};

/**
 * Parses an entity reference, either on string or compound form, and always
 * returns a complete entity name including kind, namespace and name.
 *
 * This function automatically assumes the default namespace "default" unless
 * otherwise specified as part of the options, and will throw an error if no
 * kind was specified in the input reference and no default kind was given.
 *
 * @param ref The reference to parse
 * @param context The context of defaults that the parsing happens within
 * @returns A complete entity name
 */
export function parseEntityName(
  ref: EntityRef,
  context: EntityRefContext = {},
): EntityName {
  const { kind, namespace, name } = parseEntityRef(ref, {
    defaultNamespace: ENTITY_DEFAULT_NAMESPACE,
    ...context,
  });

  if (!kind) {
    throw new Error(
      `Entity reference ${namespace}/${name} did not contain a kind`,
    );
  }

  return { kind, namespace, name };
}

/**
 * Parses an entity reference, either on string or compound form, and returns
 * a structure with a name, and optional kind and namespace.
 *
 * The options object can contain default values for the kind and namespace,
 * that will be used if the input reference did not specify any.
 *
 * @param ref The reference to parse
 * @param context The context of defaults that the parsing happens within
 * @returns The compound form of the reference
 */
export function parseEntityRef(
  ref: EntityRef,
  context?: { defaultKind: string },
): {
  kind: string;
  namespace?: string;
  name: string;
};
export function parseEntityRef(
  ref: EntityRef,
  context?: { defaultNamespace: string },
): {
  kind?: string;
  namespace: string;
  name: string;
};
export function parseEntityRef(
  ref: EntityRef,
  context?: { defaultKind: string; defaultNamespace: string },
): {
  kind: string;
  namespace: string;
  name: string;
};
export function parseEntityRef(
  ref: EntityRef,
  context: EntityRefContext = {},
): {
  kind?: string;
  namespace?: string;
  name: string;
} {
  if (!ref) {
    throw new Error(`Entity reference must not be empty`);
  }

  if (typeof ref === 'string') {
    const match = /^([^:/]+:)?([^:/]+\/)?([^:/]+)$/.exec(ref.trim());
    if (!match) {
      throw new Error(
        `Entity reference "${ref}" was not on the form [<kind>:][<namespace>/]<name>`,
      );
    }

    return {
      kind: match[1]?.slice(0, -1) ?? context.defaultKind,
      namespace: match[2]?.slice(0, -1) ?? context.defaultNamespace,
      name: match[3],
    };
  }

  const { kind, namespace, name } = ref;
  if (kind === '') {
    throw new Error('Entity reference kinds must not be empty');
  } else if (namespace === '') {
    throw new Error('Entity reference namespaces must not be empty');
  } else if (!name) {
    throw new Error('Entity references must contain a name');
  }

  return {
    kind: kind ?? context.defaultKind,
    namespace: namespace ?? context.defaultNamespace,
    name,
  };
}

/**
 * Takes an entity reference or name, and outputs an entity reference on the
 * most compact form possible. I.e. if the parts do not contain any
 * special/reserved characters, it outputs the string form, otherwise it
 * outputs the compound form.
 *
 * @param ref The reference to serialize
 * @returns The same reference on either string or compound form
 */
export function serializeEntityRef(
  ref:
    | Entity
    | {
        kind?: string;
        namespace?: string;
        name: string;
      },
): EntityRef {
  let kind;
  let namespace;
  let name;

  if ('apiVersion' in ref) {
    kind = ref.kind;
    namespace = ref.metadata.namespace;
    name = ref.metadata.name;
  } else {
    kind = ref.kind;
    namespace = ref.namespace;
    name = ref.name;
  }

  if (
    kind?.includes(':') ||
    kind?.includes('/') ||
    namespace?.includes(':') ||
    namespace?.includes('/') ||
    name.includes(':') ||
    name.includes('/')
  ) {
    return { kind, namespace, name };
  }

  return `${kind ? `${kind}:` : ''}${namespace ? `${namespace}/` : ''}${name}`;
}
