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
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { DefaultAiService } from './DefaultAiService';
import type { AiService } from './contracts';
import { createAiServiceIntegration } from './integration';
import { runAiMigrations } from './migrations';
import {
  AI_INSTALLATION_CONFIG_PATH,
  configureAiInstallation,
} from './config-extension/index';

/**
 * Plugin-scoped {@link AiService} giving backend plugins the managed, low-level
 * Pi Durable primitive.
 *
 * @remarks
 *
 * Each consuming plugin gets its own service instance whose factory composes
 * the native database, root configuration, auth, permissions, logger,
 * auditor, lifecycle, and plugin metadata services. The factory initializes eagerly
 * (`initialization: 'always'`) so that the module participates in startup
 * enumeration, as required by the ownership and recovery design.
 *
 * The default factory runs the AI migrations, reads the installation
 * configuration at {@link AI_INSTALLATION_CONFIG_PATH}, wires the production
 * integration — exclusive namespace lease with startup recovery, fenced Knex
 * Pi storage, guarded model operations with per-attempt permission checks,
 * scoped credential stores, the canonical model catalog, and the durable
 * attempt journal — and drains local handles when a lease is invalidated.
 * Installations that configure nothing keep the fail-closed default: model
 * dispatch is denied with an actionable reason and no model resolves.
 *
 * @alpha
 */
export const aiServiceRef = createServiceRef<AiService>({
  id: 'ai',
  scope: 'plugin',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        database: coreServices.database,
        config: coreServices.rootConfig,
        auth: coreServices.auth,
        permissions: coreServices.permissions,
        logger: coreServices.logger,
        auditor: coreServices.auditor,
        lifecycle: coreServices.lifecycle,
        pluginMetadata: coreServices.pluginMetadata,
      },
      initialization: 'always',
      async factory(deps) {
        await runAiMigrations({
          database: deps.database,
          logger: deps.logger,
        });
        // Installation-scoped configuration supplies the canonical model
        // catalog, the read-only org/service credential stores and the
        // credential precedence. Without it, the integration keeps its
        // fail-closed default: every dispatch is denied with an actionable
        // reason.
        const installation = configureAiInstallation({
          source: { root: deps.config, path: AI_INSTALLATION_CONFIG_PATH },
          db: await deps.database.getClient(),
        });
        const integration = await createAiServiceIntegration({
          deps,
          ...installation,
        });
        const managedService = DefaultAiService.create({ deps, integration });
        integration.onNamespaceInvalidated(namespace =>
          managedService.invalidateNamespace(namespace),
        );
        return managedService;
      },
    }),
});
