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
import { validateMetaSchema } from '../jsonSchema/validateMetaSchema';
import { CatalogModelOp } from '../operations';
import { createDeclareAnnotationOp } from '../operations/declareAnnotation';
import { JsonObject } from '@backstage/types';

/**
 * The definition of a catalog model annotation.
 *
 * @alpha
 */
export interface CatalogModelAnnotationDefinition {
  /**
   * The name of the annotation, e.g. "backstage.io/techdocs-ref".
   */
  name: string;

  /**
   * A human-readable title that can be used for display purposes instead of
   * the technical name.
   */
  title?: string;

  /**
   * A human-readable description of the annotation.
   */
  description: string;

  /**
   * The JSON schema that values of this annotation must conform to.
   *
   * @remarks
   *
   * If not provided, the annotation is assumed to be a simple string with no
   * particular schema.
   */
  schema?: {
    jsonSchema: JsonObject;
  };
}

export function opsFromCatalogModelAnnotation(
  annotation: CatalogModelAnnotationDefinition,
): CatalogModelOp[] {
  if (annotation.schema?.jsonSchema) {
    validateMetaSchema(annotation.schema.jsonSchema);
    if (annotation.schema.jsonSchema.type !== 'string') {
      throw new InputError(
        `Annotation "${annotation.name}" schema must have "type": "string" at the root, only string values are supported`,
      );
    }
  }
  return [
    createDeclareAnnotationOp({
      name: annotation.name,
      properties: {
        title: annotation.title,
        description: annotation.description,
        schema: annotation.schema,
      },
    }),
  ];
}
