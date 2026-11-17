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
 * Wave 0: the default factory creates the scaffold service, whose production
 * `openHarness` calls fail closed until the Wave 1 storage, lease, and guard
 * integration lands.
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
        return DefaultAiService.create({ deps });
      },
    }),
});
