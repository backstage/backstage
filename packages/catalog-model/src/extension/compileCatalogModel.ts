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

import {
  CatalogModel,
  CatalogModelExtension,
  OpaqueCatalogModelExtension,
} from './types';

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
