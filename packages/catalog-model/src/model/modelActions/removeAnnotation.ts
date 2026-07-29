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
import { createRemoveAnnotationOp } from '../operations/removeAnnotation';

/**
 * The definition of an annotation removal from the catalog model.
 *
 * @alpha
 */
export interface CatalogModelRemoveAnnotationDefinition {
  /**
   * The name of the annotation to remove, e.g. "backstage.io/techdocs-ref".
   */
  name: string;
}

export function opsFromCatalogModelRemoveAnnotation(
  definition: CatalogModelRemoveAnnotationDefinition,
): CatalogModelOp[] {
  return [createRemoveAnnotationOp({ name: definition.name })];
}
