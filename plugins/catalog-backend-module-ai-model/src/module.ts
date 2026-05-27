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
  CatalogModelSources,
  aiResourceEntityModel,
  mcpServerApiEntityModel,
} from '@backstage/catalog-model/alpha';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

/**
 * Registers support for the AiResource entity kind in the catalog.
 *
 * @public
 */
export const catalogModuleAiResourceEntityModel = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'ai-model',
  register(reg) {
    reg.registerInit({
      deps: {
        model: catalogModelExtensionPoint,
      },
      async init({ model }) {
        model.addModelSource(
          CatalogModelSources.static([
            aiResourceEntityModel,
            mcpServerApiEntityModel,
          ]),
        );
      },
    });
  },
});
