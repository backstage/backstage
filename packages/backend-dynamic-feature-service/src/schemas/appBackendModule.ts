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

import {
  coreServices,
  createBackendModule,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { dynamicPluginsSchemasServiceRef } from './schemas';
import {
  configSchemaExtensionPoint,
  loadCompiledConfigSchema,
} from '@backstage/plugin-app-node';

/** @public */
export const dynamicPluginsFrontendSchemas = createBackendModule({
  pluginId: 'app',
  moduleId: 'core.dynamicplugins.frontendSchemas',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        schemas: dynamicPluginsSchemasServiceRef,
        configSchemaExtension: configSchemaExtensionPoint,
      },
      async init({ config, schemas, configSchemaExtension }) {
        const appPackageName =
          config.getOptionalString('app.packageName') ?? 'app';
        const appDistDir = resolvePackagePath(appPackageName, 'dist');
        const compiledConfigSchema = await loadCompiledConfigSchema(appDistDir);
        if (compiledConfigSchema) {
          configSchemaExtension.setConfigSchema(
            (await schemas.addDynamicPluginsSchemas(compiledConfigSchema))
              .schema,
          );
        }
      },
    });
  },
});
