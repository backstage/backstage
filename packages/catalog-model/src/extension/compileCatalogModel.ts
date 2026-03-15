/*
 * Copyright 2026 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import lodash from 'lodash';
import { mergeJsonSchemas } from './jsonSchema/merge';
import { CatalogModelOp } from './operations';
import { OpDeclareKindV1 } from './operations/declareKind';
import { OpDeclareKindVersionV1 } from './operations/declareKindVersion';
import { OpDeclareRelationV1 } from './operations/declareRelation';
import { OpUpdateKindV1 } from './operations/updateKind';
import { OpUpdateKindVersionV1 } from './operations/updateKindVersion';
import { OpUpdateRelationV1 } from './operations/updateRelation';
import { CatalogModelExtension, OpaqueCatalogModelExtension } from './types';

/**
 * A compiled catalog model kind.
 */
export interface CatalogModelKind {
  /**
   * The API version(s) of the kind that this schema applies to, e.g.
   * "backstage.io/v1alpha1".
   */
  apiVersions: string[];

  /**
   * The names used for this kind.
   */
  names: {
    /**
     * The name of the kind with proper casing, e.g. "Component".
     */
    kind: string;

    /**
     * The singular form of the kind name, e.g. "component".
     */
    singular: string;

    /**
     * The plural form of the kind name, e.g. "components".
     */
    plural: string;
  };

  /**
   * The JSON schema of the kind.
   *
   * @remarks
   *
   * This can be used for validation of entities. Note that it is up to the
   * caller to ensure that the kind and apiVersion match what you are validating
   * against.
   */
  jsonSchema: JsonObject;
}

/**
 * A compiled catalog model relation.
 */
export interface CatalogModelRelation {
  /**
   * The kind that this relation originates from.
   */
  fromKind: string;
  /**
   * The technical type of the relation, e.g. "ownedBy".
   */
  type: string;
  /**
   * The kind that this relation points to.
   */
  toKind: string;
  /**
   * The technical type of the reverse relation, e.g. "ownerOf".
   */
  reverseType: string;
  /**
   * The singular human readable form of the relation name.
   */
  singular: string;
  /**
   * The plural human readable form of the relation name.
   */
  plural: string;
  /**
   * A human-readable comment describing the relation.
   */
  comment: string;
}

/**
 * A compiled catalog model.
 *
 * @alpha
 */
export interface CatalogModel {
  /**
   * All of the ops that were used to build this model, in the order they were
   * applied.
   */
  ops: ReadonlyArray<CatalogModelOp>;

  /**
   * Look up a kind in the model.
   *
   * @returns The kind if found, or `undefined` if no matching kind exists.
   * @throws TypeError if the kind exists in the model, but not for this apiVersion or type.
   */
  getKind(
    options:
      | { kind: string; apiVersion: string; type?: string }
      | { kind: string; apiVersion: string; spec: { type?: string } },
  ): CatalogModelKind | undefined;
  /**
   * Look up all relations that originate from a given kind.
   *
   * @param kind - The kind name, e.g. "Component".
   * @returns The relations originating from the kind, or `undefined` if the
   *   kind is not known.
   */
  getRelations(kind: string): CatalogModelRelation[] | undefined;
}

// #region Internal types used during compilation

interface KindState {
  group: string;
  singular: string;
  plural: string;
  description: string;
  versions: Map<string, VersionState>;
}

interface VersionState {
  name: string;
  apiVersion: string;
  specTypes: Map<string | undefined, SpecTypeState>;
}

interface SpecTypeState {
  description?: string;
  relationFields?: OpDeclareKindVersionV1['properties']['relationFields'];
  jsonSchema: JsonObject;
}

interface RelationState {
  fromKind: string;
  type: string;
  toKind: string;
  reverseType: string;
  singular: string;
  plural: string;
  comment: string;
}

// #endregion

// #region Op sorting

