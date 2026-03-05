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

import { DEFAULT_NAMESPACE } from './constants';
import { CompoundEntityRef } from '../types';
import { Entity } from './Entity';

function parseRefString(ref: string): {
  kind?: string;
  namespace?: string;
  name: string;
} {
  let colonI = ref.indexOf(':');
  const slashI = ref.indexOf('/');

  // If the / is ahead of the :, treat the rest as the name
  if (slashI !== -1 && slashI < colonI) {
    colonI = -1;
  }

  const kind = colonI === -1 ? undefined : ref.slice(0, colonI);
  const namespace = slashI === -1 ? undefined : ref.slice(colonI + 1, slashI);
  const name = ref.slice(Math.max(colonI + 1, slashI + 1));

  if (kind === '' || namespace === '' || name === '') {
    throw new TypeError(
      `Entity reference "${ref}" was not on the form [<kind>:][<namespace>/]<name>`,
    );
  }

  return { kind, namespace, name };
}

/**
 * Extracts the kind, namespace and name that form the compound entity ref
 * triplet of the given entity.
 *
 * @public
 * @param entity - An entity
 * @returns The compound entity ref
 */
export function getCompoundEntityRef(entity: Entity): CompoundEntityRef {
  return {
    kind: entity.kind,
    namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
    name: entity.metadata.name,
  };
}

/**
 * Parses an entity reference, either on string or compound form, and returns
 * a structure with a name, and optional kind and namespace.
 *
 * @remarks
 *
 * The context object can contain default values for the kind and namespace,
 * that will be used if the input reference did not specify any.
 *
 * @public
 * @param ref - The reference to parse
 * @param context - The context of defaults that the parsing happens within
 * @returns The compound form of the reference
 */
export function parseEntityRef(
  ref: string | { kind?: string; namespace?: string; name: string },
  context?: {
    /** The default kind, if none is given in the reference */
    defaultKind?: string;
    /** The default namespace, if none is given in the reference */
    defaultNamespace?: string;
  },
): CompoundEntityRef {
  if (!ref) {
    throw new Error(`Entity reference must not be empty`);
  }

  const defaultKind = context?.defaultKind;
  const defaultNamespace = context?.defaultNamespace || DEFAULT_NAMESPACE;

  let kind: string | undefined;
  let namespace: string | undefined;
  let name: string | undefined;

  if (typeof ref === 'string') {
    const parsed = parseRefString(ref);
    kind = parsed.kind ?? defaultKind;
    namespace = parsed.namespace ?? defaultNamespace;
    name = parsed.name;
  } else {
    kind = ref.kind ?? defaultKind;
    namespace = ref.namespace ?? defaultNamespace;
    name = ref.name;
  }

  if (!kind) {
    const textual = JSON.stringify(ref);
    throw new Error(
      `Entity reference ${textual} had missing or empty kind (e.g. did not start with "component:" or similar)`,
    );
  } else if (!namespace) {
    const textual = JSON.stringify(ref);
    throw new Error(
      `Entity reference ${textual} had missing or empty namespace`,
    );
  } else if (!name) {
    const textual = JSON.stringify(ref);
    throw new Error(`Entity reference ${textual} had missing or empty name`);
  }

  return { kind, namespace, name };
}

/**
 * Takes an entity or entity name/reference, and returns the string form of an
 * entity ref.
 *
 * @remarks
 *
 * This function creates a canonical and unique reference to the entity, converting
 * all parts of the name to lowercase and inserts the default namespace if needed.
 * It is typically not the best way to represent the entity reference to the user.
 *
 * @public
 * @param ref - The reference to serialize
 * @returns The same reference on either string or compound form
 */
export function stringifyEntityRef(
  ref: Entity | { kind: string; namespace?: string; name: string },
): string {
  let kind;
  let namespace;
  let name;

  if ('metadata' in ref) {
    kind = ref.kind;
    namespace = ref.metadata.namespace ?? DEFAULT_NAMESPACE;
    name = ref.metadata.name;
  } else {
    kind = ref.kind;
    namespace = ref.namespace ?? DEFAULT_NAMESPACE;
    name = ref.name;
  }

  return `${kind.toLocaleLowerCase('en-US')}:${namespace.toLocaleLowerCase(
    'en-US',
  )}/${name.toLocaleLowerCase('en-US')}`;
}
