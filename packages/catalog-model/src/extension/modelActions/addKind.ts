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

import { CatalogModelOp } from '../operations';
import { CatalogModelKindRootSchema } from '../jsonSchema/validateKindRootSchemaSemantics';

/**
 * The definition of a catalog model kind, roughly resembling a JSON Schema.
 *
 * @alpha
 */
export interface CatalogModelKindDefinition {
  /**
   * The apiVersion group of the kind, e.g. "backstage.io".
   */
  group: string;

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
   * A short description of the kind.
   */
  description: string;

  versions?: Array<{
    /**
     * The specific version name, e.g. "v1alpha1". This and the kind group form the full apiVersion.
     */
    name: string;

    /**
     * The spec types that this version applies to.
     *
     * @remarks
     *
     * This can be used to make kinds whose spec effectively are discriminated
     * unions. If you don't specify this, the schema will apply to a spec that
     * has no type given at all, or to those where the type is not among the set
     * of any other known declared spec types.
     */
    specTypes?: string[];

    /**
     * The fields that shall be used to generate relations, if any.
     */
    relationFields?: CatalogModelKindRelationFieldDefinition[];

    schema: {
      jsonSchema: CatalogModelKindRootSchema;
    };
  }>;
}

/**
 * @alpha
 */
export interface CatalogModelKindRelationFieldDefinition {
  /**
   * What field that shall be used to generate relations.
   *
   * @remarks
   *
   * The field value is expected to be a string or string array at runtime.
   */
  selector: { path: string };
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

export function opsFromCatalogModelKind(
  kind: CatalogModelKindDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  ops.push({
    op: 'declareKind.v1',
    kind: kind.names.kind,
    properties: {
      singular: kind.names.singular,
      plural: kind.names.plural,
      description: kind.description,
    },
  });

  // TODO: apiVersion handling?
  // TODO: Push the spec fields too

  return ops;
}