const OP_SORT_ORDER: Record<string, number> = {
  'declareKind.v1': 0,
  'declareKindVersion.v1': 1,
  'declareRelation.v1': 2,
  'updateKind.v1': 3,
  'updateKindVersion.v1': 4,
  'updateRelation.v1': 5,
};

/**
 * Sorts ops so that declarations come before updates, while preserving the
 * relative order of ops with the same priority (stable sort).
 */
function sortOps(ops: CatalogModelOp[]): CatalogModelOp[] {
  return lodash.sortBy(ops, op => OP_SORT_ORDER[op.op] ?? 99);
}

// #endregion

// #region Op application

function applyDeclareKind(
  kinds: Map<string, KindState>,
  op: OpDeclareKindV1,
): void {
  if (kinds.has(op.kind)) {
    throw new InputError(`Kind "${op.kind}" is declared more than once`);
  }
  kinds.set(op.kind, {
    group: op.group,
    singular: op.properties.singular,
    plural: op.properties.plural,
    description: op.properties.description,
    versions: new Map(),
  });
}

function applyDeclareKindVersion(
  kinds: Map<string, KindState>,
  op: OpDeclareKindVersionV1,
): void {
  const kind = kinds.get(op.kind);
  if (!kind) {
    throw new InputError(
      `Cannot declare version "${op.name}" for unknown kind "${op.kind}"`,
    );
  }

  let version = kind.versions.get(op.name);
  if (!version) {
    version = {
      name: op.name,
      apiVersion: `${kind.group}/${op.name}`,
      specTypes: new Map(),
    };
    kind.versions.set(op.name, version);
  }

  if (version.specTypes.has(op.specType)) {
    const label = op.specType
      ? `spec type "${op.specType}"`
      : 'default spec type';
    throw new InputError(
      `Version "${op.name}" of kind "${op.kind}" already has ${label} declared`,
    );
  }

  version.specTypes.set(op.specType, {
    description: op.properties.description,
    relationFields: op.properties.relationFields,
    jsonSchema: op.properties.schema.jsonSchema as JsonObject,
  });
}

function applyDeclareRelation(
  relations: Map<string, RelationState>,
  op: OpDeclareRelationV1,
): void {
  const key = `${op.fromKind}:${op.type}:${op.toKind}`;
  if (relations.has(key)) {
    throw new InputError(
      `Relation "${op.type}" from "${op.fromKind}" to "${op.toKind}" is declared more than once`,
    );
  }
  relations.set(key, {
    fromKind: op.fromKind,
    type: op.type,
    toKind: op.toKind,
    reverseType: op.properties.reverseType,
    singular: op.properties.singular,
    plural: op.properties.plural,
    comment: op.properties.comment,
  });
}

function applyUpdateKind(
  kinds: Map<string, KindState>,
  op: OpUpdateKindV1,
): void {
  const kind = kinds.get(op.kind);
  if (!kind) {
    throw new InputError(`Cannot update unknown kind "${op.kind}"`);
  }
  if (op.properties.singular !== undefined) {
    kind.singular = op.properties.singular;
  }
  if (op.properties.plural !== undefined) {
    kind.plural = op.properties.plural;
  }
  if (op.properties.description !== undefined) {
    kind.description = op.properties.description;
  }
}

function applyUpdateKindVersion(
  kinds: Map<string, KindState>,
  op: OpUpdateKindVersionV1,
): void {
  const kind = kinds.get(op.kind);
  if (!kind) {
    throw new InputError(
      `Cannot update version "${op.name}" for unknown kind "${op.kind}"`,
    );
  }

  const version = kind.versions.get(op.name);
  if (!version) {
    throw new InputError(
      `Cannot update unknown version "${op.name}" of kind "${op.kind}"`,
    );
  }

  const specType = version.specTypes.get(op.specType);
  if (!specType) {
    const label = op.specType
      ? `spec type "${op.specType}"`
      : 'default spec type';
    throw new InputError(
      `Cannot update undeclared ${label} on version "${op.name}" of kind "${op.kind}"`,
    );
  }

  if (op.properties.description !== undefined) {
    specType.description = op.properties.description;
  }
  if (op.properties.relationFields !== undefined) {
    specType.relationFields = op.properties.relationFields;
  }
  if (op.properties.schema !== undefined) {
    specType.jsonSchema = mergeJsonSchemas(
      specType.jsonSchema,
      op.properties.schema.jsonSchema as JsonObject,
    );
  }
}

