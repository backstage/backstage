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

import { OpaqueType } from '@internal/opaque';
import { CatalogModelOp } from './operations';

/**
 * The opaque type that represents a catalog model extension.
 *
 * @internal
 * @remarks
 *
 * Model extensions are essentially an array of operations. Several such model
 * extensions are merged together to form a final outcome.
 */
export const OpaqueCatalogModelExtension = OpaqueType.create<{
  public: CatalogModelExtension;
  versions: {
    readonly version: 'v1';
    readonly pluginId: string;
    readonly modelName?: string;
    readonly ops: Array<CatalogModelOp>;
  };
}>({
  type: '@backstage/CatalogModelExtension',
  versions: ['v1'],
});

/**
 * An opaque type that represents a set of catalog model extensions.
 *
 * @alpha
 */
export interface CatalogModelExtension {
  readonly $$type: '@backstage/CatalogModelExtension';
  readonly pluginId: string;
  readonly modelName?: string;
}
