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
import { JsonObject } from '@backstage/types';

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
   * The names for the outgoing direction (from the current entity toward
   * the one being referenced).
   */
  outgoing: {
    type: string;
    singular: string;
    plural: string;
  };
  /**
   * The names for the incoming direction (from the one being referenced
   * toward the current entity).
   */
  incoming: {
    type: string;
    singular: string;
    plural: string;
  };
}

/**
 * Make a basic declaration about the existence of a kind and some of its
 * properties.
 */
export interface OpDeclareKind {
  type: 'kind.declare';
  /**
   * The kind to declare.
   */
  kind: string;
  /**
   * The API version(s) that this declaration applies to.
   */
  apiVersions?: string[];
  /**
   * The set of properties to declare for this kind (and optionally API
   * versions).
   */
  properties: {
    /**
     * A human readable description of the kind.
     */
    description?: {
      /**
       * A textual description that may contain markdown.
       */
      markdown: string;
    };
    /**
     * Examples of what instances of this kind may look like.
     */
    examples?: Array<{
      /**
       * An example in the form of a raw JSON object.
       */
      json: JsonObject;
    }>;
  };
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

/**
 * The set of possible operations that can be applied to a catalog model.
 */
export type CatalogModelOp = OpDeclareKind | OpJsonSchema | OpSpecRelation;
