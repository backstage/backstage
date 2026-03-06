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

import { OpaqueType } from '@internal/opaque';
import { CatalogModelOp } from './operations';

/**
 * A namespace containing type definitions that roughly resemble JSON Schema,
 * used by catalog model kind definitions.
 *
 * @alpha
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CatalogModelSchema {
  /**
   * Common fields shared by all property definitions.
   */
  export interface CommonTypeMeta {
    /**
     * A human-readable description of the property.
     */
    description?: string;
  }

  /**
   * A relation-type field definition.
   */
  export interface RelationType {
    type: 'relation';
    /**
     * The forward relation type, e.g. "ownedBy". This must match the
     * `forward.type` of a relation created with `createCatalogModelRelation`.
     * All other relation metadata is inferred from that definition.
     */
    relation: string;
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
  }

  /**
   * An object type definition with properties, resembling a JSON Schema object.
   */
  export interface ObjectType {
    type: 'object';
    /**
     * Whether additional properties are allowed beyond the ones specified.
     *
     * @default true
     */
    allowAdditionalProperties?: boolean;
    /**
     * The list of required property names. Properties not in this list will
     * be optional in the resulting type.
     */
    required?: readonly string[];
    /**
     * The properties of the object.
     */
    properties: {
      [key: string]: PropertyDefinition;
    };
  }

  export interface StringType {
    type: 'string';
    // minLength?: number;
    // maxLength?: number;
    // pattern?: string | RegExp;
  }

  export interface NumberType {
    type: 'number' | 'integer';
    // minimum?: number;
    // exclusiveMinimum?: number;
    // maximum?: number;
    // exclusiveMaximum?: number;
    // multipleOf?: number;
  }

  export interface BooleanType {
    type: 'boolean';
  }

  export interface EnumType {
    type: 'enum';
    values: readonly (string | number | boolean | null)[];
  }

  export interface ConstType {
    type: 'const';
    value: string | number | boolean | null;
  }

  /**
   * A single-value (non-array) type definition.
   */
  export type AnyItemType =
    | StringType
    | NumberType
    | BooleanType
    | EnumType
    | ConstType
    | ObjectType
    | RelationType;

  /**
   * Type-specific portion of a property definition, forming a discriminated union
   * on the `type` field.
   */
  export type AnyType = AnyItemType | { type: 'array'; items?: AnyItemType };

  /**
   * A property definition for a catalog model kind spec field.
   */
  export type PropertyDefinition = AnyType & CommonTypeMeta;
}

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
export interface CatalogModel {
  /**
   * Prepare an entity for validation.
   *
   * @remarks
   *
   * This may mutate the entity. For example, array relation fields may have
   * sorting applied to stay consistent (since their order by definition is not
   * important; this saves down on unnecessary stitching).
   *
   * @param entity - The entity to prepare.
   */
  prepareEntity(entity: unknown): void;
  /**
   * Validate an entity against this catalog model.
   */
  validateEntity(entity: unknown): void;
}
