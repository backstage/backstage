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
import { CatalogModelSchemaObjectType } from './addKind.types';

/**
 * The definition of a catalog model kind, roughly resembling a JSON Schema.
 *
 * @alpha
 */
export interface CatalogModelKindDefinition {
  /**
   * The API version(s) of the kind that this schema applies to, e.g.
   * "backstage.io/v1alpha1".
   *
   * @remarks
   *
   * Note that it is expected that as you add API versions to this array, you
   * can only make backwards compatible changes to the schema. For example,
   * adding optional fields is allowed, but removing required fields is not.
   */
  apiVersions: readonly string[];

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

  /**
   * The spec schema of the kind.
   */
  spec: CatalogModelSchemaObjectType;
}

export function opsFromCatalogModelKind(
  kind: CatalogModelKindDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  // TODO: apiVersion handling?

  ops.push({
    op: 'declareKind.v1',
    kind: kind.names.kind,
    properties: {
      singular: kind.names.singular,
      plural: kind.names.plural,
      description: kind.description,
    },
  });

  // TODO: Push the spec fields too

  return ops;
}
