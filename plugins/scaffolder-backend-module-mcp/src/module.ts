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
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { createMcpCallAction } from './actions';
import { McpServerRegistry } from './services/McpServerRegistry';

/**
 * @public
 * The MCP Module for the Scaffolder Backend.
 *
 * Adds an `mcp:call` action that lets scaffolder templates invoke tools on
 * Model Context Protocol servers configured under `scaffolder.mcpServers.*`.
 */
export const mcpModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'mcp',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        lifecycle: coreServices.lifecycle,
      },
      async init({ scaffolder, config, logger, lifecycle }) {
        const registry = McpServerRegistry.fromConfig(config, { logger });
        scaffolder.addActions(createMcpCallAction({ registry }));
        lifecycle.addShutdownHook(async () => {
          await registry.close();
        });
      },
    });
  },
});
