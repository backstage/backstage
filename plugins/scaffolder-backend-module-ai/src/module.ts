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
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { createPrivateAiService } from '@backstage/ai-node/alpha';
import { builtinProviderModules } from '@backstage/ai-node/modules';
import { anthropicProviderModules } from '@backstage/ai-node-provider-anthropic';
import { azureProviderModules } from '@backstage/ai-node-provider-azure';
import { typesafeProviderModules } from '@backstage/ai-node-provider-typesafe';
import { openrouterProviderModules } from '@backstage/ai-node-provider-openrouter';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { createAiGenerateAction, createAiTransformAction } from './actions';

/**
 * @public
 * The AI module for the Scaffolder Backend
 */
export const scaffolderModuleAi = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'ai',
  register(reg) {
    reg.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
        permissions: coreServices.permissions,
        database: coreServices.database,
        auth: coreServices.auth,
        logger: coreServices.logger,
        auditor: coreServices.auditor,
        lifecycle: coreServices.lifecycle,
        pluginMetadata: coreServices.pluginMetadata,
      },
      async init({
        scaffolder,
        config,
        permissions,
        database,
        auth,
        logger,
        auditor,
        lifecycle,
        pluginMetadata,
      }) {
        const ai = await createPrivateAiService({
          deps: {
            database,
            auth,
            permissions,
            logger,
            auditor,
            lifecycle,
            pluginMetadata,
          },
          config,
          providerModules: [
            ...builtinProviderModules,
            ...anthropicProviderModules,
            ...azureProviderModules,
            ...typesafeProviderModules,
            ...openrouterProviderModules,
          ],
        });
        const options = { ai, config, permissions };
        scaffolder.addActions(
          createAiTransformAction(options),
          createAiGenerateAction(options),
        );
      },
    });
  },
});
