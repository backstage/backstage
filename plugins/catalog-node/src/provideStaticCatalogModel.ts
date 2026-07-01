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

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  CatalogModelLayer,
  CatalogModelSources,
} from '@backstage/catalog-model/alpha';
import { catalogModelExtensionPoint } from './extensions';

/**
 * Creates a backend module that registers static catalog model layers.
 *
 * @alpha
 * @remarks
 *
 * This is a convenience function for registering catalog model layers
 * without having to manually create a backend module and interact with
 * the catalog model extension point. The built-in default catalog entity
 * model is always included automatically.
 *
 * @example
 * ```ts
 * backend.add(
 *   provideStaticCatalogModel({
 *     layers: [scaffolderCatalogModelLayer],
 *   }),
 * );
 * ```
 */
export function provideStaticCatalogModel(options?: {
  layers?: CatalogModelLayer[];
}) {
  return createBackendModule({
    pluginId: 'catalog',
    moduleId: 'static-catalog-model',
    register(reg) {
      reg.registerInit({
        deps: {
          model: catalogModelExtensionPoint,
        },
        async init({ model }) {
          model.addModelSource(
            CatalogModelSources.static(options?.layers ?? []),
          );
        },
      });
    },
  });
}
