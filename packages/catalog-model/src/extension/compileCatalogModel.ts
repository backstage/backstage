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

import { CatalogModelKind } from './createCatalogModelKind';
import { CatalogModelRelation } from './createCatalogModelRelation';
import { CatalogModelExtension, OpaqueCatalogModelExtension } from './types';

/**
 * A compiled catalog model.
 *
 * @alpha
 */
export interface CatalogModel {
  /**
   * Look up a kind by its kind name and API version.
   *
   * @param kind - The kind name, e.g. "Component".
   * @param apiVersion - The API version, e.g. "backstage.io/v1alpha1".
   * @returns The kind if found, or `undefined` if no matching kind exists.
   */
  getKind(kind: string, apiVersion: string): CatalogModelKind | undefined;
  /**
   * Look up all relations that originate from a given kind.
   *
   * @param kind - The kind name, e.g. "Component".
   * @returns The relations originating from the kind, or `undefined` if the
   *   kind is not known.
   */
  getRelations(kind: string): CatalogModelRelation[] | undefined;
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
