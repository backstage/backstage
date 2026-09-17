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
import { createRemoveKindOp } from '../operations/removeKind';

/**
 * The definition of a kind removal from the catalog model.
 *
 * @alpha
 */
export interface CatalogModelRemoveKindDefinition {
  /**
   * The kind to remove, e.g. "Component".
   */
  kind: string;
}

export function opsFromCatalogModelRemoveKind(
  definition: CatalogModelRemoveKindDefinition,
): CatalogModelOp[] {
  return [createRemoveKindOp({ kind: definition.kind })];
}
