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
import { createUpdateLabelOp } from '../operations/updateLabel';
import { JsonObject } from '@backstage/types';

/**
 * The definition of updates to a catalog model label.
 *
 * @alpha
 */
export interface CatalogModelUpdateLabelDefinition {
  /**
   * The name of the label, e.g. "backstage.io/source-location".
   */
  name: string;

  /**
   * A human-readable title that can be used for display purposes instead of
   * the technical name.
   */
  title?: string;

  /**
   * A human-readable description of the label.
   */
  description?: string;

  /**
   * The JSON schema that values of this label must conform to.
   *
   * @remarks
   *
   * If not provided, the label is assumed to be a simple string with no
   * particular schema.
   */
  schema?: {
    jsonSchema: JsonObject;
  };
}

export function opsFromCatalogModelUpdateLabel(
  label: CatalogModelUpdateLabelDefinition,
): CatalogModelOp[] {
  if (label.schema) {
    validateMetaSchema(label.schema.jsonSchema);
    if (label.schema.jsonSchema.type !== 'string') {
      throw new InputError(
        `Label "${label.name}" schema must have "type": "string" at the root, only string values are supported`,
      );
    }
  }
  return [
    createUpdateLabelOp({
      name: label.name,
      properties: {
        title: label.title,
        description: label.description,
        schema: label.schema,
      },
    }),
  ];
}
