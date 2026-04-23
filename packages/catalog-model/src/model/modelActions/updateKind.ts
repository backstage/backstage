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

import { JsonObject } from '@backstage/types';
import { reduceKindSchema } from '../jsonSchema/reduceKindSchema';
import { validateMetaSchema } from '../jsonSchema/validateMetaSchema';
import { CatalogModelOp } from '../operations';
import { createUpdateKindOp } from '../operations/updateKind';
import { createUpdateKindVersionOp } from '../operations/updateKindVersion';
import { CatalogModelKindRelationFieldDefinition } from './addKind';

/**
 * The definition of updates to a catalog model kind.
 *
 * @alpha
 */
export interface CatalogModelUpdateKindDefinition {
  /**
   * The names used for this kind.
   */
  names: {
    /**
     * The name of the kind with proper casing, e.g. "Component".
     */
    kind: string;

    /**
     * The singular form of the kind name, e.g. "component". Specify this if you
     * want to override the default value.
     */
    singular?: string;

    /**
     * The plural form of the kind name, e.g. "components". Specify this if you
     * want to override the default value.
     */
    plural?: string;
  };

  /**
   * A short description of the kind. Specify this if you want to override the
   * default value.
   */
  description?: string;

  /**
   * Update one or more versions of the kind's actual schema shape.
   */
  versions?: CatalogModelUpdateKindVersionDefinition[];
}

/**
 * The definition of updates to a specific version of a catalog model kind.
 *
 * @alpha
 */
export interface CatalogModelUpdateKindVersionDefinition {
  /**
   * The specific version name or names to update, e.g. "v1alpha1" or
   * ["v1alpha1", "v1beta1"].
   */
  name: string | string[];

  /**
   * The spec type or types that this version update applies to.
   */
  specType?: string | string[];

  /**
   * A short description of this particular version (and type, where
   * applicable). Specify this if you want to override the default value.
   */
  description?: string;

  /**
   * The fields that shall be used to generate relations, if any. Specify this
   * if you want to override the default value.
   */
  relationFields?: CatalogModelKindRelationFieldDefinition[];

  /**
   * The JSON schema to deep merge with the existing schema for this version.
   */
  schema?: {
    jsonSchema: JsonObject;
  };
}

export function opsFromCatalogModelUpdateKind(
  kind: CatalogModelUpdateKindDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  if (kind.names.singular || kind.names.plural || kind.description) {
    ops.push(
      createUpdateKindOp({
        kind: kind.names.kind,
        properties: {
          singular: kind.names.singular,
          plural: kind.names.plural,
          description: kind.description,
        },
      }),
    );
  }

  for (const version of kind.versions ?? []) {
    const jsonSchema = version.schema
      ? reduceKindSchema(version.schema.jsonSchema)
      : undefined;
    if (jsonSchema) {
      validateMetaSchema(jsonSchema);
    }
    const names = Array.isArray(version.name) ? version.name : [version.name];
    for (const name of names) {
      const specTypes = version.specType?.length
        ? [version.specType].flat()
        : [undefined];
      for (const specType of specTypes) {
        ops.push(
          createUpdateKindVersionOp({
            kind: kind.names.kind,
            name,
            specType: specType,
            properties: {
              description: version.description,
              relationFields: version.relationFields,
              schema: jsonSchema
                ? { jsonSchema: jsonSchema as any }
                : undefined,
            },
          }),
        );
      }
    }
  }

  return ops;
}
