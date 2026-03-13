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

/**
 * The definition of a catalog model kind, roughly resembling a JSON Schema.
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
}

export function opsFromCatalogModelUpdateKind(
  kind: CatalogModelUpdateKindDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  if (kind.names.singular || kind.names.plural || kind.description) {
    ops.push({
      op: 'updateKind.v1',
      kind: kind.names.kind,
      properties: {
        singular: kind.names.singular,
        plural: kind.names.plural,
        description: kind.description,
      },
    });
  }

  // TODO: Can this same op update the schema too?

  return ops;
}
