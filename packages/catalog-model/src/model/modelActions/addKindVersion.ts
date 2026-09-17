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

import { reduceKindSchema } from '../jsonSchema/reduceKindSchema';
import { validateKindRootSchemaSemantics } from '../jsonSchema/validateKindRootSchemaSemantics';
import { validateMetaSchema } from '../jsonSchema/validateMetaSchema';
import { CatalogModelOp } from '../operations';
import { createDeclareKindVersionOp } from '../operations/declareKindVersion';
import type { CatalogModelKindVersionDefinition } from './addKind';

/**
 * The definition for adding one or more versions to an already-declared kind.
 *
 * @alpha
 */
export interface CatalogModelAddKindVersionDefinition {
  /**
   * The kind to add versions to, e.g. "API".
   */
  kind: string;

  /**
   * The versions to add.
   */
  versions: CatalogModelKindVersionDefinition[];
}

export function opsFromCatalogModelAddKindVersion(
  definition: CatalogModelAddKindVersionDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  for (const version of definition.versions) {
    const jsonSchema = reduceKindSchema(version.schema.jsonSchema);
    validateMetaSchema(jsonSchema);
    validateKindRootSchemaSemantics(jsonSchema);
    const names = Array.isArray(version.name) ? version.name : [version.name];
    for (const name of names) {
      const specTypes = version.specType
        ? [version.specType].flat()
        : [undefined];
      for (const specType of specTypes) {
        ops.push(
          createDeclareKindVersionOp({
            kind: definition.kind,
            name,
            specType: specType,
            properties: {
              description: version.description,
              relationFields: version.relationFields,
              schema: {
                jsonSchema: jsonSchema as any,
              },
            },
          }),
        );
      }
    }
  }

  return ops;
}
