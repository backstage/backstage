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
import { createRemoveTagOp } from '../operations/removeTag';

/**
 * The definition of a tag removal from the catalog model.
 *
 * @alpha
 */
export interface CatalogModelRemoveTagDefinition {
  /**
   * The name of the tag to remove, e.g. "java".
   */
  name: string;
}

export function opsFromCatalogModelRemoveTag(
  definition: CatalogModelRemoveTagDefinition,
): CatalogModelOp[] {
  return [createRemoveTagOp({ name: definition.name })];
}
