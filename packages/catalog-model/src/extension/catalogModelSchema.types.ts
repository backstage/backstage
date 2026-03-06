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

import { JsonValue } from '@backstage/types';

/**
 * Common fields shared by all property definitions.
 *
 * @alpha
 */
export interface CatalogModelSchemaCommonTypeMeta {
  /**
   * A human-readable description of the property.
   */
  description?: string;
  /**
   * Some examples of the property
   */
  examples?: readonly JsonValue[];
}

/**
 * A relation-type field definition.
 *
 * @alpha
 */
export interface CatalogModelSchemaRelationType
  extends CatalogModelSchemaCommonTypeMeta {
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
 *
 * @alpha
 */
export interface CatalogModelSchemaObjectType
  extends CatalogModelSchemaCommonTypeMeta {
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
    [key: string]: CatalogModelSchemaPropertyDefinition;
  };
}

/**
 * @alpha
 */
export interface CatalogModelSchemaStringType
  extends CatalogModelSchemaCommonTypeMeta {
  type: 'string';
}

/**
 * @alpha
 */
export interface CatalogModelSchemaNumberType
  extends CatalogModelSchemaCommonTypeMeta {
  type: 'number' | 'integer';
}

/**
 * @alpha
 */
export interface CatalogModelSchemaBooleanType
  extends CatalogModelSchemaCommonTypeMeta {
  type: 'boolean';
}

/**
 * @alpha
 */
export interface CatalogModelSchemaEnumType
  extends CatalogModelSchemaCommonTypeMeta {
  type: 'enum';
  values: readonly (string | number | boolean | null)[];
}

/**
 * @alpha
 */
export interface CatalogModelSchemaConstType
  extends CatalogModelSchemaCommonTypeMeta {
  type: 'const';
  value: string | number | boolean | null;
}

/**
 * @alpha
 */
export interface CatalogModelSchemaArrayType
  extends CatalogModelSchemaCommonTypeMeta {
  type: 'array';
  items?: CatalogModelSchemaAnyItemType;
}

/**
 * A single-value (non-array) type definition.
 *
 * @alpha
 */
export type CatalogModelSchemaAnyItemType =
  | CatalogModelSchemaStringType
  | CatalogModelSchemaNumberType
  | CatalogModelSchemaBooleanType
  | CatalogModelSchemaEnumType
  | CatalogModelSchemaConstType
  | CatalogModelSchemaObjectType
  | CatalogModelSchemaRelationType;

/**
 * Type-specific portion of a property definition, forming a discriminated union
 * on the `type` field.
 *
 * @alpha
 */
export type CatalogModelSchemaAnyType =
  | CatalogModelSchemaAnyItemType
  | CatalogModelSchemaArrayType;

/**
 * A property definition for a catalog model kind spec field.
 *
 * @alpha
 */
export type CatalogModelSchemaPropertyDefinition = CatalogModelSchemaAnyType;
