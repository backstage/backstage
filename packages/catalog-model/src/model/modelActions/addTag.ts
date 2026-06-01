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
import { createDeclareTagOp } from '../operations/declareTag';

/**
 * The definition of a catalog model tag.
 *
 * @alpha
 */
export interface CatalogModelTagDefinition {
  /**
   * The name of the tag, e.g. "java".
   */
  name: string;

  /**
   * A human-readable title that can be used for display purposes instead of
   * the technical name.
   */
  title?: string;

  /**
   * A human-readable description of the tag.
   */
  description: string;
}

export function opsFromCatalogModelTag(
  tag: CatalogModelTagDefinition,
): CatalogModelOp[] {
  return [
    createDeclareTagOp({
      name: tag.name,
      properties: {
        title: tag.title,
        description: tag.description,
      },
    }),
  ];
}
