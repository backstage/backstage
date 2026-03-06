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

import { CatalogModelExtension, OpaqueCatalogModelExtension } from './types';

/**
 * A compiled catalog model.
 *
 * @alpha
 */
export interface CatalogModel {
  /**
   * Prepare an entity for validation.
   *
   * @remarks
   *
   * This may mutate the entity. For example, array relation fields may have
   * sorting applied to stay consistent (since their order by definition is not
   * important; this saves down on unnecessary stitching).
   *
   * @param entity - The entity to prepare.
   */
  prepareEntity(entity: unknown): void;
  /**
   * Validate an entity against this catalog model.
   */
  validateEntity(entity: unknown): void;
}

/**
 * Compiles a set of catalog model extensions into a single catalog model.
 *
 * @alpha
 * @param extensions - The extensions to compile.
 * @returns The compiled catalog model.
 */
export function compileCatalogModel(
  extensions: Iterable<CatalogModelExtension>,
): CatalogModel {
  for (const externalExtension of extensions) {
    OpaqueCatalogModelExtension.toInternal(externalExtension);
  }

  return {} as any;
}
