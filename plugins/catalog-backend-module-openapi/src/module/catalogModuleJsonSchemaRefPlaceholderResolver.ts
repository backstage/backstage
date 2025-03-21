/*
 * Copyright 2024 The Backstage Authors
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
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { jsonSchemaRefPlaceholderResolver } from '../jsonSchemaRefPlaceholderResolver';

/**
 * Registers the jsonSchemaRefPlaceholderResolver
 * as placeholder resolver for `$asyncapi` and `$openapi`.
 *
 * @public
 */
export const catalogModuleJsonSchemaRefPlaceholderResolver =
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'json-schema-ref-placeholder-resolver',
    register(env) {
      env.registerInit({
        deps: {
          catalog: catalogProcessingExtensionPoint,
        },
        async init({ catalog }) {
          catalog.addPlaceholderResolver(
            'asyncapi',
            jsonSchemaRefPlaceholderResolver,
          );
          catalog.addPlaceholderResolver(
            'openapi',
            jsonSchemaRefPlaceholderResolver,
          );
        },
      });
    },
  });
