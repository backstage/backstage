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
  CatalogModelLayerBuilder,
  createCatalogModelLayerBuilder,
} from './createCatalogModelLayerBuilder';
import { CatalogModelLayer } from './types';

/**
 * Creates a catalog model layer using a builder pattern.
 *
 * @alpha
 * @remarks
 *
 * Plugins can create such catalog model layers to declare various
 * contributions to the overall catalog model, and registering them with the
 * catalog which then forms a complete picture out of them.
 */
export function createCatalogModelLayer(options: {
  /**
   * The unique ID of the model layer.
   *
   * @remarks
   * @example `example.com/MyCustomKind`
   *
   * This identifier is used for purposes of deduplication and tracking. It is
   * expected to be stable and descriptive. Prefer prefixing the ID with a
   * matching domain name. The backstage.io domain name is reserved for use by
   * the Backstage project itself.
   */
  layerId: string;
  builder: (model: CatalogModelLayerBuilder) => void;
}): CatalogModelLayer {
  const b = createCatalogModelLayerBuilder({
    layerId: options.layerId,
  });
  options.builder(b);
  return b.build();
}
