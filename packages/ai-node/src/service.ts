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

/**
 * Plugin-scoped {@link AiService} giving backend plugins the managed, low-level
 * Pi Durable primitive.
 *
 * @remarks
 *
 * Each consuming plugin gets its own service instance whose factory composes
 * the native database, auth, permissions, logger, auditor, lifecycle, and
 * plugin metadata services. The factory initializes eagerly
 * (`initialization: 'always'`) so that the module participates in startup
 * enumeration, as required by the ownership and recovery design.
 *
 * Wave 1: the default factory runs the AI migrations, wires the production
 * integration — exclusive namespace lease with startup recovery, fenced Knex
 * Pi storage, guarded model operations with per-attempt permission checks,
 * and the durable attempt journal — and drains local handles when a lease is
 * invalidated. Provider credential configuration is not wired to a config
 * source yet, so model dispatch fails closed with an actionable reason until
 * installation credentials are supplied to the integration.
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
        const integration = await createAiServiceIntegration({ deps });
        const managedService = DefaultAiService.create({ deps, integration });
        integration.onNamespaceInvalidated(namespace =>
          managedService.invalidateNamespace(namespace),
        );
        return managedService;
      },
    }),
});
