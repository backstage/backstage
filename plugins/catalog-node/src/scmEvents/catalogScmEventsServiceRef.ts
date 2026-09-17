/*
 * Copyright 2025 The Backstage Authors
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
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { metrics } from '@opentelemetry/api';
import { CatalogScmEventsService } from './types';
import { DefaultCatalogScmEventsService } from './DefaultCatalogScmEventsService';

/**
 * A service that allows publishing and subscribing to source control management
 * system events.
 *
 * @alpha
 * @remarks
 *
 * The default implementation of this service acts in-memory, which requires the
 * producers and consumer (the catalog backend) to be deployed together.
 */
export const catalogScmEventsServiceRef =
  createServiceRef<CatalogScmEventsService>({
    id: 'catalog.scm-events.alpha',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: {},
        createRootContext() {
          return new DefaultCatalogScmEventsService(metrics);
        },
        factory(_, ctx) {
          return ctx;
        },
      }),
  });
