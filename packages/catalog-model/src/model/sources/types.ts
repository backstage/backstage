/*
 * Copyright 2023 The Backstage Authors
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

import { CatalogModelLayer } from '../types';

/**
 * Options for {@link CatalogModelSource#read}.
 *
 * @alpha
 */
export interface CatalogModelSourceReadOptions {
  signal?: AbortSignal;
}

/**
 * The generator returned by {@link CatalogModelSource#read}.
 *
 * @alpha
 */
export type AsyncCatalogModelSourceGenerator = AsyncGenerator<
  { data: Array<{ layer: CatalogModelLayer }> },
  void,
  void
>;

/**
 * A source of catalog model layers.
 *
 * @remarks
 *
 * It is recommended to implement the `read` method as an async generator.
 *
 * @example
 *
 * ```ts
 * class MyCatalogModelSource implements CatalogModelSource {
 *   async *read() {
 *     yield {
 *       data: [{ layer: defaultCatalogEntityModel }]
 *     };
 *   }
 * }
 * ```
 *
 * @alpha
 */
export interface CatalogModelSource {
  /**
   * Returns a stream of layers as expressed by this particular source.
   */
  read(
    options?: CatalogModelSourceReadOptions,
  ): AsyncCatalogModelSourceGenerator;
}
