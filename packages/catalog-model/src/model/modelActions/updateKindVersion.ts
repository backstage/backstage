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
import { createUpdateKindVersionOp } from '../operations/updateKindVersion';
import { CatalogModelKindRelationFieldDefinition } from './addKind';

/**
 * The definition needed to update a single version of an existing kind.
 *
 * @alpha
 */
export interface CatalogModelKindVersionUpdate {
  /**
   * The kind to update the version on, e.g. "Component".
   */
  kind: string;

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

export function opsFromCatalogModelUpdateKindVersion(
  update: CatalogModelKindVersionUpdate,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  const jsonSchema = update.schema
    ? reduceKindSchema(update.schema.jsonSchema)
    : undefined;
  if (jsonSchema) {
    validateMetaSchema(jsonSchema);
  }

  const names = Array.isArray(update.name) ? update.name : [update.name];
  for (const name of names) {
    const specTypes = update.specType ? [update.specType].flat() : [undefined];
    for (const specType of specTypes) {
      ops.push(
        createUpdateKindVersionOp({
          kind: update.kind,
          name,
          specType,
          properties: {
            description: update.description,
            relationFields: update.relationFields,
            schema: jsonSchema ? { jsonSchema: jsonSchema as any } : undefined,
          },
        }),
      );
    }
  }

  return ops;
}
