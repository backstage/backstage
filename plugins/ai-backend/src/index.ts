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
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import {
  aiServiceRef,
  bindAiModuleRegistry,
  createAiHttpSupport,
  createAiModuleRegistry,
  createToolPermissions,
} from '@backstage/ai-node/alpha';
import { builtinProviderModules } from '@backstage/ai-node/modules';
import { anthropicProviderModules } from '@backstage/ai-node-provider-anthropic';
import { azureProviderModules } from '@backstage/ai-node-provider-azure';
import { typesafeProviderModules } from '@backstage/ai-node-provider-typesafe';
import { openrouterProviderModules } from '@backstage/ai-node-provider-openrouter';
import { aiModulesExtensionPoint } from './extensions';
import { createRouter } from './router';

/** Backend plugin exposing managed AI sessions to authenticated users. @public */
export default createBackendPlugin({
  pluginId: 'ai',
  register(env) {
    const modules = createAiModuleRegistry({
      providerModules: [
        ...builtinProviderModules,
        ...anthropicProviderModules,
        ...azureProviderModules,
        ...typesafeProviderModules,
        ...openrouterProviderModules,
      ],
      toolModules: [],
    });
    let toolPermissions:
      | ((
          registrations: ReturnType<typeof modules.snapshot>['toolModules'],
        ) => void)
      | undefined;
    env.registerExtensionPoint(aiModulesExtensionPoint, {
      registerProviderModules: modules.registerProviderModules,
      registerToolModules(registrations) {
        modules.registerToolModules(registrations);
        toolPermissions?.(registrations);
      },
    });
    env.registerInit({
      deps: {
        ai: aiServiceRef,
        database: coreServices.database,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
        pluginMetadata: coreServices.pluginMetadata,
        config: coreServices.rootConfig,
      },
      async init({
        ai,
        database,
        auth,
        httpAuth,
        httpRouter,
        permissions,
        permissionsRegistry,
        pluginMetadata,
        config,
      }) {
        toolPermissions = registrations => {
          createToolPermissions({
            tools: registrations.flatMap(module =>
              module.tools.map(tool => ({
                serverId: module.id,
                toolName: tool.name,
              })),
            ),
            authorizer: permissions,
            registry: permissionsRegistry,
          });
        };
        toolPermissions(modules.snapshot().toolModules);
        bindAiModuleRegistry(ai, modules);
        const support = await createAiHttpSupport({
          database,
          auth,
          permissions,
          permissionsRegistry,
          pluginMetadata,
          config,
        });
        httpRouter.use(createRouter({ ai, support, httpAuth }));
      },
    });
  },
});