function applyUpdateRelation(
  relations: Map<string, RelationState>,
  op: OpUpdateRelationV1,
): void {
  const key = `${op.fromKind}:${op.type}:${op.toKind}`;
  const relation = relations.get(key);
  if (!relation) {
    throw new InputError(
      `Cannot update undeclared relation "${op.type}" from "${op.fromKind}" to "${op.toKind}"`,
    );
  }
  if (op.properties.reverseType !== undefined) {
    relation.reverseType = op.properties.reverseType;
  }
  if (op.properties.singular !== undefined) {
    relation.singular = op.properties.singular;
  }
  if (op.properties.plural !== undefined) {
    relation.plural = op.properties.plural;
  }
  if (op.properties.comment !== undefined) {
    relation.comment = op.properties.comment;
  }
}

// #endregion

// #region Main compilation

/**
 * Compiles a set of catalog models and/or extensions into a single unified
 * catalog model.
 *
 * @alpha
 * @param inputs - The extensions to compile.
 * @returns The compiled catalog model.
 */
export function compileCatalogModel(
  inputs: Iterable<CatalogModelExtension | CatalogModel>,
): CatalogModel {
  // Collect all ops from all inputs
  let allOps: CatalogModelOp[] = [];
  for (const input of inputs) {
    if ('ops' in input) {
      allOps = allOps.concat(input.ops);
    } else {
      const internal = OpaqueCatalogModelExtension.toInternal(input);
      allOps = allOps.concat(internal.ops);
    }
  }

  const sortedOps = sortOps(allOps);

  // Apply ops in order
  const kinds = new Map<string, KindState>();
  const relations = new Map<string, RelationState>();

  for (const op of sortedOps) {
    switch (op.op) {
      case 'declareKind.v1':
        applyDeclareKind(kinds, op);
        break;
      case 'declareKindVersion.v1':
        applyDeclareKindVersion(kinds, op);
        break;
      case 'declareRelation.v1':
        applyDeclareRelation(relations, op);
        break;
      case 'updateKind.v1':
        applyUpdateKind(kinds, op);
        break;
      case 'updateKindVersion.v1':
        applyUpdateKindVersion(kinds, op);
        break;
      case 'updateRelation.v1':
        applyUpdateRelation(relations, op);
        break;
      default:
        throw new InputError(`Unknown op type "${(op as CatalogModelOp).op}"`);
    }
  }

  return {
    ops: sortedOps,

    getKind(options) {
      const type = 'spec' in options ? options.spec.type : options.type;

      const kindState = kinds.get(options.kind);
      if (!kindState) {
        return undefined;
      }

      const version = [...kindState.versions.values()].find(
        v => v.apiVersion === options.apiVersion,
      );
      if (!version) {
        throw new TypeError(
          `Kind "${options.kind}" exists, but has no version matching apiVersion "${options.apiVersion}"`,
        );
      }

      // Look up the specific spec type, falling back to the default (undefined key)
      let specType = version.specTypes.get(type);
      if (!specType && type !== undefined) {
        specType = version.specTypes.get(undefined);
      }
      if (!specType) {
        throw new TypeError(
          `Kind "${options.kind}" version "${version.name}" exists, but has no matching spec type`,
        );
      }

      return {
        apiVersions: [version.apiVersion],
        names: {
          kind: options.kind,
          singular: kindState.singular,
          plural: kindState.plural,
        },
        jsonSchema: specType.jsonSchema,
      };
    },

    getRelations(kindName) {
      if (!kinds.has(kindName)) {
        return undefined;
      }
      return [...relations.values()].filter(r => r.fromKind === kindName);
    },
  };
}

// #endregion
