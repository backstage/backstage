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
import { EntityName } from '../types';
import { Entity } from './Entity';

function parseRefString(ref: string): {
  kind?: string;
  namespace?: string;
  name: string;
} {
  const match = /^([^:/]+:)?([^:/]+\/)?([^:/]+)$/.exec(ref.trim());
  if (!match) {
    throw new TypeError(
      `Entity reference "${ref}" was not on the form [<kind>:][<namespace>/]<name>`,
    );
  }

  return {
    kind: match[1]?.slice(0, -1),
    namespace: match[2]?.slice(0, -1),
    name: match[3],
  };
}

/**
 * Extracts the kind, namespace and name that form the name triplet of the
 * given entity.
 *
 * @public
 * @param entity - An entity
 * @returns The complete entity name
 */
export function getEntityName(entity: Entity): EntityName {
  return {
    kind: entity.kind,
    namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
    name: entity.metadata.name,
  };
}

/**
 * The context of defaults that entity reference parsing happens within.
 *
 * @public
 * @deprecated type inlined, will be removed in a future release.
 */
export type EntityRefContext = {
  /** The default kind, if none is given in the reference */
  defaultKind?: string;
  /** The default namespace, if none is given in the reference */
  defaultNamespace?: string;
};

/**
 * Parses an entity reference, either on string or compound form, and always
 * returns a complete entity name including kind, namespace and name.
 *
 * @remarks
 *
 * This function automatically assumes the default namespace "default" unless
 * otherwise specified as part of the options, and will throw an error if no
 * kind was specified in the input reference and no default kind was given.
 *
 * @deprecated Please use parseEntityRef instead
 * @public
 * @param ref - The reference to parse
 * @param context - The context of defaults that the parsing happens within
 * @returns A complete entity name
 */
export function parseEntityName(
  ref: string | { kind?: string; namespace?: string; name: string },
  context: {
    /** The default kind, if none is given in the reference */
    defaultKind?: string;
    /** The default namespace, if none is given in the reference */
    defaultNamespace?: string;
  } = {},
): EntityName {
  const { kind, namespace, name } = parseEntityRef(ref, {
    defaultNamespace: DEFAULT_NAMESPACE,
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
): EntityName {
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

/**
 * Compares an entity to either a string reference or a compound reference.
 *
 * @remarks
 *
 * The comparison is case insensitive, and all of kind, namespace, and name
 * must match (after applying the optional context to the ref).
 *
 * @public
 * @param entity - The entity to match
 * @param ref - A string or compound entity ref
 * @param context - An optional context of default kind and namespace, that apply
 *                to the ref if given
 * @returns True if matching, false otherwise
 * @deprecated compare using stringifyEntityRef instead.
 */
export function compareEntityToRef(
  entity: Entity,
  ref:
    | string
    | { kind?: string; namespace?: string; name: string }
    | EntityName,
  context?: {
    /** The default kind, if none is given in the reference */
    defaultKind?: string;
    /** The default namespace, if none is given in the reference */
    defaultNamespace?: string;
  },
): boolean {
  const entityKind = entity.kind;
  const entityNamespace = entity.metadata.namespace || DEFAULT_NAMESPACE;
  const entityName = entity.metadata.name;

  let refKind: string | undefined;
  let refNamespace: string | undefined;
  let refName: string;
  if (typeof ref === 'string') {
    const parsed = parseRefString(ref);
    refKind = parsed.kind || context?.defaultKind;
    refNamespace =
      parsed.namespace || context?.defaultNamespace || DEFAULT_NAMESPACE;
    refName = parsed.name;
  } else {
    refKind = ref.kind || context?.defaultKind;
    refNamespace =
      ref.namespace || context?.defaultNamespace || DEFAULT_NAMESPACE;
    refName = ref.name;
  }

  if (!refKind || !refNamespace) {
    throw new Error(
      `Entity reference or context did not contain kind and namespace`,
    );
  }

  return (
    entityKind.toLocaleLowerCase('en-US') ===
      refKind.toLocaleLowerCase('en-US') &&
    entityNamespace.toLocaleLowerCase('en-US') ===
      refNamespace.toLocaleLowerCase('en-US') &&
    entityName.toLocaleLowerCase('en-US') === refName.toLocaleLowerCase('en-US')
  );
}
