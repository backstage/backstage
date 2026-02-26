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

import { FilterPredicate } from '@backstage/filter-predicates';
import { OpaqueType } from '@internal/opaque';

/**
 * Defines the rules that apply for the relations generated out of a certain
 * field.
 */
export interface RelationDefinition {
  /**
   * If the given shorthand ref did not have a kind, use this kind as the
   * default. If no default kind is specified, the ref must contain a kind.
   */
  defaultKind?: string;
  /**
   * If the given shorthand ref did not have a namespace, either inherit the
   * namespace of the entity itself, or choose the default namespace.
   */
  defaultNamespace?: 'default' | 'inherit';
  /**
   * Only allow relations to be specified to the given kinds. This list must
   * include the default kind, if any.
   */
  allowedKinds?: string[];
  /**
   * The type of relation that is generated for the outgoing direction (from the
   * current entity toward the one being referenced).
   */
  outgoingType: string;
  /**
   * The type of relation that is generated for the incoming direction (from the
   * one being referenced toward the current entity).
   */
  incomingType: string;
}

/**
 * Validate the entity against a JSON schema.
 */
export interface OpJsonSchema {
  type: 'entity.jsonschema';
  /**
   * The op applies to entities that match this filter predicate.
   */
  if: FilterPredicate;
  /**
   * The JSON schema to validate the entity against.
   */
  schema: unknown;
}

/**
 * Mark a field as a source of relations. The field is expected to be a string
 * or string array.
 */
export interface OpSpecRelation {
  type: 'field.relation';
  /**
   * The op applies to entities that match this filter predicate.
   */
  if: FilterPredicate;
  /**
   * The (dot separated) path to the field that is a source of relations.
   */
  path: string;
  /**
   * The definition of the relations generated out of this field.
   */
  relation: RelationDefinition;
}

export type CatalogModelOp = OpJsonSchema | OpSpecRelation;

/**
 * The opaque type that represents a catalog model extension.
 *
 * @remarks
 *
 * Model extensions are essentially an array of operations. Several such model
 * extensions are merged together to form a final outcome.
 */
export const OpaqueCatalogModelExtension = OpaqueType.create<{
  public: CatalogModelExtension;
  versions: {
    readonly version: 'v1';
    readonly modelName: string;
    readonly ops: Array<CatalogModelOp>;
  };
}>({
  type: '@backstage/CatalogModelExtension',
  versions: ['v1'],
});

/**
 * An opaque type that represents a set of catalog model extensions.
 *
 * @alpha
 */
export interface CatalogModelExtension {
  readonly $$type: '@backstage/CatalogModelExtension';
  readonly modelName: string;
}

/**
 * A builder for catalog model extensions.
 *
 * @alpha
 */
export interface CatalogModelBuilder {
  /**
   * Add a JSON schema describing an entity shape.
   *
   * @remarks
   *
   * The JSON schema must be valid, and describe (part of) an entity shape. It
   * must contain the "kind" property (as a "const" or "enum" type), and
   * optionally likewise an "apiVersion" property. These control what entities
   * that it will be applied to.
   *
   * It does not have to describe the "metadata" object, but can describe a
   * "spec".
   *
   * Fields that are strings or string arrays can be marked as sources of
   * relations, by adding the custom "relation" property to their definition.
   * Example:
   *
   * ```
   * "owner": {
   *   "type": "string",
   *   "relation": {
   *     "defaultKind": "Group",
   *     "defaultNamespace": "inherit",
   *     "outgoingType": "ownedBy",
   *     "incomingType": "ownerOf"
   *   }
   * }
   * ```
   */
  addJsonSchema(schema: unknown): void;
}

/**
 * A compiled catalog model.
 *
 * @alpha
 */
export interface CatalogModel {}
